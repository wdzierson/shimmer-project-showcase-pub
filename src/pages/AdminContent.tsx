
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ContentList from '@/components/content/ContentList';
import { ContentEntry, fetchAllContent, deleteContent, saveContentEntry } from '@/services/content/contentService';

const AdminContent = () => {
  const [content, setContent] = useState<ContentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load all content entries
  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const data = await fetchAllContent();
        setContent(data);
      } catch (error) {
        console.error('Error loading content:', error);
        toast.error('Failed to load content entries');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Handle content deletion
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this content entry?')) {
      try {
        const success = await deleteContent(id);
        if (success) {
          setContent(content.filter(entry => entry.id !== id));
          toast.success('Content entry deleted successfully');
        } else {
          toast.error('Failed to delete content entry');
        }
      } catch (error) {
        console.error('Error deleting content:', error);
        toast.error('An error occurred while deleting the content');
      }
    }
  };

  // Handle toggling content visibility
  const handleToggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      const entryToUpdate = content.find(entry => entry.id === id);
      if (!entryToUpdate) return;

      const result = await saveContentEntry({
        ...entryToUpdate,
        visible: !currentVisibility,
        isNew: false
      });

      if (result) {
        // Update local state to reflect the change
        setContent(content.map(entry => 
          entry.id === id ? { ...entry, visible: !currentVisibility } : entry
        ));
        
        toast.success(`Content is now ${!currentVisibility ? 'visible' : 'hidden'}`);
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update content visibility');
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin
            </Link>
          </Button>
          <h1 className="text-3xl font-semibold">Content Management</h1>
          <p className="text-muted-foreground mt-1">
            Add and manage your content entries for the RAG chatbot
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Loading content entries...</div>
          </div>
        ) : (
          <ContentList 
            content={content} 
            onDelete={handleDelete}
            onToggleVisibility={handleToggleVisibility}
          />
        )}
      </div>
    </div>
  );
};

export default AdminContent;
