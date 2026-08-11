/**
 * Web Share API and X (Twitter) sharing utilities.
 */

export const DEFAULT_SHARE_CAPTION = `I just unlocked my HH Goa 2026 builder identity ⚡

Ready to build, break, experiment and ship.
See you in Goa.

#FrameInGoa #HHGoa`;

/**
 * Checks if the Web Share API supports file sharing.
 */
export function isFileSharingSupported(file: File): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as any;
  return !!(
    'share' in nav &&
    'canShare' in nav &&
    nav.canShare({ files: [file] })
  );
}

/**
 * Converts canvas to a PNG file.
 */
export function getCanvasFile(
  canvas: HTMLCanvasElement,
  filename: string
): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty or conversion failed'));
        return;
      }
      const file = new File([blob], filename, { type: 'image/png' });
      resolve(file);
    }, 'image/png');
  });
}

/**
 * Direct file download from canvas.
 */
export function downloadCanvasImage(canvas: HTMLCanvasElement, filename: string) {
  try {
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Download failed:', error);
    alert('Download failed. Please long-press the preview image to save it.');
  }
}

/**
 * Shares the card or falls back to download + X Intent.
 */
export async function shareBuilderCard(
  canvas: HTMLCanvasElement,
  filename: string,
  caption: string = DEFAULT_SHARE_CAPTION
): Promise<{ shared: boolean; downloaded: boolean }> {
  try {
    const file = await getCanvasFile(canvas, filename);
    
    // Check if Web Share with file is supported
    if (isFileSharingSupported(file)) {
      await navigator.share({
        files: [file],
        title: 'HH Goa 2026 Builder Card',
        text: caption,
      });
      return { shared: true, downloaded: false };
    }
  } catch (error) {
    // If user cancelled sharing, just return and do not do fallback
    if (error instanceof Error && error.name === 'AbortError') {
      return { shared: false, downloaded: false };
    }
    console.warn('Native share failed or was aborted, falling back to download + X compose.', error);
  }

  // Fallback: Trigger download & open X intent compose
  downloadCanvasImage(canvas, filename);
  
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`;
  window.open(xUrl, '_blank', 'noopener,noreferrer');
  
  return { shared: false, downloaded: true };
}
