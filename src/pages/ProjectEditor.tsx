
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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
    
    // In a real app, this would send data to Supabase
    toast.success(`Project ${isNew ? 'created' : 'updated'} successfully!`);
    navigate('/admin');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-2xl font-medium">{isNew ? 'Add Project' : 'Edit Project'}</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
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
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" type="button" onClick={() => navigate('/admin')}>
                Cancel
              </Button>
              <Button type="submit">
                <Check className="mr-2 h-4 w-4" />
                {isNew ? 'Create Project' : 'Update Project'}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectEditor;
