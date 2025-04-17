import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminState, SiteConfig, BlogPost } from '../types';

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
    (set) => ({
      isAuthenticated: false,
      config: defaultConfig,
      blogPosts: [],
      login: (username: string, password: string) => {
        if (username === 'admin' && password === 'uniunity123') {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
      updateConfig: (config: Partial<SiteConfig>) =>
        set((state) => ({ config: { ...state.config, ...config } })),
      addBlogPost: (post: BlogPost) =>
        set((state) => ({ blogPosts: [...state.blogPosts, post] })),
      updateBlogPost: (id: string, post: Partial<BlogPost>) =>
        set((state) => ({
          blogPosts: state.blogPosts.map((p) =>
            p.id === id ? { ...p, ...post } : p
          ),
        })),
      deleteBlogPost: (id: string) =>
        set((state) => ({
          blogPosts: state.blogPosts.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'admin-storage',
    }
  )
);