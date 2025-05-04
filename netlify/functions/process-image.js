
const sharp = require('sharp');
const formidable = require('formidable');
const { Buffer } = require('buffer');

/**
 * Netlify Function for MemeSmith image processing
 * 
 * Accepts:
 * - Image file (via multipart form)
 * - JSON data with text overlay settings
 * 
 * Process:
 * - Resizes to mobile-optimized resolution
 * - Adds text overlays at specified positions
 * - Compresses and returns PNG
 */
exports.handler = async function(event, context) {
  // Only allow POST method
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  console.log('Processing new meme request');
  
  try {
    // Parse multipart form data (for file upload)
    const { fields, files } = await parseFormData(event);
    
    // Check if we have a file
    if (!files.image) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No image file provided' })
      };
    }
    
    // Get overlay text settings from fields
    let overlaySettings;
    try {
      overlaySettings = fields.settings ? JSON.parse(fields.settings) : {};
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid text overlay settings JSON' })
      };
    }
    
    // Process the image
    const processedImageBuffer = await processImage(files.image.filepath, overlaySettings);
    
    // Return the processed image
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="memesmith-processed.png"'
      },
      body: processedImageBuffer.toString('base64'),
      isBase64Encoded: true
    };
    
  } catch (error) {
    console.error('Error processing image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error processing image', details: error.message })
    };
  }
};

/**
 * Parse multipart form data from Netlify Function event
 */
async function parseFormData(event) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });
    
    form.parse(event, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
}

/**
 * Process the image with Sharp
 * @param {string} imagePath - Path to the uploaded image file
 * @param {object} settings - Text overlay settings
 * @returns {Promise<Buffer>} - Processed image as Buffer
 */
async function processImage(imagePath, settings) {
  // Default settings for mobile resolution
  const DEFAULT_WIDTH = 1080;
  const DEFAULT_HEIGHT = 1920;
  const MAX_DIMENSION = 1920;
  
  try {
    // Start with the original image
    let imageProcess = sharp(imagePath);
    
    // Get image metadata
    const metadata = await imageProcess.metadata();
    console.log(`Original image: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);
    
    // Calculate resize dimensions while preserving aspect ratio
    let resizeWidth, resizeHeight;
    const aspectRatio = metadata.width / metadata.height;
    
    if (aspectRatio > 1) {
      // Landscape
      resizeWidth = Math.min(DEFAULT_WIDTH, MAX_DIMENSION);
      resizeHeight = Math.round(resizeWidth / aspectRatio);
    } else {
      // Portrait
      resizeHeight = Math.min(DEFAULT_HEIGHT, MAX_DIMENSION);
      resizeWidth = Math.round(resizeHeight * aspectRatio);
    }
    
    // Resize image
    imageProcess = imageProcess.resize(resizeWidth, resizeHeight, {
      fit: 'inside',
      withoutEnlargement: true
    });
    
    // Create text overlays if provided
    if (settings.texts && Array.isArray(settings.texts) && settings.texts.length > 0) {
      const svgTextOverlays = [];
      
      settings.texts.forEach(textItem => {
        if (!textItem.content) return;
        
        // Default text settings
        const fontSize = textItem.fontSize || 60;
        const fontColor = textItem.color || 'white';
        const strokeColor = textItem.strokeColor || 'black';
        const strokeWidth = textItem.strokeWidth || 2;
        const x = textItem.x || resizeWidth / 2;
        const y = textItem.y || 100;
        
        // Create SVG for this text with stroke
        const svgText = `
          <svg width="${resizeWidth}" height="${resizeHeight}">
            <style>
              .meme-text {
                font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
                font-weight: bold;
                font-size: ${fontSize}px;
                text-anchor: middle;
                paint-order: stroke;
                stroke: ${strokeColor};
                stroke-width: ${strokeWidth}px;
                stroke-linecap: round;
                stroke-linejoin: round;
                fill: ${fontColor};
              }
            </style>
            <text x="${x}" y="${y}" class="meme-text">${textItem.content}</text>
          </svg>
        `;
        
        svgTextOverlays.push({
          input: Buffer.from(svgText),
          top: 0,
          left: 0
        });
      });
      
      // Composite text overlays onto the image
      if (svgTextOverlays.length > 0) {
        imageProcess = imageProcess.composite(svgTextOverlays);
      }
    }
    
    // Add MemeSmith watermark
    const watermarkSvg = `
      <svg width="${resizeWidth}" height="${resizeHeight}">
        <style>
          .watermark {
            font-family: Arial, sans-serif;
            font-size: 18px;
            font-weight: bold;
            text-anchor: end;
            fill: rgba(255, 255, 255, 0.7);
            stroke: rgba(0, 0, 0, 0.5);
            stroke-width: 0.5px;
          }
        </style>
        <text x="${resizeWidth - 10}" y="${resizeHeight - 10}" class="watermark">MemeSmith.com</text>
      </svg>
    `;
    
    // Composite watermark
    imageProcess = imageProcess.composite([{
      input: Buffer.from(watermarkSvg),
      top: 0,
      left: 0
    }]);
    
    // Compress and output as PNG
    return await imageProcess.png({ quality: 90 }).toBuffer();
    
  } catch (error) {
    console.error('Error in image processing:', error);
    throw error;
  }
}
