import express from 'express';
import { uploadImages, retrieveImage, retrieveImages } from '../controllers/imageController';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// For bulk image upload
router.post('/bulk-upload', upload.array('images'), uploadImages);

// Retrieve a single image by ID
router.get('/retrieve/:imageId', retrieveImage);

// Retrieve all images
router.get('/retrieve-all', retrieveImages);

export { router as imageRoutes };
