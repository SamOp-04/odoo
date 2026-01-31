// src/app/page.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { Package, ShieldCheck, Clock, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: Package,
      title: 'Wide Selection',
      description: 'Browse thousands of products available for rent from trusted vendors.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Reliable',
      description: 'All products are verified and insured for your peace of mind.',
    },
    {
      icon: Clock,
      title: 'Flexible Rental',
      description: 'Rent for hours, days, weeks, or custom periods that suit your needs.',
    },
    {
      icon: TrendingUp,
      title: 'Best Prices',
      description: 'Competitive rates with transparent pricing and no hidden fees.',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Rent Anything,
            <span className="text-primary"> Anytime</span>
          </h1>
          <p className="text-xl text-foreground-secondary mb-8">
            Your trusted marketplace for renting equipment, tools, and products.
            Save money, reduce waste, and access what you need when you need it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => router.push('/customer/products')}
            >
              Browse Products
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => router.push('/auth/signup')}
            >
              Become a Vendor
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="p-6 bg-background-secondary rounded-lg border border-foreground-secondary/10 hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-foreground-secondary">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 p-8 bg-primary/10 rounded-lg border border-primary/20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-foreground-secondary mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust RentalHub for their rental needs.
            </p>
            <Link href="/auth/signup">
              <Button size="lg">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}