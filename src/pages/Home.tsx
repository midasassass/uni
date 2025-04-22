import React, { useEffect, useState, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { ArrowRight, Bot, Globe, Smartphone, Users, Star, Zap, ChevronRight } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';

const imageUrls = {
  hero: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
  feature: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
  projects: [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80'
  ],
  testimonials: [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80'
  ]
};

export default function Home() {
  const { config, initialize, loading, error } = useAdminStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const controls = useAnimation();
  const [email, setEmail] = useState('');

  const services = [
    {
      icon: Bot,
      title: 'AI Automation',
      description: 'Streamline your operations with cutting-edge AI solutions.',
      color: 'text-purple-400',
      link: '/services/ai-automation'
    },
    {
      icon: Globe,
      title: 'Website Development',
      description: 'Create stunning, responsive websites that convert.',
      color: 'text-blue-400',
      link: '/services/web-development'
    },
    {
      icon: Smartphone,
      title: 'App Development',
      description: 'Build powerful mobile applications for iOS and Android.',
      color: 'text-green-400',
      link: '/services/app-development'
    },
    {
      icon: Users,
      title: 'User Acquisition',
      description: 'Grow your user base with AI-driven marketing strategies.',
      color: 'text-pink-400',
      link: '/services/marketing'
    },
  ];

  const testimonials = [
    {
      name: 'Modern Yogi',
      role: 'CEO, ModernYog',
      content: 'UniUnity.space transformed our business with their AI solutions. Highly recommended!',
      rating: 5
    },
    {
      name: 'Mr. Sahil',
      role: 'Founder, Fitness Bar Nutrition',
      content: 'The team delivered our app ahead of schedule and exceeded all expectations.',
      rating: 4
    },
    {
      name: 'Ranjan Mahawar',
      role: 'Marketing Director',
      content: 'Their user acquisition strategies helped us achieve 300% growth in three months.',
      rating: 5
    },
  ];

  // Initialize data with polling
  useEffect(() => {
    initialize();
    const interval = setInterval(() => initialize(), 30000);
    return () => clearInterval(interval);
  }, [initialize]);

  // Rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 3);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Animate floating elements
  useEffect(() => {
    controls.start({
      y: [0, -15, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    });
  }, [controls]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you for subscribing! We'll send updates to ${email}`);
    setEmail('');
  }, [email]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-4 border-t-4 border-purple-400 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-lg">Error: {error}. Please try again later or contact support.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Floating decorative elements */}
      <motion.div 
        animate={controls}
        className="fixed top-1/4 left-10 w-8 h-8 rounded-full bg-purple-600/30 blur-xl z-0"
      />
      <motion.div 
        animate={{
          ...controls,
          x: [0, 20, 0],
          transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
        className="fixed top-3/4 right-20 w-12 h-12 rounded-full bg-pink-600/20 blur-xl z-0"
      />
      <motion.div 
        animate={{
          ...controls,
          y: [0, -25, 0],
          transition: { duration: 7, repeat: Infinity, ease: "easeInOut" }
        }}
        className="fixed bottom-1/3 left-1/4 w-6 h-6 rounded-full bg-blue-600/20 blur-lg z-0"
      />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${imageUrls.hero})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onError={(e) => {
              (e.target as HTMLDivElement).style.backgroundImage = `url('https://via.placeholder.com/1600x900?text=Image+Not+Available')`;
            }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/80 z-0" />

        <div className="relative max-w-6xl mx-auto text-center z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="mb-8"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
            >
              <Zap className="h-4 w-4 text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-white">Innovating with AI</span>
            </motion.div>
            
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400"
            >
              {config?.banner?.heading || 'Welcome to UniUnity'}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              {config?.banner?.subtext || 'Your ultimate platform for innovation'}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="https://wa.me/919875817918"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
            >
              Let's Talk
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.a>
            
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="#services"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/20 transition-all duration-300"
            >
              Our Services
              <ChevronRight className="ml-2 h-5 w-5" />
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 flex justify-center"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                transition: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="text-gray-400"
            >
              <ChevronRight className="h-6 w-6 rotate-90" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-purple-900/30 to-transparent -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-purple-400 text-sm font-medium mb-4">
              What We Offer
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Our Services
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Comprehensive solutions tailored to your business needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.a
                key={service.title}
                href={service.link}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-sm border border-white/10 p-6 hover:border-white/20 transition-all duration-300 block"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className={`${service.color} mb-6`}>
                    <service.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{service.title}</h3>
                  <p className="text-gray-400 mb-6">{service.description}</p>
                  <div className="flex items-center text-sm text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section with Image */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white/5 to-black/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-blue-400 text-sm font-medium mb-4">
              Innovation
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
              AI for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Everyday Workflows</span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Our cutting-edge tools empower businesses to automate mundane tasks and scale operations efficiently. 
              Leverage the power of AI to transform your daily workflows and focus on what really matters.
            </p>
            
            <div className="space-y-4 mb-8">
              {['Automated Data Processing', 'Smart Analytics Dashboard', 'Real-time Collaboration', 'AI-powered Insights'].map((feature, i) => (
                <div key={i} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                    </div>
                  </div>
                  <p className="ml-3 text-gray-300">{feature}</p>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href="/ai-solutions"
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href="/case-studies"
                className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/20 transition-all"
              >
                Case Studies
              </motion.a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -top-8 -right-8 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl -z-10" />
            <div className="absolute -bottom-8 -left-8 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl -z-10" />
            
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <img
                src={imageUrls.feature}
                alt="AI Workflow"
                className="w-full h-auto object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Workflow Automation</h3>
                <p className="text-gray-300 text-sm">Reduce manual work by up to 80% with our AI solutions</p>
              </div>
              
              <div className="absolute top-4 right-4 flex space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '100+', label: 'Projects Completed', link: '/portfolio' },
              { value: '95%', label: 'Client Satisfaction', link: '/testimonials' },
              { value: '40+', label: 'Team Members', link: '/about' },
              { value: '24/7', label: 'Support Available', link: '/contact' }
            ].map((stat, i) => (
              <motion.a
                key={stat.label}
                href={stat.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center block hover:scale-105 transition-transform"
              >
                <div className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-300">{stat.label}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Project Highlights Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519750783826-e2420f4d687f?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-5 -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-pink-400 text-sm font-medium mb-4">
              Our Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Work in Action
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Explore our recent projects that delivered exceptional results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {imageUrls.projects.map((image, index) => (
              <motion.a
                key={index}
                href={`/projects/project-${index + 1}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 block"
              >
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img
                    src={image}
                    alt={`Project ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450?text=Image+Not+Available';
                    }}
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Project Title {index + 1}</h3>
                  <p className="text-gray-300 mb-4">Brief description of what was done in the project and its impact.</p>
                  <div className="inline-flex items-center text-sm text-white hover:text-blue-400 transition-colors">
                    View case study <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
                
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm font-medium">
                    {index === 0 ? 'Web Development' : 'Mobile App'}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="/portfolio"
              className="inline-flex items-center px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/20 transition-all"
            >
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-900/20 to-transparent relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-5 -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-yellow-400 text-sm font-medium mb-4">
              Client Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:border-white/20 transition-all"
              >
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-purple-600/20 blur-3xl -z-10" />
                
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <img
                      src={imageUrls.testimonials[index]}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white/20"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=Image+Not+Available';
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{testimonial.name}</h3>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
                
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519750783826-e2420f4d687f?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-5 -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-blue-900/30 -z-10" />
        
        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-10 shadow-xl"
          >
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-purple-600/20 blur-3xl -z-10" />
            
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
              Stay Updated
            </h2>
            <p className="text-gray-300 mb-6 max-w-lg mx-auto">
              Join our newsletter to receive the latest updates, insights, and exclusive offers.
            </p>
            
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center"
            >
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full sm:w-auto flex-grow px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                Subscribe
              </motion.button>
            </form>
            
            <p className="text-xs text-gray-500 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-10 -z-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-pink-900/40 -z-10" />
        
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-pink-900/40 rounded-2xl p-8 sm:p-12 backdrop-blur-sm border border-white/10 shadow-2xl"
          >
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-purple-600/20 blur-3xl -z-10" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-pink-600/20 blur-3xl -z-10" />
            
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Transform</span> Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Let's discuss how we can help you achieve your goals with our AI-driven solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href="https://wa.me/919875817918"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/20 transition-all"
              >
                Chat with Us
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
