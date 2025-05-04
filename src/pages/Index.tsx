
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProjectGrid from '@/components/project/ProjectGrid';
import ChatBot from '@/components/chat/ChatBot';
import { Project } from '@/components/project/ProjectCard';

// Mock data for projects (will be replaced with Supabase data)
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Included Health\'s Expert Physician Portal',
    client: 'Included Health',
    description: 'Physicians needed to evaluate patient conditions and make recommendations across a telehealth platform.',
    imageUrl: '/lovable-uploads/e818c6cd-0b7f-4e5a-a8b8-5a83f891d04c.png',
    tags: ['UX Research', 'UI Design', 'Healthcare'],
    createdAt: '2023-01-15',
  },
  {
    id: '2',
    title: 'Health Bridge Platform',
    client: 'HealthBridge',
    description: 'A platform connecting patients with healthcare providers for seamless virtual care experiences.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3',
    tags: ['UI Design', 'Frontend Development', 'Telehealth'],
    createdAt: '2023-03-22',
  },
  {
    id: '3',
    title: 'Medical Opinion Dashboard',
    client: 'RVO Health',
    description: 'A dashboard for medical professionals to manage and track patient opinions and feedback.',
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3',
    tags: ['Dashboard', 'Data Visualization', 'Healthcare'],
    createdAt: '2023-06-10',
  },
  {
    id: '4',
    title: 'Patient Workflow Analysis',
    client: 'Sutter Health',
    description: 'A deep analysis of patient workflows to identify pain points and improve the overall experience.',
    imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3',
    tags: ['UX Research', 'Service Design', 'Healthcare'],
    createdAt: '2023-08-05',
  },
  {
    id: '5',
    title: 'Healthcare Professional Portal',
    client: 'Optum Store',
    description: 'A comprehensive portal for healthcare professionals to manage patient data, appointments, and communications.',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3',
    tags: ['Portal Design', 'UI/UX', 'Enterprise'],
    createdAt: '2023-10-18',
  },
  {
    id: '6',
    title: 'Medical Analytics Platform',
    client: 'Idiomatics',
    description: 'A platform for analyzing medical data and providing insights for healthcare professionals and researchers.',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3',
    tags: ['Data Analytics', 'Dashboard', 'Healthcare'],
    createdAt: '2023-12-01',
  },
];

const Index = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 px-4 md:px-6">
        <div className="container mx-auto">
          <section className="py-16 md:py-24">
            <h1 className="portfolio-heading max-w-3xl mb-6">
              Case studies & work
            </h1>
            <p className="portfolio-subheading max-w-2xl mb-16">
              A collection of projects focused on creating meaningful digital experiences for healthcare and beyond.
            </p>
            <ProjectGrid projects={projects} />
          </section>
        </div>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
