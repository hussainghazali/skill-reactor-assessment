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
exports.applyTransformations = void 0;
const sharp_1 = __importDefault(require("sharp"));
const applyTransformations = (imageBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Apply image transformations using the 'sharp' library
        const transformedImageBuffer = yield (0, sharp_1.default)(imageBuffer)
            .resize(300, 200) // Resize the image to a specific width and height
            .jpeg({ quality: 80 }) // Convert the image to JPEG format with 80% quality (adjust as needed)
            .toBuffer(); // Convert the transformed image to a Buffer
        return transformedImageBuffer;
    }
    catch (error) {
        // Handle any errors that occur during transformation
        console.error('Error applying transformations:', error);
        throw error; // You can choose to rethrow the error or handle it differently
    }
});
exports.applyTransformations = applyTransformations;
