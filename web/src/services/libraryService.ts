import type { PdfDocument, PdfUploadPayload } from '../types';
import * as pdfjsLib from 'pdfjs-dist';

const LOCAL_LIBRARY_URL = './library.json';
const GITHUB_RAW_LIBRARY_URL =
  'https://raw.githubusercontent.com/Arnold-cd/blog-cms/main/library.json';

export interface ExtractedPdfInfo {
  pageCount: number;
  coverFile: File;
  coverPreviewUrl: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
}

export function formatFileSize(sizeBytes: number): string {
  if (sizeBytes < 1024) return `${sizeBytes} B`;
  if (sizeBytes < 1024 * 1024) return `${(sizeBytes / 1024).toFixed(1)} KB`;
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Resolves a PDF or cover asset URL to local relative './library/...' or Vercel CDN,
 * bypassing GitHub raw 404s on private repositories.
 */
export function resolvePdfAssetUrl(rawUrl: string | undefined): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  const rawBase = 'https://raw.githubusercontent.com/Arnold-cd/blog-cms/main';
  if (trimmed.startsWith(rawBase)) {
    return trimmed.replace(rawBase, '.');
  }
  return trimmed;
}

/**
 * Loads the library document manifest from local or GitHub Pages CDN.
 */
export async function fetchLibraryDocuments(): Promise<PdfDocument[]> {
  try {
    const res = await fetch(LOCAL_LIBRARY_URL);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Local library.json fetch failed, falling back to GitHub raw URL', err);
  }

  // Fallback to GitHub raw
  const rawRes = await fetch(GITHUB_RAW_LIBRARY_URL);
  if (!rawRes.ok) {
    throw new Error(`Failed to load library manifest (HTTP ${rawRes.status})`);
  }
  return await rawRes.json();
}

/**
 * Extracts Page 1 as high-res cover thumbnail and retrieves metadata like page count.
 */
export async function extractPdfInfo(file: File): Promise<ExtractedPdfInfo> {
  const arrayBuffer = await file.arrayBuffer();

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    cMapUrl: './cmaps/',
    cMapPacked: true,
    standardFontDataUrl: './standard_fonts/',
  });

  const pdf = await loadingTask.promise;
  const pageCount = pdf.numPages;

  // Render Page 1 as cover
  const page = await pdf.getPage(1);
  const unscaledViewport = page.getViewport({ scale: 1.0 });

  const maxTargetWidth = 1200;
  const optimalScale = Math.min(2.0, Math.max(1.2, maxTargetWidth / unscaledViewport.width));
  const viewport = page.getViewport({ scale: optimalScale });

  const renderCanvas = document.createElement('canvas');
  renderCanvas.width = Math.floor(viewport.width);
  renderCanvas.height = Math.floor(viewport.height);
  const renderCtx = renderCanvas.getContext('2d');

  if (!renderCtx) {
    throw new Error('Canvas 2D context not available for rendering cover.');
  }

  await page.render({
    canvas: renderCanvas,
    canvasContext: renderCtx,
    viewport: viewport,
  }).promise;

  // Composite onto crisp white paper background
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = renderCanvas.width;
  finalCanvas.height = renderCanvas.height;
  const finalCtx = finalCanvas.getContext('2d');

  if (!finalCtx) {
    throw new Error('Final canvas context not available.');
  }

  finalCtx.fillStyle = '#ffffff';
  finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
  finalCtx.drawImage(renderCanvas, 0, 0);

  const coverBlob = await new Promise<Blob | null>((resolve) =>
    finalCanvas.toBlob(resolve, 'image/png', 0.95)
  );

  if (!coverBlob) {
    throw new Error('Failed to generate PNG cover thumbnail from PDF.');
  }

  const baseSlug = file.name.replace(/\.pdf$/i, '').toLowerCase().replace(/[^a-z0-9.-]/g, '-');
  const coverFileName = `${baseSlug}-cover.png`;
  const coverFile = new File([coverBlob], coverFileName, { type: 'image/png' });
  const coverPreviewUrl = URL.createObjectURL(coverBlob);

  return {
    pageCount,
    coverFile,
    coverPreviewUrl,
    fileSizeBytes: file.size,
    fileSizeFormatted: formatFileSize(file.size),
  };
}

// Helpers for GitHub API Base64 encoding
function fileToBase64(file: File): Promise<string> {
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
}

/**
 * Publishes a PDF file, its cover image, and updates library.json directly on GitHub.
 */
