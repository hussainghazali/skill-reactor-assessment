"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveImages = exports.retrieveImage = exports.uploadImages = void 0;
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const imageService_1 = require("../services/imageService");
// Define the path to the uploads folder
const uploadsFolderPath = path_1.default.join(__dirname, '../../uploads');
// Ensure the uploads folder exists, or create it if it doesn't
if (!fs_1.default.existsSync(uploadsFolderPath)) {
    fs_1.default.mkdirSync(uploadsFolderPath);
}
const uploadImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { files } = req;
        if (!files || !Array.isArray(files) || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded.' });
        }
        const imageIds = [];
        for (const file of files) {
            const imageId = (0, uuid_1.v4)();
            const transformedImage = yield (0, imageService_1.applyTransformations)(file.buffer);
            // Save the transformed image to the uploads folder
            const imagePath = path_1.default.join(uploadsFolderPath, `${imageId}.jpg`);
            fs_1.default.writeFileSync(imagePath, transformedImage);
            imageIds.push(imageId);
        }
        res.json({ imageIds });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.uploadImages = uploadImages;
const retrieveImage = (req, res) => {
    const { imageId } = req.params;
    const imagePath = path_1.default.join(uploadsFolderPath, `${imageId}.jpg`);
    if (!fs_1.default.existsSync(imagePath)) {
        return res.status(404).json({ error: 'Image not found.' });
    }
    // Read and send the image from the uploads folder
    const imageBuffer = fs_1.default.readFileSync(imagePath);
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(imageBuffer);
};
exports.retrieveImage = retrieveImage;
const retrieveImages = (req, res) => {
    try {
        // Read the contents of the uploads folder to get a list of image files
        fs_1.default.readdir(uploadsFolderPath, (err, files) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            // Filter the list to include only image files (e.g., JPEG)
            const imageFiles = files.filter((file) => {
                const ext = path_1.default.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
            });
            // Extract image IDs from file names (assuming image files are named as UUIDs)
            const imageIds = imageFiles.map((file) => path_1.default.basename(file, path_1.default.extname(file)));
            if (!Array.isArray(imageIds) || imageIds.length === 0) {
                return res.status(400).json({ error: 'Invalid or empty image IDs array.' });
            }
            const imagesData = [];
            for (const imageId of imageIds) {
                const imagePath = path_1.default.join(uploadsFolderPath, `${imageId}.jpg`);
                if (fs_1.default.existsSync(imagePath)) {
                    // Read the image data from the uploads folder
                    const imageBuffer = fs_1.default.readFileSync(imagePath);
                    imagesData.push({ imageId, imageData: imageBuffer });
                }
            }
            // Set the response content type to indicate binary data (image/jpeg in this case)
            res.setHeader('Content-Type', 'application/json');
            // Send the list of image IDs and their binary image data as JSON
            res.json({ images: imagesData });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.retrieveImages = retrieveImages;
