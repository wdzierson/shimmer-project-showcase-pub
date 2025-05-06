
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPrompts } from '@/services/promptTrackingService';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Prompt {
  id: string;
  content: string;
  response_content: string | null;
  created_at: string;
  session_id: string | null;
  user_id: string | null;
}

const AdminPrompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    const loadPrompts = async () => {
      setLoading(true);
      try {
        const result = await fetchPrompts(itemsPerPage, page);
        setPrompts(result.prompts);
        setTotalCount(result.count || 0);
      } catch (error) {
        console.error('Error loading prompts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPrompts();
  }, [page]);

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(0, prevPage - 1));
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(totalCount / itemsPerPage) - 1;
    setPage((prevPage) => Math.min(maxPage, prevPage + 1));
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
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
          <h1 className="text-3xl font-semibold">User Prompts</h1>
          <p className="text-muted-foreground mt-1">
            View all user prompts sorted by most recent
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-md shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/6">Time</TableHead>
                    <TableHead className="w-2/6">User Prompt</TableHead>
                    <TableHead className="w-2/6">System Response</TableHead>
                    <TableHead className="w-1/6">Session ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prompts.length > 0 ? (
                    prompts.map((prompt) => (
                      <TableRow key={prompt.id}>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatDate(prompt.created_at)}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {prompt.content}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {prompt.response_content || "—"}
                        </TableCell>
                        <TableCell className="text-sm font-mono text-muted-foreground">
                          {prompt.session_id ? prompt.session_id.slice(0, 8) : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No prompts have been recorded yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalCount > itemsPerPage && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {page * itemsPerPage + 1} - {Math.min((page + 1) * itemsPerPage, totalCount)} of {totalCount} prompts
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={page === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={(page + 1) * itemsPerPage >= totalCount}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPrompts;
