import sharp from 'sharp';

export const applyTransformations = async (imageBuffer: Buffer): Promise<Buffer> => {
    try {
      // Apply image transformations using the 'sharp' library
      const transformedImageBuffer = await sharp(imageBuffer)
        .resize(300, 200) // Resize the image to a specific width and height
        .jpeg({ quality: 80 }) // Convert the image to JPEG format with 80% quality (adjust as needed)
        .toBuffer(); // Convert the transformed image to a Buffer
  
      return transformedImageBuffer;
    } catch (error) {
      // Handle any errors that occur during transformation
      console.error('Error applying transformations:', error);
      throw error; // You can choose to rethrow the error or handle it differently
    }
  };
