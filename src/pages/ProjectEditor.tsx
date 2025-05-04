
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Project } from '@/components/project/ProjectCard';
import ProjectEditorHeader from '@/components/project-editor/ProjectEditorHeader';
import ProjectEditorForm from '@/components/project-editor/ProjectEditorForm';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { createEmbeddings } from '@/services/openai';

// Mock data for projects (will be replaced with Supabase data)
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Expert Physician Portal',
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
];

const ProjectEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const isNew = id === 'new';
  const existingProject = isNew ? null : mockProjects.find(p => p.id === id);
  
  const [title, setTitle] = useState(existingProject?.title || '');
  const [client, setClient] = useState(existingProject?.client || '');
  const [description, setDescription] = useState(existingProject?.description || '');
  const [imageUrl, setImageUrl] = useState(existingProject?.imageUrl || '');
  const [liveUrl, setLiveUrl] = useState('');
  const [involvement, setInvolvement] = useState('');
  const [tags, setTags] = useState<string[]>(existingProject?.tags || []);
  const [newTag, setNewTag] = useState('');
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!title || !client || !description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      toast.info('Saving project...');
      
      // Create or update project in Supabase
      const projectId = isNew ? uuidv4() : (id || '');
      const projectData = {
        id: projectId,
        title,
        client,
        description,
        year: new Date().getFullYear(),
        updated_at: new Date().toISOString(),
        ...(isNew && { created_at: new Date().toISOString() })
      };
      
      // Insert or update project
      let { error } = isNew 
        ? await supabase.from('projects').insert(projectData)
        : await supabase.from('projects').update(projectData).eq('id', projectId);
      
      if (error) throw error;
      
      // Save tags
      // First, get tag IDs or insert new ones
      const tagIds = [];
      for (const tagName of tags) {
        // Check if tag exists
        const { data: existingTags } = await supabase
          .from('tags')
          .select('id')
          .eq('name', tagName)
          .limit(1);
          
        if (existingTags && existingTags.length > 0) {
          tagIds.push(existingTags[0].id);
        } else {
          // Create new tag
          const newTagId = uuidv4();
          const { error: tagError } = await supabase
            .from('tags')
            .insert({ id: newTagId, name: tagName });
            
          if (tagError) throw tagError;
          tagIds.push(newTagId);
        }
      }
      
      // If not a new project, delete existing tag associations
      if (!isNew) {
        const { error: deleteError } = await supabase
          .from('project_tags')
          .delete()
          .eq('project_id', projectId);
          
        if (deleteError) throw deleteError;
      }
      
      // Save tag associations
      if (tagIds.length > 0) {
        const projectTags = tagIds.map(tagId => ({
          project_id: projectId,
          tag_id: tagId
        }));
        
        const { error: projectTagsError } = await supabase
          .from('project_tags')
          .insert(projectTags);
          
        if (projectTagsError) throw projectTagsError;
      }
      
      // Save primary image
      if (imageUrl) {
        // Check if image record exists
        const { data: existingImages } = await supabase
          .from('project_images')
          .select('id')
          .eq('project_id', projectId)
          .eq('is_primary', true)
          .limit(1);
          
        if (existingImages && existingImages.length > 0) {
          // Update existing image
          const { error: imageError } = await supabase
            .from('project_images')
            .update({ image_url: imageUrl })
            .eq('id', existingImages[0].id);
            
          if (imageError) throw imageError;
        } else {
          // Insert new image
          const { error: imageError } = await supabase
            .from('project_images')
            .insert({
              project_id: projectId,
              image_url: imageUrl,
              is_primary: true,
              display_order: 0
            });
            
          if (imageError) throw imageError;
        }
      }
      
      // Generate content for embeddings
      const { data: contentData } = await supabase.rpc('generate_project_content_for_embeddings', {
        project_id: projectId
      });
      
      if (contentData) {
        // Generate embeddings using OpenAI
        const embeddings = await createEmbeddings(contentData);
        
        if (embeddings) {
          // Store embeddings - specify the correct type for the embedding field
          const { error: embeddingError } = await supabase
            .from('project_embeddings')
            .upsert({
              project_id: projectId,
              content: contentData,
              embedding: embeddings
            });
            
          if (embeddingError) {
            console.error('Error saving embeddings:', embeddingError);
            // Continue even if embeddings fail - don't block the user
          }
        }
      }
      
      toast.success(`Project ${isNew ? 'created' : 'updated'} successfully!`);
      navigate('/admin/projects');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(`Failed to ${isNew ? 'create' : 'update'} project`);
    }
  };

  const handleCancel = () => {
    navigate('/admin/projects');
  };
  
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto py-8 px-4">
        <ProjectEditorHeader isNew={isNew} />
        
        <div className="max-w-3xl">
          <ProjectEditorForm
            isNew={isNew}
            title={title}
            setTitle={setTitle}
            client={client}
            setClient={setClient}
            description={description}
            setDescription={setDescription}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            liveUrl={liveUrl}
            setLiveUrl={setLiveUrl}
            involvement={involvement}
            setInvolvement={setInvolvement}
            tags={tags}
            setTags={setTags}
            newTag={newTag}
            setNewTag={setNewTag}
            handleAddTag={handleAddTag}
            handleRemoveTag={handleRemoveTag}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectEditor;
