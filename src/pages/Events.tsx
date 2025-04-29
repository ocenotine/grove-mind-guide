
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMarkdownFiles, isUpcomingEvent, MarkdownFile } from "@/utils/markdownLoader";
import EventCard from "@/components/EventCard";
import { Calendar, ChevronRight } from "lucide-react";
import SkeletonCard from "@/components/SkeletonCard";
import { useToast } from "@/components/ui/use-toast";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import AnimatedSection from "@/components/AnimatedSection";
import PageLoader from "@/components/PageLoader";

const Events = () => {
  const [events, setEvents] = useState<MarkdownFile[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<MarkdownFile[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<MarkdownFile[]>([]);
  const [pastEvents, setPastEvents] = useState<MarkdownFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEvents = await getMarkdownFiles('content/events');
        
        // Sort by date (newest first)
        const sortedEvents = allEvents.sort((a, b) => 
          new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
        );
        
        // Filter for upcoming and past events
        const upcoming = sortedEvents.filter(event => isUpcomingEvent(event.frontmatter.date));
        const past = sortedEvents.filter(event => !isUpcomingEvent(event.frontmatter.date));
        
        // Featured events (either upcoming or most recent past events)
        const featured = upcoming.length > 0 ? 
          upcoming.slice(0, 3) : 
          sortedEvents.slice(0, 3);
        
        setEvents(sortedEvents);
        setFeaturedEvents(featured);
        setUpcomingEvents(upcoming);
        setPastEvents(past);
        
        setLoading(false);
        
        // Simulate page loading for smoother transitions
        setTimeout(() => setPageLoading(false), 800);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          title: "Error",
          description: "Failed to load events. Please try again later.",
          variant: "destructive"
        });
        setLoading(false);
        setPageLoading(false);
      }
    };
    
    fetchEvents();
  }, [toast]);
  
  const renderSkeleton = (count: number = 3) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
  
  const renderEventList = (eventList: MarkdownFile[]) => {
    if (eventList.length === 0) {
      return (
        <AnimatedSection animation="fade-in" delay={300} className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No events found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Check back later for upcoming events
          </p>
        </AnimatedSection>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventList.map((event, index) => (
          <AnimatedSection 
            key={event.slug} 
            animation="slide-up" 
            delay={index * 100} 
            className="h-full"
          >
            <EventCard 
              image={event.frontmatter.image || "public/uploads/tektalentlogo.png"}
              title={event.frontmatter.title}
              date={event.frontmatter.date}
              summary={event.frontmatter.description} 
              location={event.frontmatter.location}
              slug={event.slug}
              className="h-full"
            />
          </AnimatedSection>
        ))}
      </div>
    );
  };
  
  if (pageLoading) {
    return <PageLoader />;
  }
  
  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <AnimatedSection animation="fade-in" className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
            Community <span className="text-tekOrange">Events</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Join us for workshops, meetups, hackathons, and other tech events happening in our community.
          </p>
        </AnimatedSection>
        
        {/* Featured Events Carousel */}
        <AnimatedSection animation="slide-up" delay={200} className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Featured Events</h2>
            <Link to="/events">
              <Button variant="link" className="text-tekOrange hover:text-orange-600 gap-1">
                View all <ChevronRight size={16} />
              </Button>
            </Link>
          </div>
          
          {loading ? (
            renderSkeleton(3)
          ) : featuredEvents.length > 0 ? (
            <Carousel
              opts={{
                align: "start",
                loop: featuredEvents.length > 3
              }}
              className="w-full"
            >
              <CarouselContent>
                {featuredEvents.map((event) => (
                  <CarouselItem key={event.slug} className="md:basis-1/2 lg:basis-1/3 p-1">
                    <EventCard
                      image={event.frontmatter.image || "public/uploads/tektalentlogo.png"}
                      title={event.frontmatter.title}
                      date={event.frontmatter.date}
                      summary={event.frontmatter.description} 
                      location={event.frontmatter.location}
                      slug={event.slug}
                      className="h-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-end gap-2 mt-4">
                <CarouselPrevious className="static translate-y-0 w-10 h-10" />
                <CarouselNext className="static translate-y-0 w-10 h-10" />
              </div>
            </Carousel>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No featured events at the moment</p>
            </div>
          )}
        </AnimatedSection>
        
        {/* Events Tabs */}
        <AnimatedSection animation="slide-up" delay={400} className="bg-white/60 dark:bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl shadow-sm">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
              <TabsTrigger value="upcoming" className="text-base">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past" className="text-base">Past Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-4">
              {loading ? renderSkeleton(6) : renderEventList(upcomingEvents)}
            </TabsContent>
            
            <TabsContent value="past" className="mt-4">
              {loading ? renderSkeleton(6) : renderEventList(pastEvents)}
            </TabsContent>
          </Tabs>
        </AnimatedSection>

        {/* Call to Action */}
        <AnimatedSection animation="fade-in" delay={600} className="mt-16 bg-gradient-to-r from-tekOrange to-orange-600 text-white rounded-xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to join our next event?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Don't miss out on upcoming workshops, meetups and hackathons. Join our community and be part of the tech revolution in Africa.
          </p>
          <Button
            className="bg-white text-tekOrange hover:bg-gray-100 px-8 py-6 text-lg"
            onClick={() => {
              toast({
                title: "Success!",
                description: "You'll be notified about upcoming events",
              });
            }}
          >
            Get Notified
          </Button>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Events;
