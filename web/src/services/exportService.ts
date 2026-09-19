import JSZip from 'jszip';
import type { PostDraft } from '../types';
import { generateMarkdownWithFrontmatter } from './cmsService';

/**
 * Creates a downloadable .zip package containing posts/<slug>.md
 * and any attached images/PDFs in images/<filename>.
 */
export async function createDownloadPackage(draft: PostDraft): Promise<Blob> {
  const zip = new JSZip();

  // 1. Generate full markdown content with YAML frontmatter
  const markdownText = generateMarkdownWithFrontmatter(draft);
  const postFileName = `${draft.id || 'article'}.md`;
  zip.file(`posts/${postFileName}`, markdownText);

  // 2. Add all uploaded assets (images, PDFs)
  if (draft.assets && draft.assets.length > 0) {
    const imagesFolder = zip.folder('images');
    if (imagesFolder) {
      for (const asset of draft.assets) {
        imagesFolder.file(asset.name, asset.file);
      }
    }
  }

  // 3. Generate ZIP blob
  return await zip.generateAsync({ type: 'blob' });
}

/**
 * Publishes an article and its assets directly to GitHub using a Personal Access Token.
 */
export async function publishToGitHub(
  token: string,
  repo: string,
  draft: PostDraft
): Promise<{ success: boolean; message: string }> {
  if (!token.trim()) {
    throw new Error('GitHub Personal Access Token is required to publish directly.');
  }

  const cleanRepo = repo.replace(/^https:\/\/github\.com\//, '').replace(/\.git$/, '');
  const headers = {
    Authorization: `Bearer ${token.trim()}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  // Helper to get existing file SHA if updating
  const getFileSha = async (path: string): Promise<string | undefined> => {
    try {
      const res = await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${path}`, { headers });
      if (res.ok) {
        const data = await res.json();
        return data.sha;
      }
    } catch {
      // file might not exist
    }
    return undefined;
  };

  // Helper to convert File or String to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  try {
    // 1. Upload all attached media (images and PDFs)
    for (const asset of draft.assets) {
      const path = `images/${asset.name}`;
      const sha = await getFileSha(path);
      const base64Content = await fileToBase64(asset.file);

      const payload: any = {
        message: `feat(cms): upload asset ${asset.name} via CMS Studio`,
        content: base64Content,
      };
      if (sha) payload.sha = sha;

      const uploadRes = await fetch(
        `https://api.github.com/repos/${cleanRepo}/contents/${path}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload),
        }
      );

      if (!uploadRes.ok) {
        const errJson = await uploadRes.json();
        throw new Error(`Failed to upload ${asset.name}: ${errJson.message || uploadRes.statusText}`);
      }
    }

    // 2. Upload Markdown article to posts/<id>.md
    const mdContent = generateMarkdownWithFrontmatter(draft);
    // Base64 encode markdown string supporting Unicode (UTF-8)
    const encodedMd = btoa(unescape(encodeURIComponent(mdContent)));
    const postPath = `posts/${draft.id || 'article'}.md`;
    const postSha = await getFileSha(postPath);

    const postPayload: any = {
      message: `feat(cms): publish post ${draft.title || draft.id} via CMS Studio`,
      content: encodedMd,
    };
    if (postSha) postPayload.sha = postSha;

    const postRes = await fetch(
      `https://api.github.com/repos/${cleanRepo}/contents/${postPath}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(postPayload),
      }
    );

    if (!postRes.ok) {
      const errJson = await postRes.json();
      throw new Error(`Failed to publish article: ${errJson.message || postRes.statusText}`);
    }

    return {
      success: true,
      message: `Published ${postPath} successfully! GitHub Actions is now building and deploying your article.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Error publishing to GitHub',
    };
  }
}
