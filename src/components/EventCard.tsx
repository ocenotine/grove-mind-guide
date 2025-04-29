
import React from "react";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EventCardProps {
  image: string;
  title: string;
  date: string;
  summary: string;
  className?: string;
  slug: string;
  location?: string;
  content?: string;
  showContent?: boolean;
  category?: string;
  attendees?: string;
}

const EventCard: React.FC<EventCardProps> = ({ 
  image, 
  title, 
  date, 
  summary, 
  className = "",
  slug,
  location,
  content,
  showContent = false,
  category,
  attendees
}) => {
  // Format date nicely
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    
    try {
      // Check if the date includes time information
      const hasTime = dateString.includes(':');
      if (!hasTime) {
        // If no time, use only date formatting
        options.hour = undefined;
        options.minute = undefined;
      }
      
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString; // Fallback to raw date string if parsing fails
    }
  };
  
  // Check if event is upcoming
  const isUpcoming = () => {
    try {
      const eventDate = new Date(date);
      const currentDate = new Date();
      return eventDate >= currentDate;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className={cn(
      "rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300",
      className
    )}>
      <div className="relative">
        {/* Event image */}
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" 
          loading="lazy"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent"></div>
        
        {/* Category badge */}
        {category && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-tekOrange hover:bg-orange-600">
              {category}
            </Badge>
          </div>
        )}
        
        {/* Upcoming badge */}
        {isUpcoming() && (
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className="bg-green-500/90 text-white border-green-500 hover:bg-green-600 hover:border-green-600">
              Upcoming
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-5">
        {/* Event title */}
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white hover:text-tekOrange transition-colors line-clamp-2">
          <a href={`/events/${slug}`}>{title}</a>
        </h3>
        
        {/* Event metadata */}
        <div className="flex flex-col gap-2 mb-3 text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar size={16} className="mr-2 text-tekOrange" />
            <span className="text-sm">{formatDate(date)}</span>
          </div>
          
          {location && (
            <div className="flex items-center">
              <MapPin size={16} className="mr-2 text-tekOrange" />
              <span className="text-sm">{location}</span>
            </div>
          )}
          
          {attendees && (
            <div className="flex items-center">
              <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                {attendees} attendees
              </span>
            </div>
          )}
        </div>
        
        {!showContent ? (
          <>
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{summary}</p>
            
            <Button 
              variant="outline" 
              className="border-tekOrange text-tekOrange hover:bg-tekOrange hover:text-white transition-colors dark:text-orange-300 dark:hover:text-white group relative overflow-hidden"
            >
              <a href={`/events/${slug}`} className="flex items-center">
                <span className="relative z-10">Read More</span>
                <span className="absolute inset-0 w-full h-full bg-tekOrange transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform"></span>
              </a>
            </Button>
          </>
        ) : (
          <div className="mt-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6">
            <MarkdownRenderer content={content || ''} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
