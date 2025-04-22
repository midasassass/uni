import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import helmet from 'helmet';

const app = express();
app.use(helmet());
app.use(express.json());

// Consolidate CORS to match the live frontend
app.use(cors({
  origin: 'https://uniunity.space',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

const connectWithRetry = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log('Connected to MongoDB'))
    .catch(err => {
      console.error('MongoDB connection error:', err);
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

const adminSchema = new mongoose.Schema({ email: String, password: String });
const Admin = mongoose.model('Admin', adminSchema);

// Initialize admin with hashed password (run once)
(async () => {
  const adminExists = await Admin.countDocuments({ email: 'admin' });
  if (!adminExists) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('UniUnity2025!', saltRounds);
    await Admin.create({ email: 'admin', password: hashedPassword });
    console.log('Admin created with hashed password');
  }
})();

app.post('/api/auth', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ email: username });
    if (admin && await bcrypt.compare(password, admin.password)) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  seoTitle: String,
  seoDescription: String,
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'published' },
});
const Blog = mongoose.model('Blog', blogSchema);

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

// Add GET endpoint for config
app.get('/api/config', async (req, res) => {
  try {
    const config = await Config.findOne();
    res.json(config || {});
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch config' });
  }
});

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
});
app.post('/api/blogs', async (req, res) => {
  try {
    const { title, content, seoTitle, seoDescription } = req.body;
    const blog = new Blog({ title, content, seoTitle, seoDescription });
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create blog' });
  }
});
app.put('/api/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, seoTitle, seoDescription } = req.body;
    const blog = await Blog.findByIdAndUpdate(id, { title, content, seoTitle, seoDescription }, { new: true });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
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
    res.status(500).json({ message: 'Failed to delete blog' });
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
      { upsert: true, new: true }
    );
    res.json(updatedConfig);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update config' });
  }
});

app.post('/api/send-notification', (req, res) => {
  try {
    // Placeholder logic - implement actual notification service (e.g., Firebase, OneSignal)
    res.json({ message: 'Notification sent' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send notification' });
  }
});

app.get('/', (req, res) => {
  res.send('UniUnity Backend is running. Use /api/* endpoints for admin access.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
