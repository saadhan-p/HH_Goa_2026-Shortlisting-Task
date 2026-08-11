/**
 * Dynamic import and client-side conversion of HEIC/HEIF images to JPEG using heic2any.
 */
export async function convertHeicToJpeg(file: File): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new Error('HEIC conversion can only be performed in the browser.');
  }

  try {
    const heic2any = (await import('heic2any')).default;
    
    const result = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.9,
    });

    if (Array.isArray(result)) {
      return result[0];
    }
    return result;
  } catch (error) {
    console.error('HEIC conversion failed:', error);
    throw new Error('Failed to process HEIC image. Make sure the file is not corrupt.');
  }
}
