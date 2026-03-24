import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Category from './models/Category.js';
import Question from './models/Question.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/teamgame';

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Security: Rate limiting simple implementation
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 100; // 100 requests per minute

const rateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  } else {
    const record = rateLimitStore.get(ip);
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + RATE_LIMIT_WINDOW;
    } else {
      record.count++;
      if (record.count > RATE_LIMIT_MAX) {
        return res.status(429).json({ error: 'Too many requests' });
      }
    }
  }
  next();
};

// Cleanup old rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 300000);

// Validation helpers
const sanitizeString = (str, maxLength = 500) => {
  if (typeof str !== 'string') return null;
  return str.slice(0, maxLength).trim();
};

const isValidColor = (color) => {
  return /^#[0-9A-Fa-f]{6,8}$/.test(color); // Allow #RRGGBBAA as well
};

const ALLOWED_ICONS = [
  'MessageCircle', 'CheckSquare', 'Users', 'BarChart', 'Zap', 'TrendingUp',
  'Compass', 'Palette', 'RefreshCw', 'Star', 'Heart', 'Lightbulb', 'Target',
  'Trophy', 'Brain', 'Rocket', 'Flag', 'Gem', 'Ghost', 'Gift', 'Glasses',
  'Hammer', 'Key', 'Laptop', 'Leaf', 'Lock', 'Map', 'Moon', 'Music', 'Pen',
  'Phone', 'PieChart', 'Shield', 'Smile', 'Sun', 'Wrench', 'Umbrella',
  'Video', 'Coffee', 'Beer', 'Pizza', 'Briefcase', 'Camera', 'Cloud'
];

const isValidIcon = (icon) => {
  return ALLOWED_ICONS.includes(icon);
};

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10kb' })); 
app.use(rateLimit);

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Helper to format question response
const formatQuestion = (q) => ({
  id: q._id.toString(),
  category: q.category,
  text: q.text,
  createdAt: q.createdAt,
  updatedAt: q.updatedAt
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error('DB Error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all questions
app.get('/api/questions', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'all') {
      filter.category = category;
    }
    const questions = await Question.find(filter);
    res.json(questions.map(formatQuestion));
  } catch (err) {
    console.error('DB Error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add new question
app.post('/api/questions', async (req, res) => {
  try {
    const { category, text } = req.body;
    const sanitizedCategory = sanitizeString(category, 100);
    const sanitizedText = sanitizeString(text, 2000);
    
    if (!sanitizedCategory || !sanitizedText) {
      return res.status(400).json({ error: 'Category and text are required' });
    }
    
    if (sanitizedText.length < 5) {
      return res.status(400).json({ error: 'Question text must be at least 5 characters' });
    }

    const question = await Question.create({
      category: sanitizedCategory,
      text: sanitizedText
    });
    
    res.json(formatQuestion(question));
  } catch (err) {
    console.error('DB Error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update question
app.put('/api/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { category, text } = req.body;

    const sanitizedCategory = sanitizeString(category, 100);
    const sanitizedText = sanitizeString(text, 2000);

    if (!sanitizedCategory || !sanitizedText) {
      return res.status(400).json({ error: 'Category and text are required' });
    }

    const question = await Question.findByIdAndUpdate(
      id,
      { category: sanitizedCategory, text: sanitizedText },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json(formatQuestion(question));
  } catch (err) {
    console.error('DB Error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add new category
app.post('/api/categories', async (req, res) => {
  try {
    const { id, name, color, icon, isSpecial } = req.body;

    let sanitizedId = sanitizeString(id, 100);
    const sanitizedName = sanitizeString(name, 100);
    const sanitizedColor = sanitizeString(color, 20);
    const sanitizedIcon = sanitizeString(icon, 50);

    if (!sanitizedName || !sanitizedColor || !sanitizedIcon) {
      return res.status(400).json({ error: 'Name, color, and icon are required' });
    }

    if (!sanitizedId) {
      sanitizedId = sanitizedName.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }

    if (!isValidColor(sanitizedColor)) {
      return res.status(400).json({ error: 'Invalid color format' });
    }

    if (!isValidIcon(sanitizedIcon)) {
      return res.status(400).json({ error: 'Invalid icon name' });
    }

    const category = await Category.create({
      id: sanitizedId,
      name: sanitizedName,
      color: sanitizedColor,
      icon: sanitizedIcon,
      isSpecial: isSpecial ? 1 : 0
    });
    
    res.json(category);
  } catch (err) {
    console.error('DB Error:', err.message);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Category with this ID already exists' });
    }
    res.status(500).json({ error: 'Database error' });
  }
});

// Update category
app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, icon, isSpecial } = req.body;

    const sanitizedName = sanitizeString(name, 100);
    const sanitizedColor = sanitizeString(color, 20);
    const sanitizedIcon = sanitizeString(icon, 50);

    if (!sanitizedName || !sanitizedColor || !sanitizedIcon) {
      return res.status(400).json({ error: 'Name, color, and icon are required' });
    }

    if (!isValidColor(sanitizedColor)) {
      return res.status(400).json({ error: 'Invalid color format' });
    }

    if (!isValidIcon(sanitizedIcon)) {
      return res.status(400).json({ error: 'Invalid icon name' });
    }

    const category = await Category.findOneAndUpdate(
      { id },
      { name: sanitizedName, color: sanitizedColor, icon: sanitizedIcon, isSpecial: isSpecial ? 1 : 0 },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (err) {
    console.error('DB Error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete category (and its questions)
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete all questions in this category
    await Question.deleteMany({ category: id });
    
    // Delete the category itself
    const result = await Category.deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ success: true, deletedId: id });
  } catch (err) {
    console.error('DB Error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete question
app.delete('/api/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Question.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json({ success: true, deletedId: id });
  } catch (err) {
    console.error('DB Error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Serve static
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Catch-all
app.use((req, res) => {
  if (req.url.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
