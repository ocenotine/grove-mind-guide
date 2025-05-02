
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/ProjectCard";
import { getMarkdownFiles, getCategories, getTags, searchFiles } from "@/utils/markdownLoader";
import { Search, Filter } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Helmet } from "react-helmet";
import PageLoader from "@/components/PageLoader";

const Projects = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [tags, setTags] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await getMarkdownFiles('projects');
        setProjects(projectsData);
        setFilteredProjects(projectsData);
        setCategories(getCategories(projectsData));
        setTags(getTags(projectsData));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let result = [...projects];
    
    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(project => 
        project.frontmatter.category === selectedCategory
      );
    }
    
    // Filter by tag
    if (selectedTag !== 'All') {
      result = result.filter(project => 
        project.frontmatter.tags?.includes(selectedTag)
      );
    }
    
    // Search
    if (searchQuery) {
      result = searchFiles(result, searchQuery);
    }
    
    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.frontmatter.date || '').getTime() - 
               new Date(a.frontmatter.date || '').getTime();
      } else if (sortBy === 'title') {
        return a.frontmatter.title.localeCompare(b.frontmatter.title);
      } else if (sortBy === 'category') {
        return (a.frontmatter.category || '').localeCompare(b.frontmatter.category || '');
      }
      return 0;
    });
    
    setFilteredProjects(result);
  }, [projects, selectedCategory, selectedTag, searchQuery, sortBy]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <Helmet>
        <title>Projects | Tek Talent Africa</title>
        <meta name="description" content="Explore the innovative projects created by Tek Talent Africa community members." />
        <meta property="og:title" content="Projects | Tek Talent Africa" />
        <meta property="og:description" content="Explore the innovative projects created by Tek Talent Africa community members." />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
              Our <span className="text-tekOrange">Projects</span>
            </h1>
            <div className="w-24 h-1 bg-tekOrange mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore innovative projects developed by our community members addressing real-world challenges across Africa.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-tekOrange focus:border-tekOrange bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                variant="outline"
                className="border-tekOrange text-tekOrange hover:bg-tekOrange/10 flex items-center gap-2"
              >
                <Filter size={16} />
                Filters
              </Button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 py-2 px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-tekOrange focus:border-tekOrange"
              >
                <option value="date">Newest First</option>
                <option value="title">Title (A-Z)</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>
          
          {isFiltersOpen && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 animate-fade-in">
              <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">Filter Projects</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1.5 rounded-full text-sm ${
                          selectedCategory === category
                            ? "bg-tekOrange text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-sm ${
                          selectedTag === tag
                            ? "bg-tekOrange text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedTag('All');
                    setSearchQuery('');
                  }}
                  variant="outline"
                  className="mr-2"
                >
                  Reset Filters
                </Button>
                <Button
                  onClick={() => setIsFiltersOpen(false)}
                  className="bg-tekOrange hover:bg-orange-600 text-white"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
          
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.slug}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProjectCard
                    title={project.frontmatter.title}
                    description={project.frontmatter.description}
                    image={project.frontmatter.image || "/uploads/tektalentlogo.png"}
                    tags={project.frontmatter.tags || []}
                    slug={project.slug}
                    status={project.frontmatter.status}
                    category={project.frontmatter.category}
                    link={`/projects/${project.slug}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">No projects found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedTag('All');
                  setSearchQuery('');
                }}
                className="bg-tekOrange hover:bg-orange-600 text-white"
              >
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Projects;
