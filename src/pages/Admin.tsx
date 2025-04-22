import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useDebounce } from 'use-debounce';
import { FiEdit, FiTrash2, FiEye, FiSave, FiUpload, FiImage, FiSettings, FiFileText, FiBell } from 'react-icons/fi';
import { useAdminStore } from '../../store/adminStore';

const MarkdownEditor = lazy(() => import('@uiw/react-markdown-editor').then(mod => ({ default: mod.default })));

type TabType = 'posts' | 'new' | 'config' | 'analytics' | 'notifications';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  status: string;
  createdAt: string;
}

interface Config {
  title?: string;
  favicon?: string;
  banner?: {
    heading?: string;
    subtext?: string;
  };
  seo?: {
    title?: string;
    description?: string;
  };
  homepageAd?: {
    text?: string;
    image?: string;
  };
  adminUsername?: string;
  adminPassword?: string;
}

const Admin = () => {
  const { isAuthenticated, login, logout, config, blogPosts, initialize, updateConfig, loading, error, addBlogPost, updateBlogPost, deleteBlogPost } = useAdminStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [debouncedTitle] = useDebounce(title, 500);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const API_BASE_URL = 'https://api.uniunity.space';

  // Sync initial form state with config
  useEffect(() => {
    setTitle('');
    setContent('');
    setSlug('');
    setSeoTitle('');
    setSeoDescription('');
    setEditingPostId(null);
  }, [activeTab]);

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

  const [activeTab, setActiveTab] = useState<TabType>('posts');

  const fetchData = useCallback(async () => {
    await initialize();
  }, [initialize]);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated, fetchData]);

  const resetForm = useCallback(() => {
    setTitle('');
    setContent('');
    setSlug('');
    setSeoTitle('');
    setSeoDescription('');
    setEditingPostId(null);
  }, []);

  const loadPostForEditing = useCallback((postId: string) => {
    const post = blogPosts.find(p => p._id === postId);
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setSlug(post.slug || '');
      setSeoTitle(post.seoTitle || '');
      setSeoDescription(post.seoDescription || '');
      setEditingPostId(post._id);
      setActiveTab('new');
    } else {
      setMessage('Post not found for editing!');
    }
  }, [blogPosts]);

  const handleSubmitBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const postData = {
        title,
        content,
        slug,
        seoTitle: seoTitle || `${title} | UniUnity`,
        seoDescription: seoDescription || content.substring(0, 160),
        status: 'published',
      };

      if (editingPostId) {
        await updateBlogPost(editingPostId, postData);
      } else {
        await addBlogPost(postData);
      }

      resetForm();
      setMessage(`${editingPostId ? 'Updated' : 'Published'} post successfully!`);
    } catch (err) {
      setMessage(`Failed to ${editingPostId ? 'update' : 'publish'} post!`);
    }
    setIsSubmitting(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteBlogPost(postId);
        setMessage('Post deleted successfully!');
      } catch (err) {
        setMessage('Failed to delete post!');
      }
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const configData: any = {};

    formData.forEach((value, key) => {
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        configData[parent] = configData[parent] || {};
        configData[parent][child] = value;
      } else {
        configData[key] = value;
      }
    });

    const currentPassword = (e.target as any).currentPassword?.value;
    if (currentPassword) configData.currentPassword = currentPassword;

    try {
      await updateConfig(configData);
      setMessage('Config updated successfully!');
    } catch (err) {
      setMessage('Config update failed!');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/send-notification`, { message: notificationMessage });
      setMessage('Notification sent successfully!');
      setNotificationMessage('');
    } catch (err) {
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
    } catch (err) {
      setMessage('Crawler invitation failed!');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && activeTab === 'new') {
        e.preventDefault();
        const form = document.querySelector('form');
        if (form) form.requestSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="h-12 w-12 border-4 border-t-4 border-purple-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-lg">Error: {error}. Contact support if persists.</p>
      </div>
    );
  }

  if (!isAuthenticated) {
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
            onClick={handleLogout}
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
                        {blogPosts.map((post) => (
                          <tr key={post._id} className="hover:bg-gray-800/50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-100">{post.title}</div>
                              <div className="text-xs text-gray-400">{post.slug || ''}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                post.status === 'published' ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'
                              }`}>
                                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
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
                      <Suspense fallback={<div className="h-64 bg-gray-800/50 rounded-md animate-pulse">Loading editor...</div>}>
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
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Banner Heading</label>
                        <input
                          name="banner.heading"
                          defaultValue={config.banner?.heading || 'Welcome to UniUnity'}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Banner Subtext</label>
                        <input
                          name="banner.subtext"
                          defaultValue={config.banner?.subtext || 'Your ultimate blogging platform'}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">SEO Title</label>
                        <input
                          name="seo.title"
                          defaultValue={config.seo?.title || 'UniUnity Blog'}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">SEO Description</label>
                        <textarea
                          name="seo.description"
                          defaultValue={config.seo?.description || 'Explore the best blogs on UniUnity'}
                          rows={3}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Homepage Ad Text</label>
                        <input
                          name="homepageAd.text"
                          defaultValue={config.homepageAd?.text || 'Check out our latest posts!'}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Homepage Ad Image URL</label>
                        <input
                          name="homepageAd.image"
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
                        <label className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
                        <input
                          name="currentPassword"
                          type="password"
                          placeholder="Enter current password"
                          className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">New Admin Password</label>
                        <input
                          name="adminPassword"
                          type="password"
                          placeholder="Leave empty to keep current"
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
                      <p className="text-3xl font-bold text-purple-400">{blogPosts.length}</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-medium text-gray-300 mb-2">Published</h3>
                      <p className="text-3xl font-bold text-green-400">{blogPosts.filter(p => p.status === 'published').length}</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-medium text-gray-300 mb-2">Drafts</h3>
                      <p className="text-3xl font-bold text-yellow-400">{blogPosts.filter(p => p.status === 'draft').length}</p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-300 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {[...blogPosts]
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 5)
                        .map((post) => (
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
