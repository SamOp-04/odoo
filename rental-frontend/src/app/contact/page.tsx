// src/app/contact/page.tsx

'use client';

import React, { useState } from 'react';
import CustomerDashboardLayout from '@/components/layout/CustomerDashboardLayout';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Thank you for contacting us! We will get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitMessage(''), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: 'Phone',
      details: ['+91 98765 43210', '+91 87654 32109'],
      description: 'Mon-Sat, 9:00 AM - 7:00 PM'
    },
    {
      icon: <Mail size={24} />,
      title: 'Email',
      details: ['support@yourcompany.com', 'info@yourcompany.com'],
      description: 'We respond within 24 hours'
    },
    {
      icon: <MapPin size={24} />,
      title: 'Office',
      details: ['123 Business Hub, MG Road', 'Bangalore, Karnataka 560001'],
      description: 'Visit us during business hours'
    },
    {
      icon: <Clock size={24} />,
      title: 'Business Hours',
      details: ['Monday - Friday: 9:00 AM - 7:00 PM', 'Saturday: 10:00 AM - 5:00 PM'],
      description: 'Sunday: Closed'
    }
  ];

  return (
    <CustomerDashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and 
            we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <div 
              key={index}
              className="bg-background-secondary p-6 rounded-lg border border-foreground-secondary/10 text-center hover:border-primary/50 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full text-primary mb-4">
                {info.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {info.title}
              </h3>
              {info.details.map((detail, idx) => (
                <p key={idx} className="text-sm text-foreground mb-1">
                  {detail}
                </p>
              ))}
              <p className="text-xs text-foreground-secondary mt-2">
                {info.description}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Form and Map */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-background-secondary p-8 rounded-lg border border-foreground-secondary/10">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Send us a Message
            </h2>
            
            {submitMessage && (
              <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg text-success">
                {submitMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                  Subject *
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full px-4 py-2 bg-background border border-foreground-secondary/20 rounded-lg text-foreground placeholder:text-foreground-secondary focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send size={18} className="mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Map and Additional Info */}
          <div className="space-y-6">
            {/* Map Placeholder */}
            <div className="bg-background-secondary rounded-lg border border-foreground-secondary/10 overflow-hidden h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9482188810945!2d77.5945627!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBangalore!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              />
            </div>

            {/* FAQ Section */}
            <div className="bg-background-secondary p-6 rounded-lg border border-foreground-secondary/10">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    How quickly do you respond?
                  </h4>
                  <p className="text-sm text-foreground-secondary">
                    We aim to respond to all inquiries within 24 hours during business days.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    Do you offer phone support?
                  </h4>
                  <p className="text-sm text-foreground-secondary">
                    Yes! Call us during business hours for immediate assistance.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    Can I visit your office?
                  </h4>
                  <p className="text-sm text-foreground-secondary">
                    Absolutely! We welcome visitors during business hours. Please call ahead.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-12 bg-gradient-to-r from-primary to-blue-600 rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">
            Need Immediate Assistance?
          </h3>
          <p className="mb-4 opacity-90">
            For urgent rental issues or emergency support
          </p>
          <a 
            href="tel:+919876543210"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Call Emergency Hotline: +91 98765 43210
          </a>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
}
