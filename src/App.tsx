
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, lazy, Suspense } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import BackToTop from "@/components/BackToTop";

// Use React.lazy for code splitting
const Home = lazy(() => import("@/pages/Home"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogDetail = lazy(() => import("@/pages/BlogDetail"));
const Events = lazy(() => import("@/pages/Events"));
const EventDetail = lazy(() => import("@/pages/EventDetail"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Projects = lazy(() => import("@/pages/Projects"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));

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
    
    /* Parallax and scroll effects */
    .parallax {
      background-attachment: fixed;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }
    
    /* Improved animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translate3d(0, 30px, 0);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    
    @keyframes spin-slow {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    .animation-reverse {
      animation-direction: reverse;
    }
    
    .animate-spin-slow {
      animation: spin-slow 8s linear infinite;
    }
    
    /* Glass morphism effects */
    .glass {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .dark .glass {
      background: rgba(30, 30, 30, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    /* Text gradient */
    .text-gradient-primary {
      background: linear-gradient(90deg, #ff7a00, #ff5500);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `;
  document.head.appendChild(style);
};

// Add SEO meta tags
const addSeoMetaTags = () => {
  const metaTags = [
    { name: 'description', content: 'Tek Talent Africa - A vibrant community of tech enthusiasts, developers and innovators building the future of technology in Africa.' },
    { name: 'keywords', content: 'tech, africa, community, developers, innovation, coding, programming, events, blog, projects' },
    { name: 'author', content: 'Tek Talent Africa' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { property: 'og:title', content: 'Tek Talent Africa Community' },
    { property: 'og:description', content: 'A vibrant community of tech enthusiasts, developers and innovators building the future of technology in Africa.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://tektalent.africa' },
    { property: 'og:image', content: 'public/uploads/tektalentlogo.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Tek Talent Africa Community' },
    { name: 'twitter:description', content: 'A vibrant community of tech enthusiasts, developers and innovators building the future of technology in Africa.' },
    { name: 'twitter:image', content: 'public/uploads/tektalentlogo.png' },
  ];
  
  metaTags.forEach(tag => {
    const meta = document.createElement('meta');
    Object.keys(tag).forEach(key => {
      meta.setAttribute(key, tag[key]);
    });
    document.head.appendChild(meta);
  });
  
  // Add canonical link
  const canonical = document.createElement('link');
  canonical.rel = 'canonical';
  canonical.href = window.location.href;
  document.head.appendChild(canonical);
};

// RouteChangeTracker for page transitions
const RouteChangeHandler = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return loading ? <PageLoader /> : null;
};

const App = () => {
  useEffect(() => {
    addAnimationStyles();
    addSeoMetaTags();
    
    // Add lazy loading for images to improve performance
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        img.setAttribute('loading', 'lazy');
      });
    }
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
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogDetail />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:slug" element={<EventDetail />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:slug" element={<ProjectDetail />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
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
