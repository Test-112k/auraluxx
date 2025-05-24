
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // More detailed error logging for debugging purposes
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
      "\nFull location object:",
      JSON.stringify({
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
        state: location.state
      })
    );
  }, [location]);

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold mb-6 text-aura-purple">404</h1>
          <p className="text-2xl text-white mb-8">Oops! Page not found</p>
          <p className="text-lg text-white/70 mb-4">
            The page <span className="text-aura-accent font-mono">{location.pathname}</span> could not be found.
          </p>
          <p className="text-md text-white/70 mb-10">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-aura-purple hover:bg-aura-purple/90">
              <Link to="/">Return to Home</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a onClick={() => window.history.back()}>Go Back</a>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
