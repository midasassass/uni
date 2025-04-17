import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 gradient-text text-center">
            About UniUnity.space
          </h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-8 text-center">
              Welcome to UniUnity.space, your one-stop solution for all things tech. We are a dynamic
              and fast-growing tech company with a passion for AI automation, web and app development, and
              driving business growth through cutting-edge digital solutions. Our goal is simple — to transform
              businesses in India and beyond by leveraging the latest advancements in technology.
            </p>

            {/* Vision and Mission */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Our Vision</h3>
                <p className="text-gray-300">
                  To become the leading provider of AI-driven solutions for businesses in India and around
                  the world. We envision a world where every business, regardless of its size, can leverage
                  advanced technology to stay ahead of the competition and deliver exceptional value to customers.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Our Mission</h3>
                <p className="text-gray-300">
                  Our mission is to empower businesses in Delhi NCR and across India by providing
                  innovative, efficient, and scalable digital solutions. We specialize in AI automation,
                  web and app development, and digital marketing services designed to enhance performance and
                  maximize profits. We are committed to delivering **real business growth** and success.
                </p>
              </motion.div>
            </div>

            {/* Why Choose Us */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-8 backdrop-blur-sm shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-6 gradient-text text-center">Why Choose Us?</h2>
              <ul className="space-y-4 text-gray-300 text-lg">
                <motion.li
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  ✨ Cutting-edge AI technology integration: We stay ahead of the curve by integrating the
                  latest AI solutions into your business processes, helping you increase efficiency and
                  profitability.
                </motion.li>
                <motion.li
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  🚀 Rapid development and deployment: With React, Node.js, and other modern
                  technologies, we ensure your product is built quickly and is scalable to meet future needs.
                </motion.li>
                <motion.li
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  💡 Innovative solutions for complex problems: We are problem solvers at heart. Whether it’s
                  creating efficient algorithms or designing intuitive user experiences, we take pride in offering
                  solutions that make a difference.
                </motion.li>
                <motion.li
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  🤝 Dedicated support and consultation: We don’t just build your product and leave. We are
                  committed to ongoing support, regular check-ins, and providing insights on how to scale your
                  business.
                </motion.li>
              </ul>
            </motion.div>

            {/* Services Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-12 mt-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-4 text-purple-400">AI Automation</h3>
                <p className="text-gray-300">
                  Unlock the power of AI to automate business processes, optimize workflows, and increase
                  productivity. From chatbots to predictive analytics, our AI solutions will help your
                  business operate more efficiently and effectively.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Website & App Development</h3>
                <p className="text-gray-300">
                  We specialize in React-based websites and mobile apps that are fast, secure, and built
                  to scale. Our web solutions are **SEO optimized**, responsive, and designed with your users
                  in mind. Whether you need a simple landing page or a complex e-commerce platform, we’ve got you covered.
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12 mt-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Digital Marketing</h3>
                <p className="text-gray-300">
                  Whether you're aiming for local SEO in Delhi NCR or want to target a global audience, our
                  digital marketing team is equipped with the latest strategies to help you grow your online
                  presence. From **social media marketing** to **Google Ads**, we provide **end-to-end services**.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Custom AI Solutions</h3>
                <p className="text-gray-300">
                  We understand that no two businesses are alike. That’s why we offer **custom AI solutions** that
                  are tailored to meet the unique challenges and goals of your business. Let’s discuss how we can
                  transform your business with AI!
                </p>
              </motion.div>
            </div>

            {/* Call-to-Action */}
            <div className="bg-purple-700 p-8 mt-16 rounded-xl text-center shadow-xl">
              <h2 className="text-3xl text-white font-semibold mb-6">Ready to Take Your Business to the Next Level?</h2>
              <p className="text-lg text-gray-200 mb-8">
                Whether you're looking for AI automation, website development, or digital marketing solutions,
                we are here to help you succeed. Let’s chat about how we can take your business to the next level.
              </p>
              <a
                href="/contact"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg py-3 px-8 rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
