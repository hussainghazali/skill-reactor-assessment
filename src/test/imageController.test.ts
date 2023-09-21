const request = require('supertest');
import { Express } from 'express';
const express = require('express');
import fs from 'fs';
import path from 'path';
import { uploadImages, retrieveImage, retrieveImages } from '../controllers/imageController';

describe('Image Controller', () => {
  let app: Express;

  beforeAll(() => {
    app = express();

    // Define Express routes for testing
    app.post('/api/images/upload', uploadImages);
    app.get('/api/images/retrieve/:imageId', retrieveImage);
    app.get('/api/images/retrieve-all', retrieveImages);
  });

  afterAll(() => {
    // Clean up any files or resources created during testing
  });

  it('should upload a single image', async () => {
    // Create a mock request object with a file
    const mockRequest = request(app).post('/api/images/upload');
    mockRequest.attach('image', '../../uploads/0e1ef11d-2b4c-4b22-861f-27a78dea95a5.jpg'); // Replace with a path to a mock image file

    const response = await mockRequest;

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.imageIds)).toBe(true);
    expect(response.body.imageIds.length).toBe(1);
  });

  it('should retrieve an uploaded image', async () => {
    // Upload a mock image
    const uploadResponse = await request(app)
      .post('/api/images/upload')
      .attach('image', '../../uploads/0e1ef11d-2b4c-4b22-861f-27a78dea95a5.jpg'); // Replace with a path to a mock image file

    const imageId = uploadResponse.body.imageIds[0];

    const retrieveResponse = await request(app).get(`/api/images/retrieve/${imageId}`);

    expect(retrieveResponse.status).toBe(200);
    expect(retrieveResponse.header['content-type']).toBe('image/jpeg');
    expect(retrieveResponse.body).toBeTruthy(); // You may need to customize this assertion
  });

  it('should retrieve all images', async () => {
    // Upload multiple mock images
    await request(app)
      .post('/api/images/upload')
      .attach('image', '../../uploads/05382a4b-01ed-4e12-8544-1f7c61d4bbf7.jpg'); // Replace with paths to mock image files

    await request(app)
      .post('/api/images/upload')
      .attach('image', '../../uploads/4be92c0a-a1b3-44b7-a497-51fd96d35e9d.jpg'); // Replace with paths to mock image files

    const retrieveResponse = await request(app).get('/api/images/retrieve-all');

    expect(retrieveResponse.status).toBe(200);
    expect(Array.isArray(retrieveResponse.body.images)).toBe(true);
    expect(retrieveResponse.body.images.length).toBe(2);
  });
});
