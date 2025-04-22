import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import helmet from 'helmet';

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(express.json()); // Parse JSON bodies

// Enhanced CORS configuration to handle preflight requests
app.use(cors({
  origin: 'https://uniunity.space',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS for preflight
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type'],
  optionsSuccessStatus: 200, // Some legacy browsers (IE) choke on 204
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// MongoDB connection with retry and timeout
const connectWithRetry = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // 5-second timeout
    heartbeatFrequencyMS: 10000, // Check every 10 seconds
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('MongoDB connection error:', err.message);
    setTimeout(connectWithRetry, 5000); // Retry every 5 seconds
  });
};
connectWithRetry();

// Admin schema and model
const adminSchema = new mongoose.Schema({ email: String, password: String });
const Admin = mongoose.model('Admin', adminSchema);

// Initialize admin (run once)
(async () => {
  try {
    const adminExists = await Admin.countDocuments({ email: 'admin' });
    if (!adminExists) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('UniUnity2025!', saltRounds);
      await Admin.create({ email: 'admin', password: hashedPassword });
      console.log('Admin created with hashed password');
    }
  } catch (error) {
    console.error('Admin initialization error:', error);
  }
})();

// Authentication endpoint
app.post('/api/auth', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  try {
    const admin = await Admin.findOne({ email: username });
    if (admin && await bcrypt.compare(password, admin.password)) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ success: false, message: 'Server error during authentication' });
  }
});

// Blog schema and model
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  seoTitle: String,
  seoDescription: String,
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'published', enum: ['published', 'draft'] },
});
const Blog = mongoose.model('Blog', blogSchema);

// Config schema and model
const configSchema = new mongoose.Schema({
  title: String,
  favicon: String,
  banner: { heading: String, subtext: String },
  seo: { title: String, description: String },
  homepageAd: { text: String, image: String },
  adminUsername: String,
  adminPassword: String,
});
const Config = mongoose.model('Config', configSchema);

// Blog endpoints
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    console.error('Fetch blogs error:', error);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const { title, content, seoTitle, seoDescription } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    const blog = new Blog({ title, content, seoTitle, seoDescription });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Failed to create blog' });
  }
});

app.put('/api/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, seoTitle, seoDescription } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    const blog = await Blog.findByIdAndUpdate(id, { title, content, seoTitle, seoDescription }, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Failed to update blog' });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Blog.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Failed to delete blog' });
  }
});

// Config endpoints
app.get('/api/config', async (req, res) => {
  try {
    const config = await Config.findOne();
    res.json(config || {});
  } catch (error) {
    console.error('Fetch config error:', error);
    res.status(500).json({ message: 'Failed to fetch config' });
  }
});

app.post('/api/config', async (req, res) => {
  try {
    const { adminUsername, adminPassword, ...configData } = req.body;
    const currentConfig = await Config.findOne();
    if (currentConfig && adminPassword) {
      const isValid = await bcrypt.compare(req.body.currentPassword || '', currentConfig.adminPassword || '');
      if (!isValid) return res.status(401).json({ message: 'Current password is incorrect' });
    }
    const updatedConfig = await Config.findOneAndUpdate(
      {},
      { ...configData, adminUsername, adminPassword: adminPassword ? await bcrypt.hash(adminPassword, 10) : currentConfig?.adminPassword },
      { upsert: true, new: true, runValidators: true }
    );
    res.json(updatedConfig);
  } catch (error) {
    console.error('Update config error:', error);
    res.status(500).json({ message: 'Failed to update config' });
  }
});

// Notification endpoint
app.post('/api/send-notification', (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Notification message is required' });
    }
    res.json({ message: 'Notification sent' });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('UniUnity Backend is running. Use /api/* endpoints for admin access.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app; // For testing or module usage
