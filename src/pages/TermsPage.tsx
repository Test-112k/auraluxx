
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const TermsPage = () => {
  return (
    <MainLayout>
      <div className="auraluxx-container py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Terms of Use</h1>
          
          <div className="glass-card p-6 space-y-6 text-white/80">
            <p>
              Welcome to Auraluxx. By accessing or using our website, you agree to be bound by these Terms of Use.
            </p>
            
            <h2 className="text-xl font-semibold text-white mt-6">1. Content Disclaimer</h2>
            <p>
              All content provided on this website is for informational purposes only. Auraluxx does not host, upload, or store any media files on its servers.
              We simply provide links to content hosted on third-party services that are publicly available on the internet.
            </p>
            
            <h2 className="text-xl font-semibold text-white mt-6">2. User Responsibilities</h2>
            <p>
              Users are responsible for ensuring that their use of the content linked through our service complies with applicable copyright laws in their country.
              We strongly encourage users to respect copyright holders by purchasing content through authorized channels.
            </p>
            
            <h2 className="text-xl font-semibold text-white mt-6">3. Third-Party Content</h2>
            <p>
              We do not control, endorse, or take responsibility for any third-party content accessible through our service.
              Any reliance on or interaction with such third-party content is at the user's own risk.
            </p>
            
            <h2 className="text-xl font-semibold text-white mt-6">4. Limitation of Liability</h2>
            <p>
              Auraluxx shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of the use or inability to use our service.
            </p>
            
            <h2 className="text-xl font-semibold text-white mt-6">5. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Your continued use of the service constitutes agreement to all such terms.
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

export default TermsPage;
