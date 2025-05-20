
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "We've received your message and will get back to you soon.",
      });
      setName('');
      setEmail('');
      setMessage('');
      setSubmitting(false);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="auraluxx-container py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Contact Us</h1>
          
          <div className="glass-card p-6 mb-8">
            <p className="text-white/80 mb-6">
              Have a question, concern, or just want to reach out? Fill out the form below and we'll get back to you as soon as possible.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border-white/10"
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[120px]"
                  placeholder="What would you like to tell us?"
                  required
                />
              </div>
              
              <Button 
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 bg-gradient"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
          
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Important Notice</h2>
            <p className="text-white/80">
              Auraluxx does not host, store, or upload any video or media content on its servers. All content available through our service is hosted on and streamed from third-party services that are publicly available across the internet.
            </p>
            <p className="text-white/80 mt-4">
              We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA). If you believe your copyrighted work has been improperly linked through our service, please contact us with the required information outlined in our DMCA Policy.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
