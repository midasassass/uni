import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdminStore } from '../store/adminStore';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

export default function Blog() {
  const { blogPosts } = useAdminStore();

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-[#0d0d0d] to-black text-white">
      <div className="max-w-6xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-10 gradient-text tracking-tight leading-tight">
            HotFeeds Blog & Insights
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Discover trending AI tools, viral startups, meme-worthy stories, and the hottest news on the internet. Stay ahead of the curve with sharp, SEO-optimized insights.
          </p>
        </motion.header>

        {blogPosts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl text-gray-500">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                aria-label={`Read more about ${post.title}`}
              >
                <motion.article
                  className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-3 group-hover:text-purple-400 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.article>
              </Link>
            ))}
          </section>
        )}

        {/* Newsletter Section */}
        <section className="mt-20 text-center">
          <h2 className="text-3xl font-semibold mb-4">Stay Updated with the Latest Trends!</h2>
          <p className="text-lg text-gray-400 mb-6">Sign up for our newsletter to get fresh updates delivered straight to your inbox.</p>
          <form action="https://formspree.io/f/xkgjarqb" method="POST" className="max-w-xl mx-auto bg-white/10 p-6 rounded-xl shadow-md">
            <input
              type="email"
              name="email"
              placeholder="Your Email Address"
              required
              className="w-full p-3 bg-transparent border-2 border-gray-500 rounded-md text-white placeholder-gray-400 mb-4"
            />
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-md hover:bg-gradient-to-l transition-all"
            >
              Subscribe Now
            </button>
          </form>
        </section>

        {/* Social Sharing Section */}
        <section className="mt-20 text-center">
          <h2 className="text-3xl font-semibold mb-4">Connect with us!</h2>
          <div className="flex justify-center gap-6">
            <a
              href={`https://facebook.com/sharer/sharer.php?u=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              className="p-3 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-all"
            >
              <FaFacebook size={24} />
            </a>
        
            <a
              href={`https://www.linkedin.com/in/hxrsh/?ref=${window.location.href}`}

              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
              className="p-3 bg-blue-700 rounded-full text-white hover:bg-blue-800 transition-all"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href={`https://www.instagram.com/harshdimension/# ${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Instagram"
              className="p-3 bg-pink-500 rounded-full text-white hover:bg-pink-600 transition-all"
            >
              <FaInstagram size={24} />
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
