import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { applyTransformations } from '../services/imageService';

// Define the path to the uploads folder
const uploadsFolderPath = path.join(__dirname, '../../uploads');

// Ensure the uploads folder exists, or create it if it doesn't
if (!fs.existsSync(uploadsFolderPath)) {
  fs.mkdirSync(uploadsFolderPath);
}

export const uploadImages = async (req: Request, res: Response) => {
  try {
    const { files } = req;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const imageIds: string[] = [];

    for (const file of files) {
      const imageId = uuidv4();
      const transformedImage = await applyTransformations(file.buffer);

      // Save the transformed image to the uploads folder
      const imagePath = path.join(uploadsFolderPath, `${imageId}.jpg`);
      fs.writeFileSync(imagePath, transformedImage);

      imageIds.push(imageId);
    }

    res.json({ imageIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const retrieveImage = (req: Request, res: Response) => {
  const { imageId } = req.params;
  const imagePath = path.join(uploadsFolderPath, `${imageId}.jpg`);

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: 'Image not found.' });
  }

  // Read and send the image from the uploads folder
  const imageBuffer = fs.readFileSync(imagePath);

  res.setHeader('Content-Type', 'image/jpeg');
  res.send(imageBuffer);
};

interface ImageData {
  imageId: string;
  imageData: Buffer;
}

export const retrieveImages = (req: Request, res: Response) => {
  try {
    // Read the contents of the uploads folder to get a list of image files
    fs.readdir(uploadsFolderPath, (err, files) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      // Filter the list to include only image files (e.g., JPEG)
      const imageFiles = files.filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
      });

      // Extract image IDs from file names (assuming image files are named as UUIDs)
      const imageIds = imageFiles.map((file) => path.basename(file, path.extname(file)));

      if (!Array.isArray(imageIds) || imageIds.length === 0) {
        return res.status(400).json({ error: 'Invalid or empty image IDs array.' });
      }

      const imagesData = [];

      for (const imageId of imageIds) {
        const imagePath = path.join(uploadsFolderPath, `${imageId}.jpg`);

        if (fs.existsSync(imagePath)) {
          // Read the image data from the uploads folder
          const imageBuffer = fs.readFileSync(imagePath);
          imagesData.push({ imageId, imageData: imageBuffer });
        }
      }

      // Set the response content type to indicate binary data (image/jpeg in this case)
      res.setHeader('Content-Type', 'application/json');
      
      // Send the list of image IDs and their binary image data as JSON
      res.json({ images: imagesData });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
