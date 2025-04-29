
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Events from "@/pages/Events";
import EventDetail from "@/pages/EventDetail";
import NotFound from "@/pages/NotFound";
import BackToTop from "@/components/BackToTop";
import PageLoader from "@/components/PageLoader";
import Projects from "@/pages/Projects";

const queryClient = new QueryClient();

// Add animation styles to index.css
const addAnimationStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes bounceSubtle {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    
    .animate-bounce-subtle {
      animation: bounceSubtle 1.5s ease-in-out infinite;
    }
    
    .animation-delay-150 {
      animation-delay: 150ms;
    }
    
    .carousel-container {
      overflow: hidden;
      width: 100%;
    }
    
    .carousel-track {
      display: flex;
      animation-duration: 30s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      width: max-content;
      overflow: hidden;
    }
    
    .carousel-track-right {
      animation-name: scroll-right;
    }
    
    .carousel-track-left {
      animation-name: scroll-left;
    }
    
    @keyframes scroll-right {
      0% { transform: translateX(0); }
      100% { transform: translateX(calc(-100% / 2)); }
    }
    
    @keyframes scroll-left {
      0% { transform: translateX(calc(-100% / 2)); }
      100% { transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);
};

// RouteChangeTracker for page transitions
const RouteChangeHandler = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return loading ? <PageLoader /> : null;
};

const App = () => {
  useEffect(() => {
    addAnimationStyles();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <RouteChangeHandler />
          <div className="flex flex-col min-h-screen dark:bg-gray-900">
            <NavBar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:slug" element={<EventDetail />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <BackToTop />
          </div>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
