import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

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
  return /^#[0-9A-Fa-f]{6}$/.test(color);
};

const isValidIcon = (icon, allowedIcons) => {
  return allowedIcons.includes(icon);
};

const ALLOWED_ICONS = [
  'MessageCircle', 'CheckSquare', 'Users', 'BarChart', 'Zap', 'TrendingUp',
  'Compass', 'Palette', 'RefreshCw', 'Star', 'Heart', 'Lightbulb', 'Target',
  'Trophy', 'Brain', 'Rocket', 'Flag', 'Gem', 'Ghost', 'Gift', 'Glasses',
  'Hammer', 'Key', 'Laptop', 'Leaf', 'Lock', 'Map', 'Moon', 'Music', 'Pen',
  'Phone', 'PieChart', 'Shield', 'Smile', 'Sun', 'Wrench', 'Umbrella',
  'Video', 'Coffee', 'Beer', 'Pizza', 'Briefcase', 'Camera', 'Cloud'
];

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(rateLimit);

// Get all categories
app.get('/api/categories', (req, res) => {
  db.all("SELECT * FROM categories", [], (err, rows) => {
    if (err) {
      console.error('DB Error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows || []);
  });
});

// Get all questions
app.get('/api/questions', (req, res) => {
  const { category } = req.query;
  let query = "SELECT * FROM questions";
  const params = [];

  if (category && category !== 'all') {
    query += " WHERE category = ?";
    params.push(sanitizeString(category, 100));
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('DB Error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows || []);
  });
});

// Add new question
app.post('/api/questions', (req, res) => {
  const { category, text } = req.body;
  
  // Validation
  const sanitizedCategory = sanitizeString(category, 100);
  const sanitizedText = sanitizeString(text, 1000);
  
  if (!sanitizedCategory || !sanitizedText) {
    return res.status(400).json({ error: 'Category and text are required' });
  }
  
  if (sanitizedText.length < 5) {
    return res.status(400).json({ error: 'Question text must be at least 5 characters' });
  }

  db.run(
    "INSERT INTO questions (category, text) VALUES (?, ?)",
    [sanitizedCategory, sanitizedText],
    function(err) {
      if (err) {
        console.error('DB Error:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, category: sanitizedCategory, text: sanitizedText });
    }
  );
});

// Update question
app.put('/api/questions/:id', (req, res) => {
  const { id } = req.params;
  const { category, text } = req.body;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return res.status(400).json({ error: 'Invalid question ID' });
  }

  const sanitizedCategory = sanitizeString(category, 100);
  const sanitizedText = sanitizeString(text, 1000);

  if (!sanitizedCategory || !sanitizedText) {
    return res.status(400).json({ error: 'Category and text are required' });
  }

  db.run(
    "UPDATE questions SET category = ?, text = ? WHERE id = ?",
    [sanitizedCategory, sanitizedText, parsedId],
    function(err) {
      if (err) {
        console.error('DB Error:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Question not found' });
      }
      res.json({ id: parsedId, category: sanitizedCategory, text: sanitizedText });
    }
  );
});

// Add new category
app.post('/api/categories', (req, res) => {
  const { id, name, color, icon, isSpecial } = req.body;

  // Validation
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
    
    if (!sanitizedId || sanitizedId === '-') {
      sanitizedId = 'cat-' + Date.now().toString(36);
    }
  }

  if (!isValidColor(sanitizedColor)) {
    return res.status(400).json({ error: 'Invalid color format. Use hex format: #RRGGBB' });
  }

  if (!isValidIcon(sanitizedIcon, ALLOWED_ICONS)) {
    return res.status(400).json({ error: 'Invalid icon name' });
  }

  // console.log('Creating category:', { id: sanitizedId, name: sanitizedName, color: sanitizedColor, icon: sanitizedIcon });

  db.run(
    "INSERT INTO categories (id, name, color, icon, isSpecial) VALUES (?, ?, ?, ?, ?)",
    [sanitizedId, sanitizedName, sanitizedColor, sanitizedIcon, isSpecial ? 1 : 0],
    function(err) {
      if (err) {
        console.error('DB Error:', err.message);
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ error: 'Category with this ID already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: sanitizedId, name: sanitizedName, color: sanitizedColor, icon: sanitizedIcon, isSpecial: isSpecial ? 1 : 0 });
    }
  );
});

// Update category
app.put('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const { name, color, icon, isSpecial } = req.body;
  const sanitizedId = sanitizeString(id, 100);

  const sanitizedName = sanitizeString(name, 100);
  const sanitizedColor = sanitizeString(color, 20);
  const sanitizedIcon = sanitizeString(icon, 50);

  if (!sanitizedName || !sanitizedColor || !sanitizedIcon) {
    return res.status(400).json({ error: 'Name, color, and icon are required' });
  }

  if (!isValidColor(sanitizedColor)) {
    return res.status(400).json({ error: 'Invalid color format' });
  }

  if (!isValidIcon(sanitizedIcon, ALLOWED_ICONS)) {
    return res.status(400).json({ error: 'Invalid icon name' });
  }

  db.run(
    "UPDATE categories SET name = ?, color = ?, icon = ?, isSpecial = ? WHERE id = ?",
    [sanitizedName, sanitizedColor, sanitizedIcon, isSpecial ? 1 : 0, sanitizedId],
    function(err) {
      if (err) {
        console.error('DB Error:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json({ id: sanitizedId, name: sanitizedName, color: sanitizedColor, icon: sanitizedIcon, isSpecial: isSpecial ? 1 : 0 });
    }
  );
});

// Delete category (and its questions)
app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const sanitizedId = sanitizeString(id, 100);

  if (!sanitizedId) {
    return res.status(400).json({ error: 'Invalid category ID' });
  }

  // console.log(`Deleting category: ${sanitizedId}`);

  db.serialize(() => {
    db.run("DELETE FROM questions WHERE category = ?", [sanitizedId], (err) => {
      if (err) console.error('Error deleting questions:', err.message);
    });
    db.run("DELETE FROM categories WHERE id = ?", [sanitizedId], function(err) {
      if (err) {
        console.error('Error deleting category:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      // console.log(`Successfully deleted category: ${sanitizedId}. Rows affected: ${this.changes}`);
      res.json({ success: true, deletedId: sanitizedId });
    });
  });
});

// Delete question
app.delete('/api/questions/:id', (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);
  
  if (isNaN(parsedId)) {
    return res.status(400).json({ error: 'Invalid question ID' });
  }
  
  db.run("DELETE FROM questions WHERE id = ?", [parsedId], function(err) {
    if (err) {
      console.error('DB Error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json({ success: true, deletedId: parsedId });
  });
});

// Serve static files from the 'dist' directory (Vite build)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Wildcard route to serve index.html for any non-API route (for client-side routing)
app.get('(.*)', (req, res, next) => {
  if (req.url.startsWith('/api/')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

// 404 handler for API
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, _next) => {
  // console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`Health check: http://0.0.0.0:${PORT}/api/health`);
});
