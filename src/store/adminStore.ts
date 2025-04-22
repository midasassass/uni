import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import type { AdminState, SiteConfig, BlogPost } from '../types';

const API_BASE_URL = 'https://api.uniunity.space';

const defaultConfig: SiteConfig = {
  title: 'UniUnity.space',
  favicon: '/favicon.ico',
  banner: {
    heading: 'Future-Proof Your Growth with AI-Driven Tech',
    subtext: 'Empowering businesses with cutting-edge AI solutions and development services',
  },
  seo: {
    title: 'UniUnity.space - AI-Driven Tech Solutions',
    description: 'Leading provider of AI automation, website development, app development, and user acquisition services.',
    ogImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
  },
  homepageAd: {
    text: 'Transform your business with AI',
    image: 'https://images.unsplash.com/photo-1636819488524-1f019c4e1c44?auto=format&fit=crop&q=80',
  },
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      config: defaultConfig,
      blogPosts: [],
      loading: false,
      error: null,

      initialize: async () => {
        set({ loading: true, error: null });
        try {
          const [configResponse, blogsResponse] = await Promise.all([
            axios.get(`${API_BASE_URL}/api/config`),
            axios.get(`${API_BASE_URL}/api/blogs`),
          ]);
          set({
            config: configResponse.data || defaultConfig,
            blogPosts: blogsResponse.data || [],
            loading: false,
          });
        } catch (err) {
          set({
            error: 'Failed to load data from server. Please try again later.',
            loading: false,
          });
          console.error('Initialize error:', err.message);
        }
      },

      login: async (username: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(`${API_BASE_URL}/api/auth`, { username, password });
          if (response.data.success) {
            set({ isAuthenticated: true, loading: false });
            return true;
          }
          set({ error: 'Invalid credentials', loading: false });
          return false;
        } catch (err) {
          set({ error: 'Authentication failed', loading: false });
          console.error('Login error:', err.message);
          return false;
        }
      },

      logout: () => set({ isAuthenticated: false }),

      updateConfig: async (config: Partial<SiteConfig>) => {
        set({ loading: true, error: null });
        try {
          const currentConfig = get().config;
          const updatedConfig = { ...currentConfig, ...config };
          await axios.post(`${API_BASE_URL}/api/config`, updatedConfig);
          set({ config: updatedConfig, loading: false });
        } catch (err) {
          set({ error: 'Failed to update config', loading: false });
          console.error('Update config error:', err.message);
        }
      },

      addBlogPost: async (post: Omit<BlogPost, 'id' | 'createdAt'>) => {
        set({ loading: true, error: null });
        try {
          const newPost = {
            ...post,
            createdAt: new Date().toISOString(),
          };
          const response = await axios.post(`${API_BASE_URL}/api/blogs`, newPost);
          set((state) => ({
            blogPosts: [...state.blogPosts, response.data],
            loading: false,
          }));
        } catch (err) {
          set({ error: 'Failed to add blog post', loading: false });
          console.error('Add blog post error:', err.message);
        }
      },

      updateBlogPost: async (id: string, post: Partial<BlogPost>) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.put(`${API_BASE_URL}/api/blogs/${id}`, post);
          set((state) => ({
            blogPosts: state.blogPosts.map((p) => (p.id === id ? response.data : p)),
            loading: false,
          }));
        } catch (err) {
          set({ error: 'Failed to update blog post', loading: false });
          console.error('Update blog post error:', err.message);
        }
      },

      deleteBlogPost: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await axios.delete(`${API_BASE_URL}/api/blogs/${id}`);
          set((state) => ({
            blogPosts: state.blogPosts.filter((p) => p.id !== id),
            loading: false,
          }));
        } catch (err) {
          set({ error: 'Failed to delete blog post', loading: false });
          console.error('Delete blog post error:', err.message);
        }
      },
    }),
    {
      name: 'admin-storage',
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage for production to avoid localStorage size limits
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated, config: state.config }),
    }
  )
);

// Initialize on store creation
useAdminStore.getState().initialize();
