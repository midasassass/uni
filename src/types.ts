export interface SiteConfig {
  title: string;
  favicon: string;
  banner: {
    heading: string;
    subtext: string;
  };
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
  homepageAd: {
    text: string;
    image: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  slug: string;
}

export interface AdminState {
  isAuthenticated: boolean;
  config: SiteConfig;
  blogPosts: BlogPost[];
}