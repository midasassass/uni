import 'dotenv/config'; // ESM import for dotenv
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import helmet from 'helmet';

const app = express();
app.use(helmet());
app.use(cors({ origin: 'https://uniunity-4fnm.onrender.com' })); // Update CORS to match Render URL
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

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  seoTitle: String,
  seoDescription: String,
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'published' },
});
const Blog = mongoose.model('Blog', blogSchema);

const adminSchema = new mongoose.Schema({ email: String });
const Admin = mongoose.model('Admin', adminSchema);

const configSchema = new mongoose.Schema({
  title: String,
  favicon: String,
  banner: { heading: String, subtext: String },
  seo: { title: String, description: String, ogImage: String },
  homepageAd: { text: String, image: String },
});
const Config = mongoose.model('Config', configSchema);

app.get('/api/blogs', async (req, res) => { const blogs = await Blog.find(); res.json(blogs); });
app.post('/api/blogs', upload.fields([{ name: 'thumbnailImage' }, { name: 'seoImage' }]), async (req, res) => {
  const { title, content, seoTitle, seoDescription } = req.body;
  const blog = new Blog({
    title, content, image: req.files['thumbnailImage'] ? `https://uniunity-4fnm.onrender.com/uploads/${req.files['thumbnailImage'][0].filename}` : '',
    seoTitle, seoDescription, seoImage: req.files['seoImage'] ? `https://uniunity-4fnm.onrender.com/uploads/${req.files['seoImage'][0].filename}` : '',
  });
  await blog.save();
  res.json(blog);
});
app.put('/api/blogs/:id', upload.fields([{ name: 'thumbnailImage' }, { name: 'seoImage' }]), async (req, res) => {
  const { id } = req.params;
  const { title, content, seoTitle, seoDescription } = req.body;
  const update = { title, content, seoTitle, seoDescription };
  if (req.files['thumbnailImage']) update.image = `https://uniunity-4fnm.onrender.com/uploads/${req.files['thumbnailImage'][0].filename}`;
  if (req.files['seoImage']) update.seoImage = `https://uniunity-4fnm.onrender.com/uploads/${req.files['seoImage'][0].filename}`;
  const blog = await Blog.findByIdAndUpdate(id, update, { new: true });
  res.json(blog);
});
app.delete('/api/blogs/:id', async (req, res) => { const { id } = req.params; await Blog.findByIdAndDelete(id); res.json({ message: 'Blog deleted' }); });
app.post('/api/upload', upload.single('image'), (req, res) => { const imageUrl = `https://uniunity-4fnm.onrender.com/uploads/${req.file.filename}`; res.json({ imageUrl }); });
app.get('/api/admins', async (req, res) => { const admins = await Admin.find(); res.json(admins); });
app.post('/api/admins', async (req, res) => { const admin = new Admin(req.body); await admin.save(); res.json(admin); });
app.post('/api/config', async (req, res) => { const config = await Config.findOneAndUpdate({}, req.body, { upsert: true, new: true }); res.json(config); });
// Comment out static uploads for now (Render doesn't persist files)
// app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000; // Adjusted from 443 to 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
