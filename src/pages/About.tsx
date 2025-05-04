
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatBot from '@/components/chat/ChatBot';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="portfolio-heading mb-8">About</h1>
            
            <div className="prose max-w-none">
              <p className="text-xl mb-8">
                I'm a strategy and design professional dedicated to bringing healthcare forward. My team of designers, strategists, and business leaders focus on our clients' industry expertise to unearth opportunities amidst complexity.
              </p>
              
              <p className="mb-6">
                I equip my partners with human context and experiences so that they can build a better future of healthcare. The innovation studio approach allows me to leverage capabilities in medical planning, operational planning, and spatial design to make solutions real.
              </p>
              
              <h2 className="text-2xl font-medium mt-12 mb-6">Skills & Expertise</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div>
                  <h3 className="text-lg font-medium mb-4">Industry Insights</h3>
                  <ul className="space-y-2">
                    <li>Healthcare systems</li>
                    <li>Clinical workflows</li>
                    <li>Patient experience</li>
                    <li>Healthcare regulations</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Service & Design</h3>
                  <ul className="space-y-2">
                    <li>User experience design</li>
                    <li>Interface design</li>
                    <li>Service blueprinting</li>
                    <li>Patient journey mapping</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Technical Expertise</h3>
                  <ul className="space-y-2">
                    <li>Prototyping</li>
                    <li>User testing</li>
                    <li>Healthcare software</li>
                    <li>Integration standards</li>
                  </ul>
                </div>
              </div>
              
              <p>
                With an extensive background in healthcare design and technology, I bring a unique perspective that bridges clinical needs with technical possibilities, always keeping the human experience at the center.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default About;
