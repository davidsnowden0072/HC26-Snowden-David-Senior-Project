/**
 * index.test.js
 * 
 * Tests for backend API endpoints.
 * Validates route handling, error responses, and input validation.
 */

import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';

// Mock the supabase config to avoid requiring env vars
vi.mock('./config/supabase.js', () => ({
  supabase: {}
}));

// Import routes AFTER mocking
const courseRoutes = await import('./routes/courses.js').then(m => m.default);

// Create test app instance
const app = express();
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: "EduRate API",
    version: "1.0.0",
    status: "running"
  });
});

// Mount course routes
app.use('/api/courses', courseRoutes);

describe('Backend API Tests', () => {
  it('should return API info on root endpoint', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('EduRate API');
    expect(response.body.version).toBe('1.0.0');
  });

  it('should return 404 for non-existent routes', async () => {
    const response = await request(app).get('/nonexistent');
    
    expect(response.status).toBe(404);
  });
});

describe('Review Validation Tests', () => {
  it('should reject review with missing rating', async () => {
    const response = await request(app)
      .post('/api/courses/1/reviews')
      .send({
        comment: 'Great course but no rating provided'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('required');
  });

  it('should reject review with invalid rating (too high)', async () => {
    const response = await request(app)
      .post('/api/courses/1/reviews')
      .send({
        rating: 10,
        comment: 'Invalid rating value'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('between 1 and 5');
  });

  it('should reject review with invalid rating (too low)', async () => {
    const response = await request(app)
      .post('/api/courses/1/reviews')
      .send({
        rating: 0,
        comment: 'Invalid rating value'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('between 1 and 5');
  });

  it('should reject review with missing comment', async () => {
    const response = await request(app)
      .post('/api/courses/1/reviews')
      .send({
        rating: 5
      });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('required');
  });
});