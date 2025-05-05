
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface ProjectDescriptionFieldProps {
  description: string;
  setDescription: (value: string) => void;
  involvement: string;
  setInvolvement: (value: string) => void;
  year: number;
  setYear: (value: number) => void;
}

const ProjectDescriptionField = ({
  description,
  setDescription,
  involvement,
  setInvolvement,
  year,
  setYear
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
        <Label htmlFor="year">Year *</Label>
        <Input
          id="year"
          type="number"
          value={year || ''}
          onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
          placeholder={new Date().getFullYear().toString()}
          required
        />
        <p className="text-xs text-muted-foreground">Year the project was created</p>
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
