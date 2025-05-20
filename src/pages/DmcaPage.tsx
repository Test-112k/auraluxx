
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const DmcaPage = () => {
  return (
    <MainLayout>
      <div className="auraluxx-container py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">DMCA Policy</h1>
          
          <div className="glass-card p-6 space-y-6 text-white/80">
            <p>
              Auraluxx respects the intellectual property rights of others and expects its users to do the same.
            </p>
            
            <h2 className="text-xl font-semibold text-white mt-6">1. No Stored Content</h2>
            <p>
              Auraluxx does not host, store, or upload any video or media content on its servers. All content available through our service is hosted on and streamed from third-party services that are publicly available across the internet.
            </p>
            
            <h2 className="text-xl font-semibold text-white mt-6">2. DMCA Compliance</h2>
            <p>
              We comply with the Digital Millennium Copyright Act (DMCA) and respond promptly to notices of alleged copyright infringement. If you believe that any content linked through our service infringes your copyright, please contact us with the required information.
            </p>
            
            <h2 className="text-xl font-semibold text-white mt-6">3. DMCA Notification Requirements</h2>
            <p>
              To be effective, your notification must include the following:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf.</li>
              <li>Identification of the copyrighted work claimed to have been infringed.</li>
              <li>Identification of the material that is claimed to be infringing and where it is located on our service.</li>
              <li>Your contact information, including your address, telephone number, and email address.</li>
              <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or law.</li>
              <li>A statement, made under penalty of perjury, that the above information is accurate and that you are the copyright owner or are authorized to act on behalf of the owner.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-white mt-6">4. Contact for DMCA Notices</h2>
            <p>
              Please send any DMCA notices to our designated agent through our contact page.
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

export default DmcaPage;
