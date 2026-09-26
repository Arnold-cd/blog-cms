export interface GoogleDriveDocData {
  fileId: string;
  pdfUrl: string;
  coverUrl: string;
  previewUrl: string;
  suggestedTitle: string;
  suggestedSlug: string;
}

/**
 * Extracts the Google Drive File ID from various link structures:
 * - https://drive.google.com/file/d/1A2B3C4D5E.../view?usp=sharing
 * - https://drive.google.com/file/d/1A2B3C4D5E.../view
 * - https://drive.google.com/open?id=1A2B3C4D5E...
 * - https://drive.google.com/uc?id=1A2B3C4D5E...
 * - https://docs.google.com/file/d/1A2B3C4D5E...
 * - Raw 33-char alphanumeric file ID
 */
export function extractGoogleDriveId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Pattern 1: /file/d/{id} or /d/{id}
  const fileDMatch = trimmed.match(/(?:\/file\/d\/|\/d\/)([a-zA-Z0-9_-]{25,})/);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  // Pattern 2: id={id}
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{25,})/);
  if (idParamMatch && idParamMatch[1]) {
    return idParamMatch[1];
  }

  // Pattern 3: Direct raw ID
  if (/^[a-zA-Z0-9_-]{25,50}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Generates direct download stream and auto-generated high-resolution thumbnail
 * URLs from a Google Drive file link.
 */
export function parseGoogleDriveUrl(driveUrl: string): GoogleDriveDocData {
  const fileId = extractGoogleDriveId(driveUrl);
  if (!fileId) {
    throw new Error(
      'Invalid Google Drive link. Please copy the link from Google Drive (e.g. "Anyone with the link can view").'
    );
  }

  // Direct download link with confirm parameter for large files (>100MB)
  const pdfUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;

  // Google Drive provides automatic high-res thumbnails for documents (sz=w800 produces crisp cover)
  const coverUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;

  // Standard web preview modal URL
  const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;

  return {
    fileId,
    pdfUrl,
    coverUrl,
    previewUrl,
    suggestedTitle: `Google Drive Document`,
    suggestedSlug: `gdrive-${fileId.slice(0, 10).toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
  };
}
