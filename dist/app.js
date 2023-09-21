"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const imageRoutes_1 = require("./routes/imageRoutes");
const app = (0, express_1.default)();
exports.app = app;
const cors = require('cors');
const port = process.env.PORT || 3006;
app.use(express_1.default.json());
// Enable CORS for all routes
app.use(cors());
app.use('/uploads', express_1.default.static('uploads'));
app.use('/api/images', imageRoutes_1.imageRoutes);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