export async function publishPdfToGitHub(
  token: string,
  repo: string,
  payload: PdfUploadPayload,
  onProgress?: (msg: string) => void
): Promise<{ success: boolean; message: string; doc?: PdfDocument }> {
  if (!token.trim()) {
    throw new Error('GitHub Personal Access Token is required to upload to the repository.');
  }

  const cleanRepo = repo.replace(/^https:\/\/github\.com\//, '').replace(/\.git$/, '');
  const headers = {
    Authorization: `Bearer ${token.trim()}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  const getFileSha = async (path: string): Promise<string | undefined> => {
    try {
      const res = await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${path}`, { headers });
      if (res.ok) {
        const data = await res.json();
        return data.sha;
      }
    } catch {
      // not found
    }
    return undefined;
  };

  try {
    // 1. Upload PDF file
    onProgress?.('Uploading PDF document to repository...');
    const pdfPath = `library/pdfs/${payload.pdfFile.name}`;
    const pdfSha = await getFileSha(pdfPath);
    const pdfBase64 = await fileToBase64(payload.pdfFile);

    const pdfUploadRes = await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${pdfPath}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `feat(library): upload PDF document ${payload.pdfFile.name}`,
        content: pdfBase64,
        ...(pdfSha ? { sha: pdfSha } : {}),
      }),
    });

    if (!pdfUploadRes.ok) {
      const err = await pdfUploadRes.json().catch(() => ({}));
      throw new Error(`Failed to upload PDF: ${err.message || pdfUploadRes.statusText}`);
    }

    // 2. Upload Cover Image
    onProgress?.('Uploading document cover thumbnail...');
    const coverPath = `library/covers/${payload.coverFile.name}`;
    const coverSha = await getFileSha(coverPath);
    const coverBase64 = await fileToBase64(payload.coverFile);

    const coverUploadRes = await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${coverPath}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `feat(library): upload cover thumbnail ${payload.coverFile.name}`,
        content: coverBase64,
        ...(coverSha ? { sha: coverSha } : {}),
      }),
    });

    if (!coverUploadRes.ok) {
      console.warn('Cover upload warning:', await coverUploadRes.text());
    }

    // 3. Update library.json
    onProgress?.('Updating library.json catalog manifest...');
    const manifestPath = 'library.json';
    const manifestSha = await getFileSha(manifestPath);

    let existingDocs: PdfDocument[] = [];
    if (manifestSha) {
      try {
        const res = await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${manifestPath}`, { headers });
        if (res.ok) {
          const data = await res.json();
          const decoded = decodeURIComponent(escape(atob(data.content.replace(/\s/g, ''))));
          existingDocs = JSON.parse(decoded);
        }
      } catch (err) {
        console.warn('Could not read existing library.json from GitHub:', err);
      }
    }

    const rawBaseUrl = `https://raw.githubusercontent.com/${cleanRepo}/main`;
    const newDoc: PdfDocument = {
      id: payload.id,
      title: payload.title,
      description: payload.description,
      author: payload.author,
      category: payload.category,
      language: payload.language,
      published_date: payload.published_date,
      file_name: payload.pdfFile.name,
      pdf_url: `${rawBaseUrl}/library/pdfs/${payload.pdfFile.name}`,
      cover_url: `${rawBaseUrl}/library/covers/${payload.coverFile.name}`,
      page_count: payload.page_count,
      file_size_bytes: payload.file_size_bytes,
      file_size_formatted: payload.file_size_formatted,
      featured: payload.featured,
      tags: payload.tags,
    };

    const updatedDocs = [
      newDoc,
      ...existingDocs.filter((d) => d.id !== payload.id),
    ];

    const encodedManifest = btoa(unescape(encodeURIComponent(JSON.stringify(updatedDocs, null, 2))));
    const manifestUploadRes = await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${manifestPath}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `chore(library): register ${newDoc.title} in library.json manifest`,
        content: encodedManifest,
        ...(manifestSha ? { sha: manifestSha } : {}),
      }),
    });

    if (!manifestUploadRes.ok) {
      console.warn('Manifest direct update warning, CI will sync:', await manifestUploadRes.text());
    }

    return {
      success: true,
      message: `"${newDoc.title}" successfully published to PDF Library!`,
      doc: newDoc,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Error publishing PDF to GitHub',
    };
  }
}

/**
 * Permanently deletes a PDF document from GitHub repository and updates library.json
 */
export async function deletePdfFromGitHub(
  token: string,
  repo: string,
  doc: PdfDocument
): Promise<{ success: boolean; message: string }> {
  if (!token.trim()) {
    throw new Error('GitHub Personal Access Token is required to delete documents.');
  }

  const cleanRepo = repo.replace(/^https:\/\/github\.com\//, '').replace(/\.git$/, '');
  const headers = {
    Authorization: `Bearer ${token.trim()}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  const getFileSha = async (path: string): Promise<string | undefined> => {
    try {
      const res = await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${path}`, { headers });
      if (res.ok) {
        const data = await res.json();
        return data.sha;
      }
    } catch {}
    return undefined;
  };

  // 1. Delete PDF file if exists
  const pdfPath = `library/pdfs/${doc.file_name}`;
  const pdfSha = await getFileSha(pdfPath);
  if (pdfSha) {
    await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${pdfPath}`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({
        message: `chore(library): delete PDF document ${doc.file_name}`,
        sha: pdfSha,
      }),
    });
  }

  // 2. Delete cover image if exists
  const coverName = doc.cover_url.split('/').pop();
  if (coverName) {
    const coverPath = `library/covers/${coverName}`;
    const coverSha = await getFileSha(coverPath);
    if (coverSha) {
      await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${coverPath}`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({
          message: `chore(library): delete cover image ${coverName}`,
          sha: coverSha,
        }),
      });
    }
  }

  // 3. Update library.json manifest
  try {
    const manifestPath = 'library.json';
    const manifestSha = await getFileSha(manifestPath);
    if (manifestSha) {
      const res = await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${manifestPath}`, { headers });
      if (res.ok) {
        const data = await res.json();
        const decoded = decodeURIComponent(escape(atob(data.content.replace(/\s/g, ''))));
        const currentDocs: PdfDocument[] = JSON.parse(decoded);
        const remainingDocs = currentDocs.filter((d) => d.id !== doc.id);
        const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(remainingDocs, null, 2))));

        await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${manifestPath}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            message: `chore(library): remove ${doc.id} from library.json manifest`,
            content: encoded,
            sha: manifestSha,
          }),
        });
      }
    }
  } catch (err) {
    console.warn('Could not update library.json during deletion:', err);
  }

  return {
    success: true,
    message: `Document "${doc.title}" removed from repository.`,
  };
}
