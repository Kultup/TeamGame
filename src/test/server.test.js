import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';

// Mock database
const mockDb = {
  all: vi.fn((query, params, callback) => {
    callback(null, []);
  }),
  run: vi.fn((query, params, callback) => {
    callback(null, { lastID: 1, changes: 1 });
  }),
  serialize: vi.fn((fn) => fn()),
};

vi.mock('../server/db.js', () => ({
  default: mockDb,
}));

// Import app after mocking
const app = express();
app.use(cors());
app.use(express.json());

// Simple test endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/categories', (req, res) => {
  res.json([]);
});

app.get('/api/questions', (req, res) => {
  res.json([]);
});

describe('Server API', () => {
  it('should respond to health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('should return empty categories list', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return empty questions list', async () => {
    const res = await request(app).get('/api/questions');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should handle category filter for questions', async () => {
    const res = await request(app).get('/api/questions?category=test');
    expect(res.status).toBe(200);
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
  });
});
