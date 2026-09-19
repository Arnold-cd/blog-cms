import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set local bundled worker for 100% offline & fast rendering
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export interface RenderedPdfPage {
  name: string;
  file: File;
  previewUrl: string;
  pageNumber: number;
}

/**
 * Converts a PDF file into high-resolution PNG images (one per page).
 */
export async function convertPdfToImages(
  file: File,
  maxPages: number = 10
): Promise<RenderedPdfPage[]> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const pageCount = Math.min(pdf.numPages, maxPages);
  const result: RenderedPdfPage[] = [];

  const baseName = file.name
    .replace(/\.pdf$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-');

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    // 2x viewport scale for crisp high-DPI text rendering
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) continue;

    await page.render({
      canvas: canvas,
      canvasContext: ctx,
      viewport: viewport,
    }).promise;

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png', 0.95)
    );

    if (blob) {
      const pageName = `${baseName}-p${i}.png`;
      const imgFile = new File([blob], pageName, { type: 'image/png' });
      const previewUrl = URL.createObjectURL(blob);
      result.push({
        name: pageName,
        file: imgFile,
        previewUrl,
        pageNumber: i,
      });
    }
  }

  return result;
}
