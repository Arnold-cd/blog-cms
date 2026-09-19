// Ensure critical polyfills for PDF.js across all browser versions
if (typeof Uint8Array !== 'undefined' && !(Uint8Array.prototype as any).toHex) {
  (Uint8Array.prototype as any).toHex = function () {
    return Array.from(this as Uint8Array)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };
}

if (typeof (Promise as any).withResolvers === 'undefined') {
  (Promise as any).withResolvers = function <T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set bundled worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
} catch {
  // fallback if worker cannot be set
}

export interface RenderedPdfPage {
  name: string;
  file: File;
  previewUrl: string;
  pageNumber: number;
}

/**
 * Converts a PDF file into crisp, high-resolution PNG images.
 * Uses a clean rendering pipeline with local cMaps and fonts to guarantee
 * all text, graphics, and forms render accurately as pictures.
 */
export async function convertPdfToImages(
  file: File,
  maxPages: number = 10
): Promise<RenderedPdfPage[]> {
  const arrayBuffer = await file.arrayBuffer();

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    cMapUrl: './cmaps/',
    cMapPacked: true,
    standardFontDataUrl: './standard_fonts/',
  });

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

    // Target a crisp 1600px width for retina sharpness while maintaining aspect ratio
    const maxTargetWidth = 1600;
    const optimalScale = Math.min(2.5, Math.max(1.5, maxTargetWidth / unscaledViewport.width));
    const viewport = page.getViewport({ scale: optimalScale });

    // 1. Render PDF onto a dedicated clean canvas
    const renderCanvas = document.createElement('canvas');
    renderCanvas.width = Math.floor(viewport.width);
    renderCanvas.height = Math.floor(viewport.height);
    const renderCtx = renderCanvas.getContext('2d');

    if (!renderCtx) continue;

    await page.render({
      canvas: renderCanvas,
      canvasContext: renderCtx,
      viewport: viewport,
    }).promise;

    // 2. Composite onto white background canvas to ensure transparent PDF pages have solid white paper
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = renderCanvas.width;
    finalCanvas.height = renderCanvas.height;
    const finalCtx = finalCanvas.getContext('2d');

    if (!finalCtx) continue;

    finalCtx.fillStyle = '#ffffff';
    finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    finalCtx.drawImage(renderCanvas, 0, 0);

    // 3. Export as PNG image blob
    const blob = await new Promise<Blob | null>((resolve) =>
      finalCanvas.toBlob(resolve, 'image/png', 0.95)
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
