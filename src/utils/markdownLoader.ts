
import matter from 'gray-matter';

export interface MarkdownFile {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    description: string;
    slug?: string;
    author?: string;
    image?: string;
    category?: string;
    location?: string;
    tags?: string[];
    featured?: boolean;
    [key: string]: any;
  };
  content: string;
}

// Simulating markdown file loading
// In a real project, this would use fs or a data fetching method
export async function getMarkdownFiles(directory: string): Promise<MarkdownFile[]> {
  console.log(`Getting markdown files from ${directory}`);
  
  // Based on the directory, it should return the appropriate static data
  if (directory.includes('blog')) {
    return getStaticMarkdownFiles('blog');
  } else if (directory.includes('events')) {
    return getStaticMarkdownFiles('events');
  } else if (directory.includes('projects')) {
    return getStaticMarkdownFiles('projects');
  }
  
  return [];
}

export function getStaticMarkdownFiles(type: 'blog' | 'events' | 'projects'): MarkdownFile[] {
  // Sample data to match the markdown files
  if (type === 'blog') {
    return [
      {
        slug: 'test-of-the-blog',
        frontmatter: {
          title: "Test of the blog",
          date: "2025-04-17",
          description: "This is a test of the blogging system.",
          author: "TekTalent Team",
          image: "/public/images/tek-talent-meetup-1.jpeg",
          category: "Technology",
          tags: ["react", "javascript", "web development"],
          featured: true
        },
        content: `# Blog System Guide

## Frontmatter
The frontmatter contains essential metadata about the blog post:
- title: The main title of the post
- date: Publication date
- description: A brief summary of the post
- author: The writer's name
- image: Path to the featured image
- category: Post categorization
- slug: URL-friendly identifier
- tags: Related keywords

## Content
The main content is written in Markdown format, which supports:
- Headers
- Lists
- Links
- Images
- Code blocks
- And more...

## Technical Implementation
The system uses:
- TypeScript for type safety
- Gray-matter for parsing markdown files
- Static file generation for optimal performance

## How to Create a New Post
1. Create a new markdown file
2. Add frontmatter with required metadata
3. Write content in markdown format
4. Save the file in the appropriate directory`
      },
      {
        slug: 'building-community',
        frontmatter: {
          title: "Building Tech Communities in Africa",
          date: "2025-04-15",
          description: "How Tek Talent is fostering tech communities across Africa.",
          author: "Sarah Kimani",
          image: "/public/images/tek-talent-meetup-2.jpeg",
          category: "Community",
          tags: ["community", "africa", "tech hub"],
          featured: true
        },
        content: `# Building Tech Communities in Africa

Africa's tech ecosystem is growing rapidly, with innovation hubs emerging across the continent. Tek Talent Africa is at the forefront of this movement, creating spaces for developers to learn, collaborate, and build solutions for local and global challenges.

## The Challenge

Despite the growing talent pool, many African developers still face:

- Limited access to high-quality education
- Few networking opportunities
- Gaps in mentorship
- Barriers to global markets

## Our Approach

Tek Talent Africa addresses these challenges through:

1. **Community-Driven Learning** - Peer-to-peer knowledge sharing
2. **Regular Meetups** - Creating spaces for connection
3. **Project Collaborations** - Building together to solve real problems
4. **Online Resources** - Making learning accessible to all

## Success Stories

Several communities started with just 5-10 members and have grown to hundreds of active participants. These communities have launched projects addressing local challenges from healthcare to education.

## Join the Movement

Whether you're a beginner or experienced developer, there's a place for you in our community. Together, we're building the future of tech in Africa.`
      },
      {
        slug: 'web-development-trends',
        frontmatter: {
          title: "Web Development Trends in 2025",
          date: "2025-04-10",
          description: "The latest trends shaping web development in 2025.",
          author: "Emmanuel Okafor",
          image: "/public/images/tek-talent-meetup-3.jpeg",
          category: "Technology",
          tags: ["web development", "trends", "technology"],
          featured: false
        },
        content: `# Web Development Trends in 2025

The web development landscape continues to evolve at a rapid pace. Here are the key trends we're seeing in 2025:

## 1. AI-Driven Development

AI tools are now an integral part of the development workflow:

- **Code Generation** - AI assistants can write boilerplate and even complex logic
- **Testing Automation** - Smarter testing that adapts to code changes
- **Design Systems** - AI that helps maintain consistency across large applications

## 2. WebAssembly Everywhere

WebAssembly has matured significantly:

- Running high-performance applications in browsers
- Enabling new classes of web applications like video editing and 3D modeling
- Cross-platform compatibility with near-native performance

## 3. Edge Computing

Computation continues to move closer to users:

- Serverless edge functions for reduced latency
- Global data replication
- Smart CDNs that do more than cache static assets

## 4. Sustainability Focus

Green coding practices are becoming standard:

- Energy-efficient algorithms
- Carbon-aware deployment strategies
- Tools that measure and optimize environmental impact

## 5. The Return to Server-Side

After years of client-heavy applications, we're seeing a renaissance of server-rendering:

- New frameworks that blend the best of both worlds
- Enhanced security through reduced client-side exposure
- Improved performance for users with less powerful devices

The most successful developers in 2025 are those who master both the fundamentals and stay adaptable to these rapidly evolving trends.`
      }
    ];
  } else if (type === 'events') {
    return [
      {
        slug: 'developer-conference-2025',
        frontmatter: {
          title: "Developer Conference 2025",
          date: "2025-07-15",
          description: "Join us for the biggest developer conference in East Africa.",
          location: "Nairobi, Kenya",
          image: "/public/images/tek-talent-meetup-1.jpeg",
          category: "Conference",
          attendees: "500+",
          featured: true
        },
        content: `# Developer Conference 2025

## Join Us in Nairobi!

We're excited to announce our annual Developer Conference, bringing together tech enthusiasts from across Africa to share knowledge, network, and build the future together.

## What to Expect

- **Keynote Speakers** from leading tech companies
- **Hands-on Workshops** covering the latest technologies
- **Project Showcases** from local innovators
- **Networking Sessions** with industry professionals

## Schedule

### Day 1: Workshops
- 9:00 AM - 10:30 AM: Web Development with React
- 11:00 AM - 12:30 PM: Building APIs with Node.js
- 2:00 PM - 3:30 PM: Mobile Development with Flutter
- 4:00 PM - 5:30 PM: Introduction to Machine Learning

### Day 2: Conference
- 9:00 AM - 10:00 AM: Opening Keynote
- 10:30 AM - 12:30 PM: Panel Discussion: The Future of Tech in Africa
- 2:00 PM - 4:00 PM: Lightning Talks
- 4:30 PM - 5:30 PM: Closing Keynote and Networking

## Registration

Early bird tickets are available until June 1st. Secure your spot today!`
      },
      {
        slug: 'hackathon-for-good',
        frontmatter: {
          title: "Hackathon for Good",
          date: "2025-06-02",
          description: "A 48-hour hackathon focused on solving local community challenges.",
          location: "Lagos, Nigeria",
          image: "/public/images/tek-talent-meetup-2.jpeg",
          category: "Hackathon",
          featured: true
        },
        content: `# Hackathon for Good

## 48 Hours to Change Lives

Tek Talent Africa presents our annual "Hackathon for Good" – a weekend of coding, collaboration, and creativity focused on solving real challenges facing African communities.

## Challenge Tracks

This year's hackathon will focus on three key areas:

1. **Healthcare Access** - Building solutions to improve access to healthcare information and services
2. **Educational Tools** - Creating resources to support learning in underserved communities
3. **Financial Inclusion** - Developing platforms to extend financial services to the unbanked

## Prizes

- 1st Place: $5,000 + 6 months of mentorship
- 2nd Place: $3,000 + 3 months of mentorship
- 3rd Place: $1,500 + 1 month of mentorship
- Community Choice: $1,000

## Schedule

### Friday
- 5:00 PM: Registration & Networking
- 6:30 PM: Opening Ceremony
- 7:00 PM: Challenge Announcement
- 8:00 PM: Team Formation
- 9:00 PM: Hacking Begins

### Saturday
- All Day: Hacking
- 10:00 AM, 2:00 PM, 6:00 PM: Mentor Sessions

### Sunday
- 12:00 PM: Hacking Ends
- 1:00 PM - 3:00 PM: Team Presentations
- 4:00 PM: Awards Ceremony

## Registration

Teams of 2-4 people can register. Individual participants are welcome and will have an opportunity to form teams on the first day.`
      },
      {
        slug: 'data-science-bootcamp',
        frontmatter: {
          title: "Data Science Bootcamp",
          date: "2025-09-10",
          description: "Intensive 3-day bootcamp on data science fundamentals.",
          location: "Kampala, Uganda",
          image: "/public/images/tek-talent-meetup-3.jpeg",
          category: "Workshop",
          featured: false
        },
        content: `# Data Science Bootcamp

## Master the Fundamentals in 3 Days

This intensive bootcamp is designed to give you a solid foundation in data science, from basic statistical concepts to machine learning models.

## What You'll Learn

- **Day 1: Foundations**
  - Introduction to statistical concepts
  - Data cleaning and preprocessing
  - Exploratory data analysis
  
- **Day 2: Machine Learning**
  - Supervised learning algorithms
  - Model evaluation and validation
  - Feature engineering
  
- **Day 3: Applied Projects**
  - Working with real-world datasets
  - Building end-to-end solutions
  - Presenting insights effectively

## Requirements

- Basic programming knowledge (Python preferred)
- A laptop with the ability to install software
- Enthusiasm for working with data!

## Instructors

Our bootcamp will be led by experienced data scientists from major tech companies and local universities.

## Registration

Space is limited to 30 participants to ensure a quality learning experience. Register early to secure your spot!`
      }
    ];
  } else if (type === 'projects') {
    return [
      {
        slug: 'mobile-learning-app',
        frontmatter: {
          title: "Mobile Learning App",
          date: "2025-03-01",
          description: "An educational app that works offline to reach students in areas with limited connectivity.",
          image: "/public/images/tek-talent-meetup-1.jpeg",
          category: "Education",
          status: "In Development",
          tags: ["react-native", "education", "mobile"],
          featured: true
        },
        content: `# Mobile Learning App

## Bridging the Digital Divide in Education

Our Mobile Learning App aims to make quality educational content accessible to students in areas with limited internet connectivity across Africa.

## The Problem

While digital learning has transformed education globally, many African students are left behind due to:

- Unreliable internet connectivity
- Expensive data costs
- Limited access to devices

## Our Solution

We're building a mobile application that:

- Works offline with periodic content updates
- Is optimized for low-end devices
- Covers core curriculum subjects
- Includes interactive exercises and assessments

## Technical Details

The app is being built with:

- React Native for cross-platform compatibility
- SQLite for local data storage
- Content compression techniques to minimize storage requirements
- Sync optimization to work with intermittent connectivity

## Current Status

The project is currently in development with a prototype being tested in selected schools in Uganda. We're focusing on mathematics and science content for secondary education.

## Get Involved

We're looking for contributors with experience in:
- React Native development
- Educational content creation
- UI/UX design for low-resource contexts
- Testing and quality assurance`
      },
      {
        slug: 'community-marketplace',
        frontmatter: {
          title: "Community Marketplace Platform",
          date: "2025-02-15",
          description: "A digital marketplace connecting local artisans with global consumers.",
          image: "/public/images/tek-talent-meetup-2.jpeg",
          category: "E-Commerce",
          status: "Active",
          tags: ["react", "nodejs", "e-commerce"],
          featured: true
        },
        content: `# Community Marketplace Platform

## Connecting African Artisans to Global Markets

Our Community Marketplace Platform is building digital bridges that connect skilled artisans across Africa with consumers around the world.

## The Vision

To create economic opportunities for local creators while preserving cultural craftsmanship through technology.

## Features

- **Artisan Profiles** - Showcasing creators and their stories
- **Secure Payments** - Supporting multiple payment methods including mobile money
- **Logistics Integration** - Simplified shipping across borders
- **Quality Assurance** - Systems to maintain high-quality standards
- **Cultural Context** - Educating consumers about the cultural significance of products

## Technical Stack

- Frontend: React with Next.js
- Backend: Node.js with Express
- Database: MongoDB
- Payments: Stripe with M-Pesa integration
- Authentication: Auth0
- Hosting: AWS

## Current Status

The platform launched in February 2025 and currently hosts 200+ artisans from 5 African countries. We've facilitated over 1,500 transactions.

## Roadmap

- Q3 2025: Expand to 3 additional countries
- Q4 2025: Launch mobile applications (Android & iOS)
- Q1 2026: Implement AI-powered recommendation system
- Q2 2026: Add virtual reality shopping experience

## Join Us

We're seeking contributors with experience in:
- Frontend development
- Payment systems integration
- Logistics and fulfillment
- Digital marketing
- UI/UX design`
      },
      {
        slug: 'health-monitoring-system',
        frontmatter: {
          title: "Rural Health Monitoring System",
          date: "2025-01-10",
          description: "A low-cost system for monitoring health metrics in remote areas.",
          image: "/public/images/tek-talent-meetup-3.jpeg",
          category: "Healthcare",
          status: "Research",
          tags: ["iot", "healthcare", "embedded-systems"],
          featured: false
        },
        content: `# Rural Health Monitoring System

## Technology for Healthcare Access

We're developing a low-cost, durable health monitoring system specifically designed for deployment in rural areas with limited healthcare infrastructure.

## The Challenge

Many rural communities across Africa face:
- Shortage of healthcare professionals
- Long distances to medical facilities
- Limited diagnostic equipment
- Inconsistent power supply
- Poor connectivity

## Our Approach

The Rural Health Monitoring System consists of:

1. **Rugged Hardware**
   - Battery-powered with solar charging
   - Basic vital sign monitoring (temperature, blood pressure, heart rate)
   - Simple interface requiring minimal training
   
2. **Edge Computing**
   - Local processing of health data
   - AI-assisted preliminary diagnostics
   - Functions without constant internet connectivity
   
3. **Data Management**
   - Secure storage of patient information
   - Synchronization when connectivity is available
   - Flagging critical cases for urgent attention

## Current Status

The project is currently in the research and prototyping phase. We're working with healthcare professionals to define essential features and conducting field tests of early hardware prototypes.

## Get Involved

This project needs contributors with backgrounds in:
- Embedded systems and IoT
- Healthcare and medical devices
- AI and machine learning
- Solar power and battery systems
- User interface design for low-literacy contexts`
      }
    ];
  }
  
  return [];
}

