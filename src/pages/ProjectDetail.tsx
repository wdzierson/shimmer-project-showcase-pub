
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import ChatBot from '@/components/chat/ChatBot';
import { Project } from '@/components/project/ProjectCard';

// Mock data for projects (will be replaced with Supabase data)
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Included Health\'s Expert Physician Portal',
    client: 'Included Health',
    description: 'Physicians needed to evaluate patient conditions and make recommendations across a telehealth platform. They were accessing patient images in one of our existing interfaces.',
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
];

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const project = mockProjects.find(p => p.id === id);
  
  if (!project) {
    return (
      <div>
        <Header />
        <div className="container mx-auto pt-24 px-4 md:px-6">
          <h1 className="text-2xl font-bold mt-8">Project not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="text-sm uppercase text-muted-foreground mb-1">
                {project.client}
              </div>
              <h1 className="case-study-title mb-6">{project.title}</h1>
              <div className="flex flex-wrap gap-1 mb-8">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="rounded-md overflow-hidden mb-12">
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-auto"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="col-span-1">
                <h2 className="case-study-section mb-3">Challenge</h2>
                <p>
                  Physicians needed to evaluate patient conditions and make recommendations across a telehealth platform. They were accessing patient images in one of our existing interfaces.
                </p>
              </div>
              
              <div className="col-span-1">
                <h2 className="case-study-section mb-3">Approach</h2>
                <p>
                  Human-centered design approach, extensive user research, including interviews and field observations, to understand physicians' existing workflow and pain points.
                </p>
              </div>
              
              <div className="col-span-1">
                <h2 className="case-study-section mb-3">Impact</h2>
                <p>
                  Increased physician efficiency, reducing time spent navigating the portal and allowing more focus on patient care.
                </p>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-lg mb-6">
                We completed deep research to understand where the pain points for physicians were when reviewing patient information. By documenting the current state, we could all align on what needed to be improved.
              </p>
              
              <p className="mb-6">
                Through a comprehensive design process, we identified key opportunities to streamline the workflow and create a more intuitive interface that aligned with how physicians actually work.
              </p>
              
              <p>
                The resulting solution dramatically improved efficiency and satisfaction among physicians, allowing them to focus more on patient care rather than navigating complex interfaces.
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

export default ProjectDetail;
