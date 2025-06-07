
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: Page not found:", location.pathname);
  }, [location]);

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
        <div className="text-center px-4">
          <div className="animate-scale-in">
            <h1 className="text-6xl font-bold mb-6 text-gradient">404</h1>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <p className="text-2xl text-white mb-8">Oops! Page not found</p>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <p className="text-lg text-white/70 mb-4">
              The page <span className="text-aura-accent font-mono">{location.pathname}</span> could not be found.
            </p>
            <p className="text-md text-white/70 mb-10">
              The page you are looking for might have been removed, had its name changed,
              or is temporarily unavailable.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <Button asChild size="lg" className="bg-aura-purple hover:bg-aura-purple/90 hover-scale">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => window.history.back()}
              className="hover-scale"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
