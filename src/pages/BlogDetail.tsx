
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BlogPost from "@/components/BlogPost";
import { getMarkdownFiles, MarkdownFile } from "@/utils/markdownLoader";
import { ArrowLeft, Calendar, User, Tag, MessageSquare, ThumbsUp, Share2 } from "lucide-react";
import SkeletonCard from "@/components/SkeletonCard";
import { useToast } from "@/components/ui/use-toast";
import AnimatedSection from "@/components/AnimatedSection";
import PageLoader from "@/components/PageLoader";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [post, setPost] = useState<MarkdownFile | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<MarkdownFile[]>([]);
  const [liked, setLiked] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Get static posts data
        const posts = await getMarkdownFiles('content/blog');
        
        const foundPost = posts.find(p => p.slug === slug);
        if (foundPost) {
          setPost(foundPost);
          
          // Find related posts with same category or tags if available
          const sameCategoryPosts = posts.filter(p => 
            p.slug !== slug && 
            p.frontmatter.category === foundPost.frontmatter.category
          ).slice(0, 3);
          
          setRelatedPosts(sameCategoryPosts);
        }
        setLoading(false);
        
        // Simulate page loading for smoother transitions
        setTimeout(() => setPageLoading(false), 700);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setLoading(false);
        setPageLoading(false);
      }
    };
    
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.frontmatter.title || "Tek Talent Blog",
        text: post?.frontmatter.description || "Check out this blog post!",
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Blog post link copied to clipboard",
      });
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    toast({
      title: liked ? "You unliked this post" : "You liked this post",
      description: liked ? "Your preference has been updated" : "Thanks for your feedback!",
    });
  };

  if (pageLoading) {
    return <PageLoader />;
  }
  
  if (loading) {
    return (
      <div className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <SkeletonCard className="max-w-4xl mx-auto h-[80vh]" />
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="pt-20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
          <Button onClick={() => navigate('/blog')} className="bg-tekOrange hover:bg-orange-600 text-white">
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-20">
      <div className="container mx-auto px-4 py-16">
        <AnimatedSection animation="fade-in">
          <Button 
            variant="outline" 
            className="mb-6 border-tekOrange text-tekOrange dark:text-orange-300"
            onClick={() => navigate('/blog')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </AnimatedSection>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              {/* Featured Image */}
              <AnimatedSection animation="slide-up" delay={100} className="mb-8 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={post.frontmatter.image || "public/uploads/tektalentlogo.png"} 
                  alt={post.frontmatter.title} 
                  className="w-full h-64 md:h-96 object-cover hover:scale-105 transition-all duration-1000"
                />
              </AnimatedSection>
              
              <AnimatedSection animation="fade-in" delay={200} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg mb-8">
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 bg-tekOrange/10 dark:bg-tekOrange/20 text-tekOrange dark:text-orange-300 rounded-full text-sm font-medium">
                    {post.frontmatter.category || "General"}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
                  {post.frontmatter.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <span>{post.frontmatter.date}</span>
                  </div>
                  <div className="flex items-center">
                    <User size={16} className="mr-2" />
                    <span>{post.frontmatter.author || "Tek Talent Africa"}</span>
                  </div>
                </div>
                
                <BlogPost
                  title={post.frontmatter.title}
                  date={post.frontmatter.date}
                  author={post.frontmatter.author || "Tek Talent Africa"}
                  summary={post.frontmatter.description}
                  image={post.frontmatter.image || "public/uploads/tektalentlogo.png"}
                  category={post.frontmatter.category || "General"}
                  slug={post.slug}
                  content={post.content}
                  showContent={true}
                />
                
                {/* Tags */}
                {post.frontmatter.tags && Array.isArray(post.frontmatter.tags) && (
                  <div className="mt-8 flex flex-wrap gap-2">
                    <Tag size={16} className="mr-1 text-gray-600 dark:text-gray-400" />
                    {post.frontmatter.tags.map((tag: string) => (
                      <span 
                        key={tag}
                        className="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </AnimatedSection>
              
              {/* Social interactions */}
              <AnimatedSection animation="slide-up" delay={300} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg flex justify-between items-center mb-8">
                <div className="flex gap-4">
                  <Button 
                    variant="ghost"
                    className={`flex items-center gap-2 ${liked ? 'text-tekOrange' : ''}`}
                    onClick={handleLike}
                  >
                    <ThumbsUp size={20} className={liked ? "fill-tekOrange" : ""} />
                    Like
                  </Button>
                  <Button 
                    variant="ghost"
                    className="flex items-center gap-2"
                    onClick={() => {
                      document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <MessageSquare size={20} />
                    Comment
                  </Button>
                </div>
                <Button 
                  variant="ghost"
                  className="flex items-center gap-2"
                  onClick={handleShare}
                >
                  <Share2 size={20} />
                  Share
                </Button>
              </AnimatedSection>
              
              {/* Comments section */}
              <AnimatedSection animation="fade-in" delay={400} id="comments" className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Comments</h3>
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden flex-shrink-0"></div>
                  <div className="flex-grow">
                    <textarea 
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-tekOrange dark:bg-gray-700 dark:text-white"
                      placeholder="Write a comment..."
                      rows={3}
                    ></textarea>
                    <Button className="mt-2 bg-tekOrange hover:bg-orange-600 text-white">
                      Post Comment
                    </Button>
                  </div>
                </div>
                
                <div className="text-center text-gray-600 dark:text-gray-400">
                  <p>Be the first to comment on this post!</p>
                </div>
              </AnimatedSection>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-4">
              {/* Author info */}
              <AnimatedSection animation="slide-up" delay={300} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">About the Author</h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden mr-4"></div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">{post.frontmatter.author || "Tek Talent Africa"}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Community Contributor</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  A passionate tech enthusiast contributing to the growth of the African tech ecosystem through insightful content and community engagement.
                </p>
              </AnimatedSection>
              
              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <AnimatedSection animation="slide-up" delay={400} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPosts.map(relatedPost => (
                      <div key={relatedPost.slug} className="flex gap-3">
                        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={relatedPost.frontmatter.image || "public/uploads/tektalentlogo.png"} 
                            alt={relatedPost.frontmatter.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium hover:text-tekOrange transition-colors line-clamp-2">
                            <a href={`/blog/${relatedPost.slug}`}>{relatedPost.frontmatter.title}</a>
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{relatedPost.frontmatter.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-6 border-tekOrange text-tekOrange hover:bg-tekOrange/10"
                    onClick={() => navigate('/blog')}
                  >
                    View All Posts
                  </Button>
                </AnimatedSection>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
