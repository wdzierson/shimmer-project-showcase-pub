
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminProjects from "./pages/AdminProjects"; 
import ProjectEditor from "./pages/ProjectEditor";
import NotFound from "./pages/NotFound";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  // Setup database on first load
  useEffect(() => {
    const setupDb = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('setup-db');
        if (error) {
          console.error('Error setting up database:', error);
        } else {
          console.log('Database setup complete:', data);
        }
        
        // Check if OpenAI API key is set
        try {
          // Using a safer approach to check API key status
          const { error: checkError } = await supabase.functions.invoke('check-openai-key');
          if (checkError) {
            toast.warning(
              'OpenAI API key is not configured. Some AI features might not work properly.',
              {
                duration: 8000,
              }
            );
          }
        } catch (error) {
          console.error('Error checking OpenAI key:', error);
        }
      } catch (error) {
        console.error('Error in setup process:', error);
      }
    };
    
    setupDb();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route path="/admin/project/:id" element={<ProjectEditor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
