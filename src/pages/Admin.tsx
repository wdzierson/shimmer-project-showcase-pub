
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Project } from '@/components/project/ProjectCard';

// Mock data for projects (will be replaced with Supabase data)
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Included Health\'s Expert Physician Portal',
    client: 'Included Health',
    description: 'Physicians needed to evaluate patient conditions and make recommendations across a telehealth platform.',
    imageUrl: '/lovable-uploads/e818c6cd-0b7f-4e5a-a8b8-5a83f891d04c.png',
    tags: ['UX Research', 'UI Design', 'Healthcare'],
    createdAt: '2023-01-15',
  },
  {
    id: '2',
    title: 'Health Bridge Platform',
    client: 'HealthBridge',
    description: 'A platform connecting patients with healthcare providers for seamless virtual care experiences.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3',
    tags: ['UI Design', 'Frontend Development', 'Telehealth'],
    createdAt: '2023-03-22',
  },
  {
    id: '3',
    title: 'Medical Opinion Dashboard',
    client: 'RVO Health',
    description: 'A dashboard for medical professionals to manage and track patient opinions and feedback.',
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3',
    tags: ['Dashboard', 'Data Visualization', 'Healthcare'],
    createdAt: '2023-06-10',
  },
];

const Admin = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-medium">Projects Admin</h1>
            <Button asChild>
              <Link to="/admin/project/new">
                <Plus className="mr-2 h-4 w-4" /> Add Project
              </Link>
            </Button>
          </div>
          
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search projects..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="bg-card rounded-md border">
            <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm text-muted-foreground border-b">
              <div className="col-span-6">PROJECT</div>
              <div className="col-span-2">CLIENT</div>
              <div className="col-span-2">TAGS</div>
              <div className="col-span-2">ACTIONS</div>
            </div>
            
            <div className="divide-y">
              {filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
                  <div key={project.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                    <div className="col-span-6 flex items-center gap-4">
                      <div className="w-16 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm">{project.client}</span>
                    </div>
                    <div className="col-span-2">
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 flex gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/project/${project.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No projects found.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
