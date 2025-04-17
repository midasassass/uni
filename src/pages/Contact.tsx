import React from 'react';
import { motion } from 'framer-motion';
import ContactForm from '../components/ContactForm';
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Youtube,
  Linkedin,
  Clock,
  HelpCircle,
} from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen pt-24 pb-32 px-4 md:px-8 bg-gradient-to-tr from-[#0f0c29] via-[#302b63] to-[#24243e] text-white relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
            Let's Build the Future Together
          </h1>
          <p className="text-lg mt-4 text-gray-300 max-w-2xl mx-auto">
            We're UniUnity — building tech & marketing magic for your startup or brand. Whether it’s launching your app, growing your users, or automating your operations, we’ve got your back!
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-14">
          {/* Left Column: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
          >
            <div className="space-y-5">
              <ContactItem icon={<Mail className="text-purple-400" />} text="techarket@gmail.com" href="mailto:techarket@gmail.com" />
              <ContactItem icon={<Phone className="text-purple-400" />} text="+91 9875817918" href="tel:+919875817918" />
              <ContactItem icon={<MapPin className="text-purple-400" />} text="Gurgaon | India" />
              <ContactItem icon={<Clock className="text-purple-400" />} text="Mon - Sat: 10AM - 8PM" />
            </div>

            <a
              href="https://wa.me/919875817918"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:scale-105 transition-transform shadow-xl"
            >
              💬 Chat on WhatsApp
            </a>

            <div className="mt-10">
              <p className="text-lg font-semibold text-white mb-4">Follow Us</p>
              <div className="flex flex-wrap gap-6">
                <SocialLink icon={<Linkedin className="text-blue-400" />} text="LinkedIn" href="https://www.linkedin.com/in/hxrsh/" />
                <SocialLink icon={<Instagram className="text-pink-400" />} text="Instagram" href="https://www.instagram.com/harshdimension/" />
                <SocialLink icon={<Youtube className="text-red-500" />} text="YouTube" href="https://www.youtube.com/@creatorcosmos" />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 md:p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-semibold mb-4 text-white">Send Us a Message</h2>
            <p className="text-sm text-gray-400 mb-6">
              Tell us about your idea, project, or question — we’ll respond within 24 hours.
            </p>
            <ContactForm />
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-24 space-y-12"
        >
          <h3 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-10">
            <FaqCard
              question="What services do you offer?"
              answer="We offer web & app development, AI automation, digital marketing, user acquisition, and branding services globally."
            />
            <FaqCard
              question="Where are you located?"
              answer="We operate from Gurgaon, India — but work with clients from all over the world."
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Glow Effects */}
      <div className="absolute -top-40 -left-40 w-[450px] h-[450px] bg-pink-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] bg-purple-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
    </div>
  );
}

// Reusable Contact Info Item
const ContactItem = ({ icon, text, href }: { icon: React.ReactNode; text: string; href?: string }) => {
  const Wrapper = href ? 'a' : 'div';
  return (
    <Wrapper
      {...(href && { href, target: '_blank', rel: 'noopener noreferrer' })}
      className="flex items-center space-x-4 text-gray-300 hover:text-purple-400 transition-all"
    >
      {icon}
      <span>{text}</span>
    </Wrapper>
  );
};

// Reusable Social Link
const SocialLink = ({ icon, text, href }: { icon: React.ReactNode; text: string; href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center space-x-2 hover:scale-105 transition-transform"
  >
    {icon}
    <span className="text-gray-300 hover:text-white">{text}</span>
  </a>
);

// Reusable FAQ Card
const FaqCard = ({ question, answer }: { question: string; answer: string }) => (
  <div className="bg-white/5 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
    <div className="flex items-center space-x-3 mb-3">
      <HelpCircle className="text-purple-400" />
      <h4 className="font-semibold text-white">{question}</h4>
    </div>
    <p className="text-gray-300">{answer}</p>
  </div>
);
