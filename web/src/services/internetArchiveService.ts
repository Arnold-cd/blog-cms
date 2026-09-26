export interface ArchiveItemData {
  id: string;
  title: string;
  author: string;
  description: string;
  pdfUrl: string;
  coverUrl: string;
  pageCount: number;
  fileSizeBytes: number;
  fileSizeFormatted: string;
}

/**
 * Extracts clean identifier from an Internet Archive URL or ID string.
 * Supports:
 * - https://archive.org/details/principlesofecon0000mars
 * - https://archive.org/download/principlesofecon0000mars/...
 * - principlesofecon0000mars
 */
export function extractArchiveId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/archive\.org\/(?:details|download)\/([^/?#]+)/i);
  if (match && match[1]) {
    return match[1];
  }
  // Remove any trailing slashes or parameters
  return trimmed.split('/')[0].split('?')[0];
}

/**
 * Queries Internet Archive Metadata API to retrieve book/article details,
 * auto-resolves the primary PDF file and the official cover thumbnail.
 */
export async function fetchFromInternetArchive(input: string): Promise<ArchiveItemData> {
  const cleanId = extractArchiveId(input);
  if (!cleanId) {
    throw new Error('Please enter a valid Internet Archive ID or URL.');
  }

  const res = await fetch(`https://archive.org/metadata/${encodeURIComponent(cleanId)}`);
  if (!res.ok) {
    throw new Error(`Could not find document on Internet Archive (Status ${res.status}). Check the ID.`);
  }

  const data = await res.json();
  if (!data || !data.metadata) {
    throw new Error('No metadata returned from Internet Archive for this identifier.');
  }

  const meta = data.metadata;
  const files: any[] = Array.isArray(data.files) ? data.files : [];

  // Find the primary PDF file (ignore text-only or OCR derivatives if original exists)
  const pdfCandidates = files.filter(
    (f) => typeof f.name === 'string' && f.name.toLowerCase().endsWith('.pdf')
  );

  if (pdfCandidates.length === 0) {
    throw new Error('This Internet Archive item does not contain a downloadable PDF document.');
  }

  // Prioritize original document over text derivatives
  const primaryPdf =
    pdfCandidates.find((f) => !f.name.toLowerCase().includes('_text.pdf')) || pdfCandidates[0];

  const pdfUrl = `https://archive.org/download/${cleanId}/${encodeURIComponent(primaryPdf.name)}`;
  const coverUrl = `https://archive.org/services/img/${cleanId}`;

  const sizeBytes = parseInt(primaryPdf.size || '0', 10);
  const fileSizeFormatted =
    sizeBytes > 0
      ? sizeBytes < 1024 * 1024
        ? `${(sizeBytes / 1024).toFixed(1)} KB`
        : `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`
      : 'Hosted on Archive.org';

  // Extract description if present
  let cleanDescription = '';
  if (typeof meta.description === 'string') {
    cleanDescription = meta.description
      .replace(/<[^>]*>?/gm, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 300);
  }

  const rawTitle = meta.title || cleanId.replace(/[-_]+/g, ' ');
  const title = typeof rawTitle === 'string' ? rawTitle.trim() : String(rawTitle);

  const rawCreator = meta.creator || 'SLLK Archives';
  const author = Array.isArray(rawCreator) ? rawCreator.join(', ') : String(rawCreator);

  // Extract page count if available
  const pageCount = parseInt(meta.imagecount || primaryPdf.pagecount || '0', 10);

  return {
    id: cleanId,
    title,
    author,
    description: cleanDescription,
    pdfUrl,
    coverUrl,
    pageCount: isNaN(pageCount) ? 0 : pageCount,
    fileSizeBytes: isNaN(sizeBytes) ? 0 : sizeBytes,
    fileSizeFormatted,
  };
}
