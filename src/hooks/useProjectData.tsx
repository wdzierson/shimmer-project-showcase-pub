
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface ProjectFormData {
  title: string;
  client: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  involvement: string;
  tags: string[];
  newTag: string;
}

export const useProjectData = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const isNew = id === 'new';
  
  // State for project data
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [involvement, setInvolvement] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Load existing project data if editing
  useEffect(() => {
    const fetchProjectData = async () => {
      if (isNew) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch project data
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
        
        if (projectError) throw projectError;
        if (!projectData) {
          toast.error('Project not found');
          navigate('/admin/projects');
          return;
        }
        
        // Set project basic data
        setTitle(projectData.title);
        setClient(projectData.client);
        setDescription(projectData.description);
        
        // Fetch primary image
        const { data: imageData } = await supabase
          .from('project_images')
          .select('image_url')
          .eq('project_id', id)
          .eq('is_primary', true)
          .single();
          
        if (imageData) {
          setImageUrl(imageData.image_url);
        }
        
        // Fetch tags
        const { data: tagData } = await supabase
          .from('project_tags')
          .select('tags(name)')
          .eq('project_id', id);
          
        if (tagData) {
          const tagNames = tagData.map(item => item.tags.name);
          setTags(tagNames);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project:', error);
        toast.error('Failed to load project data');
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [id, isNew, navigate]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  return {
    isNew,
    id,
    loading,
    projectData: {
      title,
      setTitle,
      client,
      setClient,
      description,
      setDescription,
      imageUrl,
      setImageUrl,
      liveUrl,
      setLiveUrl,
      involvement,
      setInvolvement,
      tags,
      setTags,
      newTag,
      setNewTag
    },
    handleAddTag,
    handleRemoveTag,
    navigate
  };
};
