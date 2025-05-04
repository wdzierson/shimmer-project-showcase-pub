
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ProjectBasicInfoFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  client: string;
  setClient: (value: string) => void;
}

const ProjectBasicInfoFields = ({
  title,
  setTitle,
  client,
  setClient
}: ProjectBasicInfoFieldsProps) => {
  return (
    <>
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
    </>
  );
};

export default ProjectBasicInfoFields;
