import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import helmet from 'helmet';

const app = express();
app.use(helmet());
app.use(cors({ origin: 'https://uniunity-4fnm.onrender.com' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('UniUnity Backend is running. Use /api/* endpoints for admin access.');
});

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
  const admin = await Admin.findOne({ email: username });
  if (admin && await bcrypt.compare(password, admin.password)) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
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

app.get('/api/blogs', async (req, res) => { const blogs = await Blog.find(); res.json(blogs); });
app.post('/api/blogs', async (req, res) => {
  const { title, content, seoTitle, seoDescription } = req.body;
  const blog = new Blog({ title, content, seoTitle, seoDescription });
  await blog.save();
  res.json(blog);
});
app.use(cors({
  origin: 'https://uniunity.space',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.put('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, seoTitle, seoDescription } = req.body;
  const blog = await Blog.findByIdAndUpdate(id, { title, content, seoTitle, seoDescription }, { new: true });
  res.json(blog);
});
app.delete('/api/blogs/:id', async (req, res) => { const { id } = req.params; await Blog.findByIdAndDelete(id); res.json({ message: 'Blog deleted' }); });
app.post('/api/config', async (req, res) => {
  const { adminUsername, adminPassword, ...configData } = req.body;
  const config = await Config.findOneAndUpdate({}, { ...configData, adminUsername, adminPassword: await bcrypt.hash(adminPassword || '', 10) }, { upsert: true, new: true });
  res.json(config);
});
app.post('/api/send-notification', (req, res) => { res.json({ message: 'Notification sent' }); }); // Placeholder

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
