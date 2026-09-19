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
 * Converts a PDF file into crisp, screen-optimized PNG images.
 * Caps maximum pixel width at 1600px for crisp high-DPI retina display
 * without blowing out memory or layout containers.
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
    const unscaledViewport = page.getViewport({ scale: 1.0 });

    // Target a crisp 1600px width (or 2x if smaller) for retina sharpness
    const maxTargetWidth = 1600;
    const optimalScale = Math.min(2.0, Math.max(1.5, maxTargetWidth / unscaledViewport.width));
    const viewport = page.getViewport({ scale: optimalScale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext('2d', { alpha: false });

    if (!ctx) continue;

    // Fill white background for PDF page before rendering
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
