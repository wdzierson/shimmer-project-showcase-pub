
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface ProjectTagsFieldProps {
  tags: string[];
  newTag: string;
  setNewTag: (value: string) => void;
  handleAddTag: () => void;
  handleRemoveTag: (tag: string) => void;
}

const ProjectTagsField = ({
  tags,
  newTag,
  setNewTag,
  handleAddTag,
  handleRemoveTag
}: ProjectTagsFieldProps) => {
  return (
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
  );
};

export default ProjectTagsField;
