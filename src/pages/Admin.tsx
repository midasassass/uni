import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useDebounce } from 'use-debounce';
import { FiEdit, FiTrash2, FiEye, FiSave, FiUpload, FiImage, FiSettings, FiFileText, FiBell } from 'react-icons/fi';

// Lazy load component
const MarkdownEditor = lazy(() => import('@uiw/react-markdown-editor').then(mod => ({ default: mod.default })));

type TabType = 'posts' | 'new' | 'config' | 'analytics' | 'notifications';

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [seoImage, setSeoImage] = useState<File | null>(null);
  const [faviconImage, setFaviconImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [blogs, setBlogs] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [config, setConfig] = useState<any>({});
  const [message, setMessage] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [debouncedTitle] = useDebounce(title, 500);

  useEffect(() => {
    fetchBlogs();
    fetchAdmins();
    fetchConfig();
  }, []);

  useEffect(() => {
    if (debouncedTitle) {
      const generatedSlug = debouncedTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
      if (!seoTitle) setSeoTitle(`${debouncedTitle} | UniUnity`);
    }
  }, [debouncedTitle, seoTitle]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || content) localStorage.setItem('draftPost', JSON.stringify({ title, content }));
    }, 2000);
    return () => clearTimeout(timer);
  }, [title, content]);

  useEffect(() => {
    const draft = localStorage.getItem('draftPost');
    if (draft) {
      const { title, content } = JSON.parse(draft);
      setTitle(title);
      setContent(content);
    }
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('https://api.uniunity.space/api/blogs');
      setBlogs(response.data);
    } catch (error) {
      setMessage('Failed to fetch blogs!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('https://api.uniunity.space/api/admins');
      setAdmins(response.data);
    } catch (error) {
      setMessage('Failed to fetch admins!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const fetchConfig = async () => {
    try {
      const response = await axios.get('https://api.uniunity.space/api/config');
      setConfig(response.data);
    } catch (error) {
      setMessage('Failed to fetch config!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setMessage('Image size should be less than 2MB!');
        return;
      }
      setter(file);
    }
  };

  const resetForm = useCallback(() => {
    setTitle('');
    setContent('');
    setSlug('');
    setSeoTitle('');
    setSeoDescription('');
    setThumbnailImage(null);
    setSeoImage(null);
    setFaviconImage(null);
    setEditingPostId(null);
    localStorage.removeItem('draftPost');
  }, []);

  const loadPostForEditing = useCallback((postId: string) => {
    const post = blogs.find((p: any) => p._id === postId);
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setSlug(post.slug || '');
      setSeoTitle(post.seoTitle || '');
      setSeoDescription(post.seoDescription || '');
      setEditingPostId(post._id);
      setActiveTab('new');
    }
  }, [blogs]);

  const handleSubmitBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('seoTitle', seoTitle || `${title} | UniUnity`);
      formData.append('seoDescription', seoDescription || content.substring(0, 160));
      if (thumbnailImage) formData.append('thumbnailImage', thumbnailImage);
      if (seoImage) formData.append('seoImage', seoImage);

      const url = editingPostId ? `https://api.uniunity.space/api/blogs/${editingPostId}` : 'https://api.uniunity.space/api/blogs';
      const method = editingPostId ? 'put' : 'post';

      await axios[method](url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchBlogs();
      resetForm();
      setMessage(`${editingPostId ? 'Updated' : 'Published'} post successfully!`);
    } catch (error) {
      setMessage('Post submission failed!');
    }
    setIsSubmitting(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`https://api.uniunity.space/api/blogs/${postId}`);
        fetchBlogs();
        setMessage('Post deleted successfully!');
      } catch (error) {
        setMessage('Delete failed!');
      }
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    if (faviconImage) formData.append('favicon', faviconImage);

    try {
      await axios.post('https://api.uniunity.space/api/config', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchConfig();
      setMessage('Config updated successfully!');
    } catch (error) {
      setMessage('Config update failed!');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('https://api.uniunity.space/api/send-notification', { message: notificationMessage });
      setMessage('Notification sent successfully!');
      setNotificationMessage('');
    } catch (error) {
      setMessage('Failed to send notification!');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const inviteCrawlers = async () => {
    const sitemap = `https://uniunity.space/sitemap.xml`;
    try {
      await axios.post('https://www.google.com/ping?sitemap=' + encodeURIComponent(sitemap));
      await axios.post('https://www.bing.com/ping?sitemap=' + encodeURIComponent(sitemap));
      setMessage('Crawlers invited successfully!');
    } catch (error) {
      setMessage('Crawler invitation failed!');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (activeTab === 'new') handleSubmitBlogPost(e as any);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, title, content, thumbnailImage, seoImage, seoTitle, seoDescription]);

  if (!username || !password) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <form onSubmit={handleLogin} className="bg-gray-800/70 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-gray-700">
            <div className="flex justify-center mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Admin Login
              </h1>
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-900/50 border border-red-700 text-red-100 p-3 rounded-md mb-4"
              >
                {error}
              </motion.div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Login
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          UniUnity Admin
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => { resetForm(); setActiveTab('new'); }}
            className="px-3 py-1.5 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-sm flex items-center gap-1"
          >
            <FiFileText /> New Post
          </button>
          <button
            onClick={() => { setUsername(''); setPassword(''); }}
            className="px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-sm flex items-center gap-1 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:sticky lg:top-24 w-full lg:w-64 shrink-0 mb-6 lg:mb-0">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('posts')}
                className={`w-full px-4 py-2 text-left rounded-md flex items-center gap-2 ${activeTab === 'posts' ? 'bg-gray-800 text-purple-400' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                <FiFileText /> Blog Posts
              </button>
              <button
                onClick={() => { resetForm(); setActiveTab('new'); }}
                className={`w-full px-4 py-2 text-left rounded-md flex items-center gap-2 ${activeTab === 'new' ? 'bg-gray-800 text-purple-400' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                <FiEdit /> New Post
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className={`w-full px-4 py-2 text-left rounded-md flex items-center gap-2 ${activeTab === 'config' ? 'bg-gray-800 text-purple-400' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                <FiSettings /> Site Config
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full px-4 py-2 text-left rounded-md flex items-center gap-2 ${activeTab === 'notifications' ? 'bg-gray-800 text-purple-400' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                <FiBell /> Notifications
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full px-4 py-2 text-left rounded-md flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-gray-800 text-purple-400' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                <FiEye /> Analytics
              </button>
            </nav>
          </aside>

          <div className="flex-1">
            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-3 bg-green-900/50 text-green-300 rounded-md"
              >
                {message}
              </motion.div>
            )}
            {activeTab === 'posts' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Manage Blog Posts
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {blogs.map((post: any) => (
                          <tr key={post._id} className="hover:bg-gray-800/50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-100">{post.title}</div>
                              <div className="text-xs text-gray-400">{post.slug || ''}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-green-900/50 text-green-300">
                                Published
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => loadPostForEditing(post._id)}
                                  className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-gray-700/50 transition-colors"
                                  title="Edit"
                                >
                                  <FiEdit />
                                </button>
                                <button
                                  onClick={() => handleDeletePost(post._id)}
                                  className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700/50 transition-colors"
                                  title="Delete"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'new' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    {editingPostId ? 'Edit Blog Post' : 'Create New Blog Post'}
                  </h2>
                  <form onSubmit={handleSubmitBlogPost} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Post Title*</label>
                          <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            required
                            placeholder="Enter post title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Slug*</label>
                          <input
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            required
                            placeholder="post-url-slug"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Thumbnail Image*</label>
                          <div className="flex items-center gap-3">
                            <label className="flex-1 cursor-pointer">
                              <div className="px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                                <FiUpload /> Choose File
                              </div>
                              <input
                                type="file"
                                onChange={(e) => handleImageChange(e, setThumbnailImage)}
                                accept="image/*"
                                className="hidden"
                              />
                            </label>
                          </div>
                          {thumbnailImage && (
                            <div className="mt-2 flex items-center gap-3">
                              <img
                                src={URL.createObjectURL(thumbnailImage)}
                                alt="Thumbnail preview"
                                className="h-12 w-12 object-cover rounded-md"
                              />
                              <span className="text-sm text-gray-400">{thumbnailImage.name}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">SEO Image</label>
                          <div className="flex items-center gap-3">
                            <label className="flex-1 cursor-pointer">
                              <div className="px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                                <FiUpload /> Choose File
                              </div>
                              <input
                                type="file"
                                onChange={(e) => handleImageChange(e, setSeoImage)}
                                accept="image/*"
                                className="hidden"
                              />
                            </label>
                          </div>
                          {seoImage && (
                            <div className="mt-2 flex items-center gap-3">
                              <img
                                src={URL.createObjectURL(seoImage)}
                                alt="SEO image preview"
                                className="h-12 w-12 object-cover rounded-md"
                              />
                              <span className="text-sm text-gray-400">{seoImage.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">SEO Title</label>
                          <input
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="SEO-friendly title for search engines"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">SEO Description</label>
                          <textarea
                            value={seoDescription}
                            onChange={(e) => setSeoDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="Brief description for search engine results (160 chars max)"
                          />
                          <div className="text-xs text-gray-500 mt-1">{seoDescription.length}/160 characters</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Content*</label>
                      <Suspense fallback={<div className="h-64 bg-gray-800/50 rounded-md animate-pulse"></div>}>
                        <MarkdownEditor
                          value={content}
                          onChange={(value) => setContent(value)}
                          className="min-h-[400px] rounded-lg bg-gray-700/50 border border-gray-600"
                          toolbars={['bold', 'italic', 'header', 'underline', 'strike', 'quote', 'ul', 'ol', 'link', 'image', 'code', 'table', 'preview']}
                        />
                      </Suspense>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'} transition-all`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {editingPostId ? 'Updating...' : 'Publishing...'}
                          </>
                        ) : (
                          <>
                            <FiSave />
                            {editingPostId ? 'Update Post' : 'Publish Post'}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === 'config' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Site Configuration
                  </h2>
                  <form onSubmit={handleUpdateConfig} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Site Title</label>
                        <input
                          name="title"
                          defaultValue={config.title || 'UniUnity'}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Favicon URL</label>
                        <input
                          name="favicon"
                          defaultValue={config.favicon || ''}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">New Favicon Image</label>
                        <div className="flex items-center gap-3">
                          <label className="flex-1 cursor-pointer">
                            <div className="px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                              <FiUpload /> Choose File
                            </div>
                            <input
                              type="file"
                              onChange={(e) => handleImageChange(e, setFaviconImage)}
                              accept="image/*"
                              className="hidden"
                            />
                          </label>
                        </div>
                        {faviconImage && (
                          <div className="mt-2 flex items-center gap-3">
                            <img
                              src={URL.createObjectURL(faviconImage)}
                              alt="Favicon preview"
                              className="h-12 w-12 object-cover rounded-md"
                            />
                            <span className="text-sm text-gray-400">{faviconImage.name}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Banner Heading</label>
                        <input
                          name="bannerHeading"
                          defaultValue={config.banner?.heading || 'Welcome to UniUnity'}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Banner Subtext</label>
                        <input
                          name="bannerSubtext"
                          defaultValue={config.banner?.subtext || 'Your ultimate blogging platform'}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">SEO Title</label>
                        <input
                          name="seoTitle"
                          defaultValue={config.seo?.title || 'UniUnity Blog'}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">SEO Description</label>
                        <textarea
                          name="seoDescription"
                          defaultValue={config.seo?.description || 'Explore the best blogs on UniUnity'}
                          rows={3}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Homepage Ad Text</label>
                        <input
                          name="adText"
                          defaultValue={config.homepageAd?.text || 'Check out our latest posts!'}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Homepage Ad Image URL</label>
                        <input
                          name="adImage"
                          defaultValue={config.homepageAd?.image || ''}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Admin Username</label>
                        <input
                          name="adminUsername"
                          defaultValue={config.adminUsername || 'admin'}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Admin Password</label>
                        <input
                          name="adminPassword"
                          type="password"
                          defaultValue={config.adminPassword || 'password'}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                      >
                        <FiSave /> Save Configuration
                      </button>
                    </div>
                  </form>
                  <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-medium mb-2">Crawler Management</h3>
                    <button
                      onClick={inviteCrawlers}
                      className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      <FiUpload /> Invite Crawlers
                    </button>
                    {message.includes('Crawlers') && <p className="mt-2 text-gray-400">{message}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Send Push Notification
                  </h2>
                  <form onSubmit={sendNotification} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Notification Message</label>
                      <textarea
                        value={notificationMessage}
                        onChange={(e) => setNotificationMessage(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Enter notification message (e.g., New blog post available!)"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                      >
                        <FiBell /> Send Notification
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Analytics Dashboard
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-medium text-gray-300 mb-2">Total Posts</h3>
                      <p className="text-3xl font-bold text-purple-400">{blogs.length}</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-medium text-gray-300 mb-2">Published</h3>
                      <p className="text-3xl font-bold text-green-400">{blogs.filter((p: any) => p.status === 'published').length}</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-medium text-gray-300 mb-2">Drafts</h3>
                      <p className="text-3xl font-bold text-yellow-400">{blogs.filter((p: any) => p.status === 'draft').length}</p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-300 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {[...blogs]
                        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 5)
                        .map((post: any) => (
                          <div key={post._id} className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                            <div className="bg-purple-900/50 p-2 rounded-full">
                              <FiEdit className="text-purple-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-100">{post.title}</p>
                              <p className="text-sm text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;