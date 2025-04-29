
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import SkeletonCard from "@/components/SkeletonCard";
import { getMarkdownFiles, MarkdownFile } from "@/utils/markdownLoader";
import BlogPost from "@/components/BlogPost";
import { useToast } from "@/components/ui/use-toast";
import AnimatedSection from "@/components/AnimatedSection";
import PageLoader from "@/components/PageLoader";

const categories = ["All", "Technology", "Community", "Education", "Social Impact"];

const Blog = () => {
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [blogPosts, setBlogPosts] = useState<MarkdownFile[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<MarkdownFile[]>([]);
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getMarkdownFiles('content/blog');
        
        setBlogPosts(posts);
        setFilteredPosts(posts);
        setLoading(false);
        
        // Simulate page loading for smoother transitions
        setTimeout(() => setPageLoading(false), 800);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        toast({
          title: "Error loading blog posts",
          description: "Please try again later",
          variant: "destructive"
        });
        setLoading(false);
        setPageLoading(false);
      }
    };
    
    fetchPosts();
  }, [toast]);
  
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredPosts(blogPosts);
    } else {
      setFilteredPosts(blogPosts.filter(post => post.frontmatter.category === selectedCategory));
    }
  }, [selectedCategory, blogPosts]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Subscription successful!",
      description: "Thank you for subscribing to our newsletter",
    });
    setEmail("");
  };
  
  if (pageLoading) {
    return <PageLoader />;
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <AnimatedSection animation="fade-in" className="bg-gradient-to-r from-tekOrange/10 to-orange-100 dark:from-tekOrange/5 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">Our Blog</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Insights, stories and knowledge from our community members. Stay updated with the 
              latest trends, tutorials and discussions in the tech world.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Category Filter */}
      <AnimatedSection animation="slide-up" delay={200} className="py-8 bg-white dark:bg-gray-900 border-b dark:border-gray-700 sticky top-16 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map(category => (
              <Button 
                key={category} 
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category 
                  ? "bg-tekOrange hover:bg-orange-600 text-white" 
                  : "border-tekOrange text-tekOrange dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-tekOrange/20"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Blog Posts */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array(6).fill(0).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : (
              filteredPosts.map((post, index) => (
                <AnimatedSection 
                  key={post.slug} 
                  animation="slide-up" 
                  delay={index * 100} 
                  className="h-full"
                >
                  <BlogPost
                    title={post.frontmatter.title}
                    date={post.frontmatter.date}
                    author={post.frontmatter.author || "Tek Talent Africa"}
                    summary={post.frontmatter.description}
                    image={post.frontmatter.image || "public/uploads/tektalentlogo.png"}
                    category={post.frontmatter.category || "General"}
                    slug={post.slug}
                  />
                </AnimatedSection>
              ))
            )}
          </div>
          
          {filteredPosts.length > 0 && filteredPosts.length >= 6 && (
            <AnimatedSection animation="fade-in" delay={800} className="mt-12 text-center">
              <Button 
                variant="outline" 
                className="border-tekOrange text-tekOrange dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-tekOrange/20"
                onClick={() => {
                  toast({
                    title: "Loading more posts",
                    description: "This feature will be available soon.",
                  });
                }}
              >
                Load More
              </Button>
            </AnimatedSection>
          )}
          
          {filteredPosts.length === 0 && !loading && (
            <AnimatedSection animation="fade-in" delay={300} className="text-center py-10">
              <p className="text-lg text-gray-600 dark:text-gray-400">No posts found in this category.</p>
              <Button 
                className="mt-4 bg-tekOrange hover:bg-orange-600 text-white"
                onClick={() => setSelectedCategory("All")}
              >
                View All Posts
              </Button>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Newsletter Subscription */}
      <AnimatedSection animation="slide-up" delay={400} className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-700 rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
              Get the latest blog posts and updates delivered directly to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:border-tekOrange"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="bg-tekOrange hover:bg-orange-600 text-white">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};
 
export default Blog;
