
/**
 * Utility to interact with the MemeSmith serverless image processing API
 */

export interface TextOverlay {
  content: string;
  x: number;
  y: number;
  fontSize?: number;
  color?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export interface ProcessImageOptions {
  texts: TextOverlay[];
}

/**
 * Sends an image to the serverless function for processing with text overlays
 * 
 * @param imageFile - The image file to process
 * @param options - Processing options including text overlays
 * @returns A Promise that resolves to a processed image URL or Blob
 */
export const processImage = async (
  imageFile: File,
  options: ProcessImageOptions
): Promise<Blob> => {
  // Create form data
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('settings', JSON.stringify(options));
  
  try {
    const response = await fetch('/api/process-image', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to process image');
    }
    
    // Return the processed image as a blob
    return await response.blob();
    
  } catch (error) {
    console.error('Error in image processing:', error);
    throw error;
  }
};

/**
 * Creates a download link for a processed image blob
 * 
 * @param imageBlob - The processed image blob
 * @param filename - The filename to use for the download
 */
export const downloadProcessedImage = (imageBlob: Blob, filename = 'memesmith-creation.png'): void => {
  const url = URL.createObjectURL(imageBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
