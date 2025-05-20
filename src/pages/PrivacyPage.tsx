
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const PrivacyPage = () => {
  return (
    <MainLayout>
      <div className="auraluxx-container py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="glass-card p-6 space-y-6 text-white/80">
            <p>
              At Auraluxx, we take your privacy seriously. This Privacy Policy outlines how we handle your information.
            </p>
            
            <h2 className="text-xl font-semibold text-white mt-6">1. Information Collection</h2>
            <p>
              We do not collect personally identifiable information without your consent. The only data we may collect is anonymous usage data through cookies and similar technologies to improve our service.
            </p>
            
            <h2 className="text-xl font-semibold text-white mt-6">2. Data Storage</h2>
            <p>
              Auraluxx does not store any media files on our servers. All content is streamed directly from third-party sources. We do not host, upload, or distribute any copyrighted content.
            </p>
            
            <h2 className="text-xl font-semibold text-white mt-6">3. Third-Party Services</h2>
            <p>
              Our website may contain links to third-party websites or services. We have no control over the content, privacy policies, or practices of these third-party services and assume no responsibility for them.
            </p>
            
            <h2 className="text-xl font-semibold text-white mt-6">4. Cookies</h2>
            <p>
              We use cookies to enhance your browsing experience. You can choose to disable cookies in your browser settings, although this may affect certain functionalities of our website.
            </p>
            
            <h2 className="text-xl font-semibold text-white mt-6">5. Changes to Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
            
            <div className="pt-6 border-t border-white/10 mt-8">
              <p className="text-white/60 text-sm">
                Last updated: May 20, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPage;
