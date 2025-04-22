require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());
app.use(cors({ origin: 'https://uniunity.space' }));
app.use(morgan('combined'));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/uniunity';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const ConfigSchema = new mongoose.Schema({
  title: String,
  favicon: String,
  banner: {
    heading: String,
    subtext: String,
  },
  seo: {
    title: String,
    description: String,
    ogImage: String,
  },
  homepageAd: {
    text: String,
    image: String,
  },
});
const Config = mongoose.model('Config', ConfigSchema);

const BlogPostSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String,
  createdAt: Date,
});
const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

app.get('/api/config', async (req, res) => {
  const config = await Config.findOne() || { ...defaultConfig };
  res.json(config);
});

app.post('/api/config', async (req, res) => {
  const config = await Config.findOneAndUpdate({}, req.body, { upsert: true, new: true });
  res.json(config);
});

app.get('/api/blogs', async (req, res) => {
  const posts = await BlogPost.find();
  res.json(posts);
});

app.post('/api/blogs', async (req, res) => {
  const post = new BlogPost({ ...req.body, id: mongoose.Types.ObjectId().toString(), createdAt: new Date() });
  await post.save();
  res.json(post);
});

app.put('/api/blogs/:id', async (req, res) => {
  const post = await BlogPost.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  res.json(post);
});

app.delete('/api/blogs/:id', async (req, res) => {
  await BlogPost.findOneAndDelete({ id: req.params.id });
  res.json({ success: true });
});

app.post('/api/auth', async (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && await bcrypt.compare(password, '$2b$10$...')) { // Replace with hashed password
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

const defaultConfig = {
  title: 'UniUnity.space',
  favicon: '/favicon.ico',
  banner: { heading: 'Future-Proof Growth', subtext: 'AI solutions' },
  seo: { title: 'UniUnity - Tech Solutions', description: 'AI and development services', ogImage: 'https://example.com/og.jpg' },
  homepageAd: { text: 'Transform with AI', image: 'https://example.com/ad.jpg' },
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
