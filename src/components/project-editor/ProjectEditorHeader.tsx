
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ProjectEditorHeaderProps {
  isNew: boolean;
}

const ProjectEditorHeader = ({ isNew }: ProjectEditorHeaderProps) => {
  return (
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
  );
};

export default ProjectEditorHeader;
