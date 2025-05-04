
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { Project } from '@/components/project/ProjectCard';
import ProjectBasicInfoFields from './ProjectBasicInfoFields';
import ProjectDescriptionField from './ProjectDescriptionField';
import ProjectImageUpload from './ProjectImageUpload';
import ProjectTagsField from './ProjectTagsField';
import ProjectUrlField from './ProjectUrlField';

interface ProjectEditorFormProps {
  isNew: boolean;
  title: string;
  setTitle: (value: string) => void;
  client: string;
  setClient: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  imageUrl: string;
  setImageUrl: (value: string) => void;
  liveUrl: string;
  setLiveUrl: (value: string) => void;
  involvement: string;
  setInvolvement: (value: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  newTag: string;
  setNewTag: (value: string) => void;
  handleAddTag: () => void;
  handleRemoveTag: (tag: string) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ProjectEditorForm = ({
  isNew,
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
  setNewTag,
  handleAddTag,
  handleRemoveTag,
  onCancel,
  onSubmit,
}: ProjectEditorFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-card shadow-sm border rounded-lg p-6">
      <ProjectBasicInfoFields
        title={title}
        setTitle={setTitle}
        client={client}
        setClient={setClient}
      />
      
      <ProjectDescriptionField 
        description={description} 
        setDescription={setDescription}
        involvement={involvement}
        setInvolvement={setInvolvement}
      />
      
      <ProjectUrlField
        liveUrl={liveUrl}
        setLiveUrl={setLiveUrl}
      />
      
      <ProjectImageUpload 
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
      />
      
      <ProjectTagsField
        tags={tags}
        newTag={newTag}
        setNewTag={setNewTag}
        handleAddTag={handleAddTag}
        handleRemoveTag={handleRemoveTag}
      />
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Check className="mr-2 h-4 w-4" />
          {isNew ? 'Create Project' : 'Update Project'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectEditorForm;
