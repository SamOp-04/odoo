// src/app/terms/page.tsx

'use client';

import React from 'react';
import CustomerDashboardLayout from '@/components/layout/CustomerDashboardLayout';

export default function TermsPage() {
  return (
    <CustomerDashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Terms & Conditions
        </h1>

        <div className="space-y-6 text-foreground-secondary">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              1. Introduction
            </h2>
            <p>
              Welcome to our equipment rental service. By accessing and using our platform, 
              you agree to comply with and be bound by the following terms and conditions. 
              Please review them carefully.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              2. Rental Agreement
            </h2>
            <p className="mb-2">
              When you rent equipment from us, you enter into a rental agreement that includes:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>The rental period starts from the date of equipment pickup or delivery</li>
              <li>Equipment must be returned in the same condition as provided</li>
              <li>Late returns may incur additional charges</li>
              <li>You are responsible for the equipment during the rental period</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              3. Payment Terms
            </h2>
            <p className="mb-2">
              Payment for rentals must be made in advance unless otherwise agreed:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>All prices are in Indian Rupees (₹)</li>
              <li>Security deposits may be required for certain equipment</li>
              <li>Refunds are processed within 7-10 business days</li>
              <li>Additional charges apply for damages or loss</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              4. User Responsibilities
            </h2>
            <p className="mb-2">
              As a renter, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Use the equipment only for its intended purpose</li>
              <li>Not sublease or lend the equipment to third parties</li>
              <li>Report any damage or malfunction immediately</li>
              <li>Return equipment clean and in working condition</li>
              <li>Provide accurate identification and contact information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              5. Liability and Insurance
            </h2>
            <p>
              You are liable for any damage, loss, or theft of equipment during the rental period. 
              We recommend obtaining appropriate insurance coverage. Our liability is limited to 
              the replacement value of the equipment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              6. Cancellation Policy
            </h2>
            <p className="mb-2">
              Cancellations and modifications:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Free cancellation up to 48 hours before rental start</li>
              <li>50% refund for cancellations within 24-48 hours</li>
              <li>No refund for cancellations within 24 hours</li>
              <li>Modifications subject to equipment availability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              7. Privacy Policy
            </h2>
            <p>
              We collect and process your personal information in accordance with applicable 
              data protection laws. Your information is used solely for rental purposes and 
              will not be shared with third parties without your consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              8. Dispute Resolution
            </h2>
            <p>
              Any disputes arising from these terms will be resolved through arbitration in 
              accordance with local laws. Both parties agree to attempt mediation before 
              pursuing legal action.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              9. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be 
              effective immediately upon posting. Continued use of our service constitutes 
              acceptance of modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              10. Contact Information
            </h2>
            <p>
              For questions about these terms, please contact us through our Contact Us page 
              or email us at support@yourcompany.com.
            </p>
          </section>

          <div className="pt-6 border-t border-foreground-secondary/20 text-sm">
            <p>Last Updated: February 1, 2026</p>
          </div>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
}
