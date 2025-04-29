
import React from "react";
import { Calendar, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface BlogPostProps {
  title: string;
  date: string;
  author: string;
  summary: string;
  image: string;
  category: string;
  slug: string;
  content?: string;
  showContent?: boolean;
  tags?: string[];
  className?: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ 
  title, 
  date, 
  author, 
  summary, 
  image, 
  category, 
  slug,
  content,
  showContent = false,
  tags,
  className
}) => {
  // Format date nicely
  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString; // Fallback to raw date string if parsing fails
    }
  };
  
  return (
    <Card className={cn(
      "bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full", 
      className
    )}>
      {/* Image container with overlay effect */}
      <div className="relative overflow-hidden group h-48">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" 
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-60 group-hover:opacity-70 transition-opacity"></div>
        
        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-tekOrange hover:bg-orange-600 shadow-md">
            {category}
          </Badge>
        </div>
        
        {/* Date badge */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="outline" className="bg-black/50 text-white border-white/20 backdrop-blur-sm">
            <Calendar size={12} className="mr-1" />
            {formatDate(date)}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardDescription className="text-sm flex items-center text-gray-500 dark:text-gray-400">
            <User size={14} className="mr-1" />
            <span>{author}</span>
          </CardDescription>
        </div>
        <CardTitle className="text-xl font-semibold line-clamp-2 hover:text-tekOrange transition-colors">
          <a href={`/blog/${slug}`} className="before:absolute before:inset-0 relative">{title}</a>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 h-full flex flex-col">
        {!showContent ? (
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{summary}</p>
        ) : (
          <div className="mt-4">
            <MarkdownRenderer content={content || ''} />
            
            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                <Tag size={16} className="text-gray-500" />
                {tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-tekOrange/10">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {!showContent && (
        <CardFooter className="pt-0 mt-auto">
          <Button 
            variant="outline" 
            className="border-tekOrange text-tekOrange dark:text-orange-300 hover:bg-tekOrange hover:text-white dark:hover:bg-tekOrange dark:hover:text-white transition-all relative overflow-hidden group"
          >
            <a href={`/blog/${slug}`} className="flex items-center">
              <span className="relative z-10">Read More</span>
              <span className="absolute inset-0 w-full h-full bg-tekOrange transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform"></span>
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default BlogPost;
