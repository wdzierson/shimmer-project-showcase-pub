
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, ArrowLeft, Upload, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Project } from '@/components/project/ProjectCard';

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
  const [liveUrl, setLiveUrl] = useState(''); // New field for live project URL
  const [involvement, setInvolvement] = useState(''); // New field for specifying involvement
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
  
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/admin/projects">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Link>
          </Button>
          <h1 className="text-3xl font-semibold">{isNew ? 'Add Project' : 'Edit Project'}</h1>
          <p className="text-muted-foreground mt-1">
            Fill in the project details to make them accessible via the chat interface
          </p>
        </div>
        
        <div className="max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6 bg-card shadow-sm border rounded-lg p-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client">Client Name *</Label>
              <Input
                id="client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Enter client name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Project Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description"
                required
                rows={5}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="involvement">Your Involvement</Label>
              <Textarea
                id="involvement"
                value={involvement}
                onChange={(e) => setInvolvement(e.target.value)}
                placeholder="Describe your role and contributions to this project"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="liveUrl">Live Project URL</Label>
              <Input
                id="liveUrl"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Project Image</Label>
              <div className="border rounded-md p-4 flex flex-col items-center justify-center text-center">
                {imageUrl ? (
                  <div className="space-y-4">
                    <div className="relative w-full max-w-md mx-auto">
                      <img 
                        src={imageUrl} 
                        alt="Project preview" 
                        className="w-full h-auto rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 rounded-full"
                        onClick={() => setImageUrl('')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      To replace, upload a new image
                    </p>
                  </div>
                ) : (
                  <div className="py-10">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">Drag and drop an image, or click to browse</p>
                    <p className="text-xs text-muted-foreground mb-4">PNG, JPG or WebP (max 5MB)</p>
                    <Button type="button" variant="outline">
                      Select Image
                    </Button>
                    <Input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        // In a real app, this would upload to Supabase storage
                        if (e.target.files?.[0]) {
                          // Using a sample image for demo purposes
                          setImageUrl('/lovable-uploads/ac6f419a-3a72-4e52-ad89-993c798272e2.png');
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Project Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="pl-2">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" type="button" onClick={() => navigate('/admin/projects')}>
                Cancel
              </Button>
              <Button type="submit">
                <Check className="mr-2 h-4 w-4" />
                {isNew ? 'Create Project' : 'Update Project'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectEditor;
