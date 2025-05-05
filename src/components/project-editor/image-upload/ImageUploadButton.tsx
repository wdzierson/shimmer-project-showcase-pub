
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';

interface ImageUploadButtonProps {
  onFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

const ImageUploadButton = ({ onFileSelected, isUploading }: ImageUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={handleUploadClick}
        disabled={isUploading}
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload Image
      </Button>
      <Input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/png,image/jpeg,image/webp"
        onChange={onFileSelected}
        disabled={isUploading}
      />
    </>
  );
};

export default ImageUploadButton;
