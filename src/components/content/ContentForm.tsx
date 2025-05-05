
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface ContentFormProps {
  isNew: boolean;
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  type: string;
  setType: (type: string) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
}

const ContentForm: React.FC<ContentFormProps> = ({
  isNew,
  title,
  setTitle,
  content,
  setContent,
  type,
  setType,
  visible,
  setVisible,
  onCancel,
  onSubmit,
  isSaving
}) => {
  const contentTypes = [
    { label: 'Skill', value: 'skill' },
    { label: 'Background', value: 'background' },
    { label: 'Thought', value: 'thought' },
    { label: 'Experience', value: 'experience' },
    { label: 'Education', value: 'education' },
    { label: 'Other', value: 'other' }
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-card shadow-sm border rounded-lg p-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Content title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select 
              value={type} 
              onValueChange={setType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your content here..."
            rows={10}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch 
            id="visible" 
            checked={visible} 
            onCheckedChange={setVisible} 
          />
          <Label htmlFor="visible">Make this content visible to the chatbot</Label>
        </div>
      </div>

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
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          {isNew ? 'Create Content' : 'Update Content'}
        </Button>
      </div>
    </form>
  );
};

export default ContentForm;
