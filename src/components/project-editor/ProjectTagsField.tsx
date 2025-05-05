
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch all existing tags from the database
  useEffect(() => {
    const fetchExistingTags = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('tags')
          .select('name')
          .order('name');
          
        if (error) {
          console.error('Error fetching tags:', error);
          return;
        }
        
        // Extract tag names and filter out ones already selected
        const existingTags = data.map(tag => tag.name);
        const filteredTags = existingTags.filter(tag => !tags.includes(tag));
        
        setSuggestedTags(filteredTags);
      } catch (error) {
        console.error('Error in tag fetch process:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExistingTags();
  }, [tags]);
  
  // Function to select a suggested tag
  const handleSelectTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setNewTag('');
      // Update the tags array with the selected tag
      handleAddTag();
      
      // Wait for the state update to complete
      setTimeout(() => {
        setNewTag(tag);
      }, 0);
    }
  };
  
  // Filter suggested tags based on what the user is typing
  const filteredSuggestions = newTag.trim()
    ? suggestedTags.filter(tag => 
        tag.toLowerCase().includes(newTag.toLowerCase()) && 
        !tags.includes(tag)
      )
    : suggestedTags.filter(tag => !tags.includes(tag));

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
      
      {/* Show suggested tags that aren't already selected */}
      {suggestedTags.length > 0 && (
        <div className="mb-2">
          <div className="text-sm text-muted-foreground mb-1">Suggested tags:</div>
          <div className="flex flex-wrap gap-1">
            {filteredSuggestions.slice(0, 10).map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="cursor-pointer hover:bg-secondary"
                onClick={() => handleSelectTag(tag)}
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
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
