"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const imageController_1 = require("../controllers/imageController");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
exports.imageRoutes = router;
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// For single image upload
router.post('/upload', upload.single('image'), imageController_1.uploadImages);
// For bulk image upload
router.post('/bulk-upload', upload.array('images'), imageController_1.uploadImages);
// Retrieve a single image by ID
router.get('/retrieve/:imageId', imageController_1.retrieveImage);
// Retrieve all images
router.get('/retrieve-all', imageController_1.retrieveImages);
