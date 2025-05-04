
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ProjectUrlFieldProps {
  liveUrl: string;
  setLiveUrl: (value: string) => void;
}

const ProjectUrlField = ({
  liveUrl,
  setLiveUrl
}: ProjectUrlFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="liveUrl">Live Project URL</Label>
      <Input
        id="liveUrl"
        value={liveUrl}
        onChange={(e) => setLiveUrl(e.target.value)}
        placeholder="https://example.com"
      />
    </div>
  );
};

export default ProjectUrlField;
