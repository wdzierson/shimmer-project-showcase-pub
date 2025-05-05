import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import ChatBot from '@/components/chat/ChatBot';
import { Project } from '@/components/project/ProjectCard';
import { supabase } from '@/integrations/supabase/client';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface ProjectWithImages extends Project {
  additionalImages?: string[];
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectWithImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        
        // Fetch project data
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
          
        if (projectError) {
          console.error('Error fetching project:', projectError);
          setError('Failed to load project');
          setLoading(false);
          return;
        }
        
        if (!projectData) {
          setError('Project not found');
          setLoading(false);
          return;
        }
        
        // Fetch images
        const { data: imageData } = await supabase
          .from('project_images')
          .select('image_url, is_primary, display_order')
          .eq('project_id', id)
          .order('display_order', { ascending: true });
          
        let primaryImageUrl = '';
        let additionalImages: string[] = [];
          
        if (imageData && imageData.length > 0) {
          // Find primary image
          const primaryImage = imageData.find(img => img.is_primary);
          if (primaryImage) {
            primaryImageUrl = primaryImage.image_url;
          }
            
          // Get additional images (non-primary)
          additionalImages = imageData
            .filter(img => !img.is_primary)
            .map(img => img.image_url);
        }
        
        // Fetch tags
        const { data: tagData } = await supabase
          .from('project_tags')
          .select('tags(name)')
          .eq('project_id', id);
        
        const tags = tagData ? tagData.map(item => item.tags.name) : [];
        
        // Create complete project object
        const completeProject: ProjectWithImages = {
          id: projectData.id,
          title: projectData.title,
          client: projectData.client,
          description: projectData.description,
          imageUrl: primaryImageUrl,
          additionalImages: additionalImages,
          tags: tags,
          createdAt: projectData.created_at,
        };
        
        setProject(completeProject);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError('An unexpected error occurred');
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto pt-24 px-4 md:px-6 flex justify-center">
          <div className="text-lg">Loading project details...</div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !project) {
    return (
      <div>
        <Header />
        <div className="container mx-auto pt-24 px-4 md:px-6">
          <h1 className="text-2xl font-bold mt-8">{error || 'Project not found'}</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const hasMultipleImages = project.additionalImages && project.additionalImages.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Custom header with 40% transparency */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-medium tracking-tight">
            {project.title}
          </div>
        </div>
      </div>
      
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
                  <Badge key={tag} variant="secondary" className="bg-gray-200 text-gray-700 hover:bg-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="rounded-md overflow-hidden mb-12">
              {hasMultipleImages ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {/* Main image */}
                    <CarouselItem>
                      <div className="p-1">
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-full h-auto object-cover rounded-md"
                        />
                      </div>
                    </CarouselItem>
                    
                    {/* Additional images */}
                    {project.additionalImages?.map((imageUrl, index) => (
                      <CarouselItem key={`additional-image-${index}`}>
                        <div className="p-1">
                          <img 
                            src={imageUrl} 
                            alt={`${project.title} - ${index + 1}`} 
                            className="w-full h-auto object-cover rounded-md"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-center mt-2">
                    <CarouselPrevious className="relative translate-y-0 left-0 mr-2" />
                    <CarouselNext className="relative translate-y-0 right-0" />
                  </div>
                </Carousel>
              ) : (
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-auto"
                />
              )}
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