export function isUpcomingEvent(date: string): boolean {
  const eventDate = new Date(date);
  const currentDate = new Date();
  return eventDate >= currentDate;
}

// Added function to get categories from markdown files
export function getCategories(files: MarkdownFile[]): string[] {
  const categories = files.map(file => file.frontmatter.category || 'Uncategorized');
  return ['All', ...Array.from(new Set(categories))];
}

// Added function to get tags from markdown files
export function getTags(files: MarkdownFile[]): string[] {
  const allTags: string[] = [];
  files.forEach(file => {
    if (file.frontmatter.tags && Array.isArray(file.frontmatter.tags)) {
      allTags.push(...file.frontmatter.tags);
    }
  });
  return ['All', ...Array.from(new Set(allTags))];
}

// Added function to get featured items
export function getFeaturedItems(files: MarkdownFile[], count: number = 3): MarkdownFile[] {
  const featured = files.filter(file => file.frontmatter.featured);
  const others = files.filter(file => !file.frontmatter.featured);
  return [...featured, ...others].slice(0, count);
}

// Added function for search
export function searchFiles(files: MarkdownFile[], query: string): MarkdownFile[] {
  if (!query) return files;
  
  const lowerQuery = query.toLowerCase();
  return files.filter(file => 
    file.frontmatter.title.toLowerCase().includes(lowerQuery) ||
    file.frontmatter.description.toLowerCase().includes(lowerQuery) ||
    (file.frontmatter.author && file.frontmatter.author.toLowerCase().includes(lowerQuery)) ||
    (file.frontmatter.category && file.frontmatter.category.toLowerCase().includes(lowerQuery)) ||
    (Array.isArray(file.frontmatter.tags) && file.frontmatter.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
  );
}
