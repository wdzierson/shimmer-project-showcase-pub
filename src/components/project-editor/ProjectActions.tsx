
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';

interface ProjectActionsProps {
  isNew: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving?: boolean;
}

const ProjectActions = ({
  isNew,
  onCancel,
  onSubmit,
  isSaving = false
}: ProjectActionsProps) => {
  return (
    <div className="flex justify-end space-x-4 pt-4">
      <Button 
        variant="outline" 
        type="button" 
        onClick={onCancel}
        disabled={isSaving}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSaving}
        onClick={(e) => onSubmit(e)}
      >
        {isSaving ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Check className="mr-2 h-4 w-4" />
        )}
        {isNew ? 'Create Project' : 'Update Project'}
      </Button>
    </div>
  );
};

export default ProjectActions;
