import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Project } from '@/components/project/ProjectCard';
import ProjectEditorHeader from '@/components/project-editor/ProjectEditorHeader';
import ProjectEditorForm from '@/components/project-editor/ProjectEditorForm';

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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!title || !client || !description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // In a real app, this would send data to Supabase and generate embeddings
    toast.success(`Project ${isNew ? 'created' : 'updated'} successfully!`);
    toast.info('This would generate embeddings for OpenAI to access');
    navigate('/admin/projects');
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
