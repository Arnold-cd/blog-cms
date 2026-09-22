import JSZip from "jszip";
import type { PostDraft, BlogPost } from "../types";
import { generateMarkdownWithFrontmatter } from "./cmsService";

export interface PublishResult {
  success: boolean;
  message: string;
  postUrl?: string;
  postObj?: BlogPost;
}

/**
 * Creates a downloadable .zip package containing posts/<slug>.md
 * and any attached images/PDFs in images/<filename>.
 */
export async function createDownloadPackage(draft: PostDraft): Promise<Blob> {
  const zip = new JSZip();

  // 1. Generate full markdown content with YAML frontmatter
  const markdownText = generateMarkdownWithFrontmatter(draft);
  const postFileName = `${draft.id || "article"}.md`;
  zip.file(`posts/${postFileName}`, markdownText);

  // 2. Add all uploaded assets (images, PDFs)
  if (draft.assets && draft.assets.length > 0) {
    const imagesFolder = zip.folder("images");
    if (imagesFolder) {
      for (const asset of draft.assets) {
        imagesFolder.file(asset.name, asset.file);
      }
    }
  }

  // 3. Generate ZIP blob
  return await zip.generateAsync({ type: "blob" });
}

/**
 * Publishes an article and its assets directly to GitHub using a Personal Access Token.
 */
export async function publishToGitHub(
  token: string,
  repo: string,
  draft: PostDraft
): Promise<PublishResult> {
  if (!token.trim()) {
    throw new Error("GitHub Personal Access Token is required to publish directly.");
  }

  const cleanRepo = repo.replace(/^https:\/\/github\.com\//, "").replace(/\.git$/, "");
  const headers = {
    Authorization: `Bearer ${token.trim()}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
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
      // file might not exist (returns 404 which is normal for new files)
    }
    return undefined;
  };

  // Helper to convert File or String to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
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
          method: "PUT",
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
    const postPath = `posts/${draft.id || "article"}.md`;
    const postSha = await getFileSha(postPath);

    const postPayload: any = {
      message: `feat(cms): publish post ${draft.title || draft.id} via CMS Studio`,
      content: encodedMd,
    };
    if (postSha) postPayload.sha = postSha;

    const postRes = await fetch(
      `https://api.github.com/repos/${cleanRepo}/contents/${postPath}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(postPayload),
      }
    );

    if (!postRes.ok) {
      const errJson = await postRes.json();
      throw new Error(`Failed to publish article: ${errJson.message || postRes.statusText}`);
    }

    // 3. Construct BlogPost object representation for in-app reader & manifest
    const words = (draft.content || "").split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.round(words / 200));
    const thumbnail = draft.thumbnail || "";
    const cleanThumbnail = !thumbnail
      ? ""
      : thumbnail.startsWith("http") || thumbnail.startsWith("/")
      ? thumbnail
      : `https://raw.githubusercontent.com/${cleanRepo}/main/${thumbnail.replace(/^\.?\//, "")}`;

    const newPostObj: BlogPost = {
      id: draft.id || "article",
      title: draft.title || "Untitled Post",
      summary: draft.summary || "",
      date: draft.date || new Date().toISOString().split("T")[0],
      author: draft.author || "Anonymous",
      category: draft.category || "General",
      thumbnail_url: cleanThumbnail,
      content_url: `https://raw.githubusercontent.com/${cleanRepo}/main/${postPath}`,
      reading_time_min: readingTime,
      language: draft.language || "en",
      featured: draft.featured || false,
      content: mdContent,
    };

    // 4. Update posts.json on GitHub repository directly
    try {
      const postsJsonPath = "posts.json";
      const postsJsonRes = await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${postsJsonPath}`, { headers });
      let currentPosts: BlogPost[] = [];
      let postsJsonSha: string | undefined = undefined;

      if (postsJsonRes.ok) {
        const data = await postsJsonRes.json();
        postsJsonSha = data.sha;
        const decodedContent = decodeURIComponent(escape(atob(data.content.replace(/\s/g, ""))));
        currentPosts = JSON.parse(decodedContent);
      }

      const filtered = currentPosts.filter((p) => p.id !== newPostObj.id);
      const updatedPosts = [newPostObj, ...filtered];
      const encodedPostsJson = btoa(unescape(encodeURIComponent(JSON.stringify(updatedPosts, null, 2))));

      const updatePayload: any = {
        message: `chore(cms): update posts.json manifest for ${draft.title || draft.id} via CMS Studio`,
        content: encodedPostsJson,
      };
      if (postsJsonSha) updatePayload.sha = postsJsonSha;

      await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${postsJsonPath}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updatePayload),
      });
    } catch (manifestErr) {
      console.warn("Direct posts.json update skipped (GitHub Actions will also auto-update):", manifestErr);
    }

    return {
      success: true,
      message: `Published ${postPath} successfully!`,
      postUrl: `https://github.com/${cleanRepo}/blob/main/${postPath}`,
      postObj: newPostObj,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Error publishing to GitHub",
    };
  }
}


/**
 * Permanently deletes an article from GitHub and updates posts.json
 */
export async function deleteFromGitHub(
  token: string,
  repo: string,
  postId: string
): Promise<{ success: boolean; message: string }> {
  if (!token.trim()) {
    throw new Error("GitHub Personal Access Token is required to delete articles.");
  }

  const cleanRepo = repo.replace(/^https:\/\/github\.com\//, "").replace(/\.git$/, "");
  const headers = {
    Authorization: `Bearer ${token.trim()}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };

  const postPath = `posts/${postId}.md`;

  // 1. Get file SHA of posts/<postId>.md
  const fileRes = await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${postPath}`, { headers });
  if (!fileRes.ok) {
    const err = await fileRes.json().catch(() => ({}));
    throw new Error(`Article not found on GitHub: ${err.message || fileRes.statusText}`);
  }
  const fileData = await fileRes.json();
  const fileSha = fileData.sha;

  // 2. Delete the markdown file from GitHub
  const deleteRes = await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${postPath}`, {
    method: "DELETE",
    headers,
    body: JSON.stringify({
      message: `chore(cms): delete article ${postId} via CMS Admin`,
      sha: fileSha,
    }),
  });

  if (!deleteRes.ok) {
    const err = await deleteRes.json().catch(() => ({}));
    throw new Error(`Failed to delete article: ${err.message || deleteRes.statusText}`);
  }

  // 3. Update posts.json manifest directly on GitHub
  try {
    const postsJsonPath = "posts.json";
    const postsJsonRes = await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${postsJsonPath}`, { headers });

    if (postsJsonRes.ok) {
      const data = await postsJsonRes.json();
      const postsJsonSha = data.sha;
      const decodedContent = decodeURIComponent(escape(atob(data.content.replace(/\s/g, ""))));
      const currentPosts: BlogPost[] = JSON.parse(decodedContent);

      const remainingPosts = currentPosts.filter((p) => p.id !== postId);
      const encodedPostsJson = btoa(unescape(encodeURIComponent(JSON.stringify(remainingPosts, null, 2))));

      const updatePayload: any = {
        message: `chore(cms): remove ${postId} from posts.json manifest via CMS Admin`,
        content: encodedPostsJson,
        sha: postsJsonSha,
      };

      await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${postsJsonPath}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updatePayload),
      });
    }
  } catch (manifestErr) {
    console.warn("Could not update posts.json directly via GitHub API, GitHub Actions will handle it:", manifestErr);
  }

  return {
    success: true,
    message: `Article ${postId} deleted successfully from GitHub!`,
  };
}
