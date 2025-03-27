
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-6xl font-bold text-gradient">404</h1>
          <p className="mt-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <a 
            href="/" 
            className="mt-8 inline-flex items-center rounded-full bg-primary px-6 py-3 text-base font-medium text-white shadow-lg transition-all hover:shadow-xl hover:translate-y-[-2px]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
