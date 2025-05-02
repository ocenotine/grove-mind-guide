
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.2 } }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
        // Fix the variant type error by using a valid variant
        variant: "default"
      });
      
      // Reset form
      setForm({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-tekOrange/20 to-white dark:from-tekOrange/10 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
              Contact <span className="text-tekOrange">Us</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Have questions? We'd love to hear from you. Reach out to our team and we'll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16"
          >
            <motion.div variants={fadeIn} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-tekOrange/20 rounded-full mr-4">
                  <MapPin className="text-tekOrange" size={24} />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Our Location</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Nairobi, Kenya<br />
                Innovation Hub, 3rd Floor<br />
                Kenyatta Avenue
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-tekOrange/20 rounded-full mr-4">
                  <Phone className="text-tekOrange" size={24} />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Phone</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Main: +254 700 123 456<br />
                Support: +254 700 789 012
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-tekOrange/20 rounded-full mr-4">
                  <Mail className="text-tekOrange" size={24} />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Email</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                info@tektalentafrica.org<br />
                support@tektalentafrica.org
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-tekOrange/20 rounded-full mr-4">
                  <Clock className="text-tekOrange" size={24} />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Hours</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Monday - Friday: 9am - 5pm<br />
                Saturday: 10am - 2pm<br />
                Sunday: Closed
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* Contact Form */}
            <motion.div variants={fadeIn} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full focus:ring-2 focus:ring-tekOrange"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    required
                    className="w-full focus:ring-2 focus:ring-tekOrange"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                    className="w-full focus:ring-2 focus:ring-tekOrange"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    required
                    className="w-full min-h-[150px] focus:ring-2 focus:ring-tekOrange"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-tekOrange hover:bg-orange-600 text-white transition-all transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <>Processing <Send className="ml-2 h-4 w-4 animate-bounce" /></>
                  ) : (
                    <>Send Message <Send className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </form>
            </motion.div>
            
            {/* Map */}
            <motion.div variants={fadeIn} className="rounded-xl overflow-hidden shadow-md h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127672.75772082225!2d36.752317773215846!3d-1.2849249656626232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1650983041532!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Tek Talent Africa Location"
              ></iframe>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Frequently Asked Questions</h2>
            <div className="w-24 h-1 bg-tekOrange mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Can't find what you're looking for? Reach out to us using the contact form above.
            </p>
          </motion.div>

          <motion.div 
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-4xl mx-auto divide-y divide-gray-200 dark:divide-gray-700"
          >
            {[
              {
                question: "How can I join the Tek Talent Africa community?",
                answer: "You can join our community by attending our events, signing up for our newsletter, or connecting with us on social media platforms. We also have regular orientation sessions for new members."
              },
              {
                question: "Do you offer training programs for beginners?",
                answer: "Yes, we offer various training programs catered to different skill levels, including beginners. Our introductory courses cover the basics of programming, design, and other tech-related subjects."
              },
              {
                question: "Are there opportunities to volunteer with Tek Talent Africa?",
                answer: "Absolutely! We're always looking for passionate volunteers to help with events, mentoring, content creation, and more. Please reach out through the contact form to express your interest."
              },
              {
                question: "How can my company partner with Tek Talent Africa?",
                answer: "We collaborate with companies for talent recruitment, sponsored workshops, hackathons, and other initiatives. Please contact our partnerships team for more information on potential collaborations."
              },
              {
                question: "Do you have chapters in other African countries?",
                answer: "Currently, we have established chapters in Kenya, Uganda, Tanzania, and Rwanda. We're actively working on expanding to more countries across Africa in the near future."
              }
            ].map((faq, index) => (
              <motion.div key={index} variants={fadeIn} className="py-6 px-4 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-tekOrange to-orange-500 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
            <p className="text-lg mb-8">
              Subscribe to our newsletter to receive updates on events, opportunities, and community news.
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              toast({
                title: "Subscribed!",
                description: "You've been added to our newsletter.",
                // Fix variant type error
                variant: "default"
              });
              // Reset the input field
              const input = e.target as HTMLFormElement;
              input.reset();
            }} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                required
                className="flex-grow bg-white/20 border-white/30 placeholder:text-white/70 text-white"
              />
              <Button type="submit" variant="outline" className="bg-white text-tekOrange hover:bg-gray-100 transform hover:scale-105 transition-transform">
                Subscribe <Check className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
