
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProjectDescriptionFieldProps {
  description: string;
  setDescription: (value: string) => void;
  involvement: string;
  setInvolvement: (value: string) => void;
}

const ProjectDescriptionField = ({
  description,
  setDescription,
  involvement,
  setInvolvement
}: ProjectDescriptionFieldProps) => {
  return (
    <>
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
    </>
  );
};

export default ProjectDescriptionField;
