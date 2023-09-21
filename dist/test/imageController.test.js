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
Object.defineProperty(exports, "__esModule", { value: true });
const request = require('supertest');
const express = require('express');
const imageController_1 = require("../controllers/imageController");
console.log('Starting tests...'); // Add this line to indicate the start of tests.
describe('Image Controller', () => {
    let app;
    beforeAll(() => {
        app = express();
        // Define Express routes for testing
        app.post('/api/images/upload', imageController_1.uploadImages);
        app.get('/api/images/retrieve/:imageId', imageController_1.retrieveImage);
        app.get('/api/images/retrieve-all', imageController_1.retrieveImages);
    });
    afterAll(() => {
        // Clean up any files or resources created during testing
    });
    it('should upload a single image', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create a mock request object with a file
        console.log('Test: should upload a single image started'); // Add this line to log the start of the test.
        const mockRequest = request(app).post('/api/images/upload');
        mockRequest.attach('image', '../../uploads/0e1ef11d-2b4c-4b22-861f-27a78dea95a5.jpg'); // Replace with a path to a mock image file
        const response = yield mockRequest;
        console.log('Received response for uploading image:', response.body); // Log the response received.
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.imageIds)).toBe(true);
        expect(response.body.imageIds.length).toBe(1);
    }));
    it('should retrieve an uploaded image', () => __awaiter(void 0, void 0, void 0, function* () {
        // Upload a mock image
        console.log('Test: should retrieve an uploaded image started'); // Add this line to log the start of the test.
        const uploadResponse = yield request(app)
            .post('/api/images/upload')
            .attach('image', '../../uploads/0e1ef11d-2b4c-4b22-861f-27a78dea95a5.jpg'); // Replace with a path to a mock image file
        const imageId = uploadResponse.body.imageIds[0];
        console.log('Received response for imageId:', imageId); // Log the response received.
        const retrieveResponse = yield request(app).get(`/api/images/retrieve/${imageId}`);
        console.log('Received response for image:', retrieveResponse); // Log the response received.
        expect(retrieveResponse.status).toBe(200);
        expect(retrieveResponse.header['content-type']).toBe('image/jpeg');
        expect(retrieveResponse.body).toBeTruthy(); // You may need to customize this assertion
    }));
    it('should retrieve all images', () => __awaiter(void 0, void 0, void 0, function* () {
        // Upload multiple mock images
        console.log('Test: should retrieve all images started'); // Add this line to log the start of the test.
        yield request(app)
            .post('/api/images/upload')
            .attach('image', '../../uploads/05382a4b-01ed-4e12-8544-1f7c61d4bbf7.jpg'); // Replace with paths to mock image files
        yield request(app)
            .post('/api/images/upload')
            .attach('image', '../../uploads/4be92c0a-a1b3-44b7-a497-51fd96d35e9d.jpg'); // Replace with paths to mock image files
        const retrieveResponse = yield request(app).get('/api/images/retrieve-all');
        console.log('Received response for image:', retrieveResponse); // Log the response received.
        expect(retrieveResponse.status).toBe(200);
        expect(Array.isArray(retrieveResponse.body.images)).toBe(true);
        expect(retrieveResponse.body.images.length).toBe(2);
    }));
});
