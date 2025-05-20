
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-aura-dark text-white">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default MainLayout;
