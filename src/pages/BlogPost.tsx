import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useAdminStore } from '../store/adminStore';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { blogPosts } = useAdminStore();
  
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    React.useEffect(() => {
      navigate('/blog');
    }, [navigate]);
    return null;
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <article className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
          />
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            {post.title}
          </h1>
          
          <p className="text-gray-400 mb-8">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>

          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </motion.div>
      </article>
    </div>
  );
}