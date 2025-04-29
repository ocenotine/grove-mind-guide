
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/ProjectCard";
import SuggestProjectForm from "@/components/SuggestProjectForm";
import SkeletonCard from "@/components/SkeletonCard";
import { getProjects, type Project } from "@/utils/projectLoader";
import { useToast } from "@/components/ui/use-toast";
import AnimatedSection from "@/components/AnimatedSection";
import PageLoader from "@/components/PageLoader";

const Projects = () => {
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const whatsappLink = "https://chat.whatsapp.com/EFuw7WPQzTjKswuvJQX2n3";
  const { toast } = useToast();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const projectData = getProjects();
      setProjects(projectData);
      
      // Extract unique categories
      const uniqueCategories = ["All", ...new Set(projectData.map(p => p.category || "Uncategorized"))];
      setCategories(uniqueCategories);
      
      setLoading(false);
      
      // Simulate page loading for smoother transitions
      setTimeout(() => setPageLoading(false), 800);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);
  
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">Our Projects</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Explore the innovative projects being developed by our community members. Join us in building
              technology solutions that benefit our community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <SuggestProjectForm 
                trigger={
                  <Button className="bg-tekOrange hover:bg-orange-600 text-white">
                    Suggest a Project
                  </Button>
                }
              />
              <Button 
                variant="outline" 
                className="border-tekOrange text-tekOrange hover:bg-tekOrange/10"
                onClick={() => window.open(whatsappLink, '_blank')}
              >
                Join Our Community
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>
      
      {/* Category Filter */}
      <AnimatedSection animation="slide-up" delay={200} className="py-8 bg-white dark:bg-gray-900 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 overflow-x-auto">
          <div className="flex gap-3 pb-2">
            {categories.map(category => (
              <Button 
                key={category} 
                variant={activeCategory === category ? "default" : "outline"}
                className={activeCategory === category 
                  ? "bg-tekOrange hover:bg-orange-600 text-white whitespace-nowrap" 
                  : "border-tekOrange text-tekOrange dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-tekOrange/20 whitespace-nowrap"}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </AnimatedSection>
      
      {/* Projects Display Section */}
      <AnimatedSection animation="fade-in" delay={300} className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-gray-800 dark:text-white">
            {activeCategory === "All" ? "Featured Projects" : activeCategory + " Projects"}
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(3).fill(0).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <AnimatedSection 
                  key={project.id} 
                  animation="slide-up" 
                  delay={400 + index * 100} 
                  className="h-full"
                >
                  <ProjectCard 
                    project={project} 
                  />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection animation="fade-in" delay={400} className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No projects found in this category.</p>
              <Button 
                className="mt-4 bg-tekOrange hover:bg-orange-600 text-white"
                onClick={() => setActiveCategory("All")}
              >
                View All Projects
              </Button>
            </AnimatedSection>
          )}
        </div>
      </AnimatedSection>
      
      {/* Call to Action */}
      <AnimatedSection animation="slide-up" delay={500} className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Have a Project Idea?</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            We're always looking for innovative project ideas to support our community's growth.
            If you have an idea for a project, we'd love to hear from you!
          </p>
          <SuggestProjectForm 
            trigger={
              <Button className="bg-tekOrange hover:bg-orange-600 text-white transform transition-all duration-300 hover:scale-105">
                Submit Your Idea
              </Button>
            }
          />
        </div>
      </AnimatedSection>
      
      {/* Project Showcase */}
      <AnimatedSection animation="fade-in" delay={600} className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-tekOrange/10 to-orange-100 dark:from-tekOrange/5 dark:to-gray-800 p-8 md:p-12 rounded-2xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">Community Impact Projects</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Our projects focus on solving real problems in the African tech ecosystem. From educational resources to innovative applications, we're building technology that makes a difference.
                </p>
                <Button 
                  className="bg-tekOrange hover:bg-orange-600 text-white"
                  onClick={() => {
                    toast({
                      title: "Projects Gallery",
                      description: "This feature will be available soon!",
                    });
                  }}
                >
                  View Project Gallery
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden shadow-md transform transition-all duration-300 hover:scale-105">
                  <img 
                    src="public/images/tek-talent-meetup-1.jpeg" 
                    alt="Project showcase" 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md transform transition-all duration-300 hover:scale-105">
                  <img 
                    src="public/images/tek-talent-meetup-2.jpeg" 
                    alt="Project showcase" 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md transform transition-all duration-300 hover:scale-105">
                  <img 
                    src="public/images/tek-talent-meetup-3.jpeg" 
                    alt="Project showcase" 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md transform transition-all duration-300 hover:scale-105">
                  <img 
                    src="public/images/tek-talent-soroti.jpeg" 
                    alt="Project showcase" 
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Projects;
