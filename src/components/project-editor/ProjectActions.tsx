
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface ProjectActionsProps {
  isNew: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ProjectActions = ({
  isNew,
  onCancel,
  onSubmit
}: ProjectActionsProps) => {
  return (
    <div className="flex justify-end space-x-4 pt-4">
      <Button variant="outline" type="button" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        <Check className="mr-2 h-4 w-4" />
        {isNew ? 'Create Project' : 'Update Project'}
      </Button>
    </div>
  );
};

export default ProjectActions;
