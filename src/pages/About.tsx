
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Code, Users, Globe, Heart, Mail, MapPin, Phone, Award, BookOpen, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const About = () => {
  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.2 } }
  };

  // Team members data
  const teamMembers = [
    {
      name: "Sarah Ngugi",
      role: "Founder & CEO",
      image: "public/uploads/tektalentlogo.png",
      bio: "Sarah has over 10 years of experience in the tech industry and is passionate about nurturing tech talent in Africa."
    },
    {
      name: "Michael Ochieng",
      role: "Tech Lead",
      image: "public/uploads/tektalentlogo.png",
      bio: "Michael leads technical training programs and has mentored over 500 developers across East Africa."
    },
    {
      name: "Rebecca Atieno",
      role: "Community Manager",
      image: "public/uploads/tektalentlogo.png",
      bio: "Rebecca builds partnerships with tech companies and organizes community events across the region."
    },
    {
      name: "Daniel Mwangi",
      role: "Education Director",
      image: "public/uploads/tektalentlogo.png",
      bio: "Daniel develops our training curriculum and ensures our programs meet industry standards."
    }
  ];

  // Achievements data
  const achievements = [
    {
      number: "5000+",
      title: "Developers Trained",
      icon: <Users className="w-6 h-6 text-tekOrange" />
    },
    {
      number: "10+",
      title: "Industry Partners",
      icon: <Briefcase className="w-6 h-6 text-tekOrange" />
    },
    {
      number: "4",
      title: "African Countries",
      icon: <Globe className="w-6 h-6 text-tekOrange" />
    },
    {
      number: "20+",
      title: "Community Events",
      icon: <BookOpen className="w-6 h-6 text-tekOrange" />
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-tekOrange/20 via-orange-100 to-white dark:from-tekOrange/10 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
              About <span className="text-tekOrange">Tek Talent</span> Africa
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Building Africa's tech ecosystem by empowering the next generation of innovators
            </p>
          </motion.div>
        </div>
        
        {/* Abstract shapes for visual interest */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-orange-300 opacity-20 blur-2xl"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 rounded-full bg-orange-400 opacity-10 blur-3xl"></div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {achievements.map((item, index) => (
              <motion.div 
                key={index} 
                variants={fadeIn}
                className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white dark:bg-gray-700 rounded-full">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-tekOrange mb-2">{item.number}</h3>
                <p className="text-gray-700 dark:text-gray-300">{item.title}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            <motion.div variants={fadeIn} className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="mb-4 inline-block p-3 bg-tekOrange/20 rounded-full">
                <Users size={28} className="text-tekOrange" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-300">
                To bridge the gap between tech education and industry needs, creating a sustainable
                ecosystem for tech talent development in Africa. We aim to empower young Africans with
                the skills, resources, and networks needed to thrive in the global digital economy.
              </p>
              
              <div className="mt-6 flex items-center">
                <Award className="text-tekOrange mr-2" size={16} />
                <span className="text-sm text-gray-500 dark:text-gray-400">Recognized by African Tech Summit 2023</span>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="mb-4 inline-block p-3 bg-tekOrange/20 rounded-full">
                <Globe size={28} className="text-tekOrange" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Our Vision</h2>
              <p className="text-gray-600 dark:text-gray-300">
                To be the leading tech talent community in Africa, recognized for cultivating
                world-class developers, designers, and tech entrepreneurs. We envision an
                Africa where tech innovation drives economic growth and social development.
              </p>
              
              <div className="mt-6 flex items-center">
                <Award className="text-tekOrange mr-2" size={16} />
                <span className="text-sm text-gray-500 dark:text-gray-400">Best Tech Education Initiative 2024</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Our Story</h2>
            <div className="w-24 h-1 bg-tekOrange mx-auto mb-8"></div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md">
              <div className="relative">
                <div className="absolute left-0 top-0 -ml-3 -mt-3 w-12 h-12 bg-tekOrange/10 rounded-full"></div>
                <div className="absolute right-0 bottom-0 -mr-3 -mb-3 w-20 h-20 bg-tekOrange/10 rounded-full"></div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 relative z-10">
                  Tek Talent Africa began in 2018 when a group of passionate tech professionals recognized
                  the growing gap between tech education and industry requirements in Africa. What started
                  as informal meetups in Nairobi quickly grew into structured training programs and
                  community-driven initiatives.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4 relative z-10">
                  Today, we've expanded our reach across East Africa, with community chapters in Kenya,
                  Uganda, Tanzania, and Rwanda. We've trained over 5,000 developers and helped hundreds
                  secure employment or launch their own tech ventures.
                </p>
                <p className="text-gray-600 dark:text-gray-300 relative z-10">
                  Our commitment to quality education, hands-on experience, and community support has
                  established us as a trusted partner for both aspiring tech talents and companies
                  seeking skilled professionals.
                </p>
              </div>
              
              <div className="mt-8 flex items-center justify-between p-4 bg-orange-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">2018</span>
                <div className="h-0.5 flex-grow mx-4 bg-orange-200 dark:bg-gray-600"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Present</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Our Values</h2>
            <div className="w-24 h-1 bg-tekOrange mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              These core principles guide our community and shape everything we do.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeIn} className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105">
              <div className="mb-4 inline-block p-4 bg-tekOrange/20 rounded-full">
                <Code size={28} className="text-tekOrange" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Excellence</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We strive for the highest standards in everything we do, from educational content to community engagement.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105">
              <div className="mb-4 inline-block p-4 bg-tekOrange/20 rounded-full">
                <Users size={28} className="text-tekOrange" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Collaboration</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We believe in the power of working together, sharing knowledge, and lifting each other up.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105">
              <div className="mb-4 inline-block p-4 bg-tekOrange/20 rounded-full">
                <Heart size={28} className="text-tekOrange" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Inclusivity</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We create spaces where everyone feels welcome, valued, and empowered to contribute.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Our Team</h2>
            <div className="w-24 h-1 bg-tekOrange mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
              Meet the passionate people behind Tek Talent Africa.
            </p>
          </motion.div>

          {/* Use the shadcn Carousel for team members */}
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {teamMembers.map((member, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <motion.div
                    variants={fadeIn}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all h-full"
                  >
                    <div className="h-48 overflow-hidden bg-orange-100 dark:bg-gray-700">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-contain p-4"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-1 text-gray-800 dark:text-white">{member.name}</h3>
                      <p className="text-tekOrange mb-3">{member.role}</p>
                      <p className="text-gray-600 dark:text-gray-300">{member.bio}</p>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-16 bg-gradient-to-r from-tekOrange to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Community</h2>
            <p className="text-lg mb-8">
              Be part of a vibrant community that's shaping the future of technology in Africa.
              Whether you're a beginner or experienced professional, there's a place for you here.
            </p>
            <Link to="/contact">
              <Button className="bg-white text-tekOrange hover:bg-gray-100 hover:scale-105 transform transition-all text-lg px-8 py-6">
                Get In Touch <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
