// src/app/about/page.tsx

'use client';

import React from 'react';
import CustomerDashboardLayout from '@/components/layout/CustomerDashboardLayout';
import { Users, Target, Award, Shield, Heart, Zap } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <Shield size={32} />,
      title: 'Trust & Reliability',
      description: 'We ensure all equipment is maintained to the highest standards and delivered on time.'
    },
    {
      icon: <Heart size={32} />,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We provide 24/7 support for all your rental needs.'
    },
    {
      icon: <Zap size={32} />,
      title: 'Innovation',
      description: 'We constantly update our inventory with the latest technology and equipment.'
    },
    {
      icon: <Award size={32} />,
      title: 'Quality Assured',
      description: 'Every piece of equipment undergoes rigorous quality checks before rental.'
    }
  ];

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      description: 'With 15 years in the equipment rental industry, Rajesh leads our vision.'
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Operations',
      description: 'Priya ensures seamless delivery and maintenance of all rental equipment.'
    },
    {
      name: 'Amit Patel',
      role: 'Customer Success Manager',
      description: 'Amit and his team ensure every customer has an exceptional experience.'
    },
    {
      name: 'Sneha Reddy',
      role: 'Technology Lead',
      description: 'Sneha drives our digital transformation and platform innovation.'
    }
  ];

  return (
    <CustomerDashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            About Us
          </h1>
          <p className="text-xl text-foreground-secondary max-w-3xl mx-auto">
            Your trusted partner for premium equipment rentals. We make access to 
            technology and tools simple, affordable, and reliable.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-background-secondary p-8 rounded-lg border border-foreground-secondary/10">
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-primary" size={36} />
              <h2 className="text-2xl font-semibold text-foreground">Our Mission</h2>
            </div>
            <p className="text-foreground-secondary">
              To democratize access to high-quality equipment by providing flexible, 
              affordable rental solutions that empower individuals and businesses to 
              achieve their goals without the burden of ownership.
            </p>
          </div>

          <div className="bg-background-secondary p-8 rounded-lg border border-foreground-secondary/10">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-primary" size={36} />
              <h2 className="text-2xl font-semibold text-foreground">Our Vision</h2>
            </div>
            <p className="text-foreground-secondary">
              To become the leading equipment rental platform in India, known for our 
              exceptional service, extensive inventory, and commitment to sustainability 
              through the sharing economy.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
            Our Story
          </h2>
          <div className="bg-background-secondary p-8 rounded-lg border border-foreground-secondary/10">
            <div className="space-y-4 text-foreground-secondary">
              <p>
                Founded in 2020, our equipment rental platform was born from a simple idea: 
                why should access to quality equipment be limited by high purchase costs? 
                We recognized that many individuals and businesses needed temporary access 
                to laptops, cameras, tools, and other equipment for projects, events, or 
                short-term needs.
              </p>
              <p>
                What started as a small operation with a handful of laptops has grown into 
                a comprehensive rental platform serving thousands of customers across India. 
                Our inventory now includes everything from high-end electronics to professional 
                equipment, all maintained to the highest standards.
              </p>
              <p>
                Today, we're proud to be a trusted partner for students, freelancers, 
                startups, and established businesses alike. Our commitment to quality, 
                reliability, and customer service has made us a leader in the rental industry.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-background-secondary p-6 rounded-lg border border-foreground-secondary/10 text-center hover:border-primary/50 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full text-primary mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-foreground-secondary">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div 
                key={index}
                className="bg-background-secondary p-6 rounded-lg border border-foreground-secondary/10 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-primary mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-foreground-secondary">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-lg p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-sm opacity-90">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-sm opacity-90">Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-sm opacity-90">Cities</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-sm opacity-90">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-background-secondary p-8 rounded-lg border border-foreground-secondary/10">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-foreground-secondary mb-6">
            Explore our wide range of equipment and find the perfect rental for your needs.
          </p>
          <a
            href="/customer/products"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Browse Products
          </a>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
}
