
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { Table, TableHeader, TableHead, TableRow, TableCell, TableBody } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ContentEntry } from '@/services/content/contentService';

interface ContentListProps {
  content: ContentEntry[];
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, currentVisibility: boolean) => void;
}

const ContentList: React.FC<ContentListProps> = ({ content, onDelete, onToggleVisibility }) => {
  // Format the date string for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Format content type for display
  const formatType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Truncate long text for display
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Content Entries</h2>
        <Button asChild>
          <Link to="/admin/content/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Content
          </Link>
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-center">Visible</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No content entries found. Create your first entry to get started.
                </TableCell>
              </TableRow>
            ) : (
              content.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.title}</TableCell>
                  <TableCell>{formatType(entry.type)}</TableCell>
                  <TableCell>{truncateText(entry.content)}</TableCell>
                  <TableCell>{formatDate(entry.created_at)}</TableCell>
                  <TableCell>{formatDate(entry.updated_at)}</TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onToggleVisibility(entry.id!, !!entry.visible)}
                      title={entry.visible ? 'Make invisible' : 'Make visible'}
                    >
                      {entry.visible ? 
                        <Eye className="h-4 w-4" /> : 
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      }
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <Link to={`/admin/content/${entry.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(entry.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ContentList;
