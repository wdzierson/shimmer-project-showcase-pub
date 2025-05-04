
import React from 'react';
import ProjectEditorHeader from '@/components/project-editor/ProjectEditorHeader';
import ProjectEditorForm from '@/components/project-editor/ProjectEditorForm';
import { useProjectData } from '@/hooks/useProjectData';
import { saveProject } from '@/services/projectService';

const ProjectEditor = () => {
  const {
    isNew,
    id,
    loading,
    projectData,
    handleAddTag,
    handleRemoveTag,
    navigate
  } = useProjectData();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await saveProject({
      id,
      title: projectData.title,
      client: projectData.client,
      description: projectData.description,
      imageUrl: projectData.imageUrl,
      liveUrl: projectData.liveUrl,
      involvement: projectData.involvement,
      tags: projectData.tags,
      isNew
    });
    
    if (success) {
      navigate('/admin/projects');
    }
  };

  const handleCancel = () => {
    navigate('/admin/projects');
  };
  
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto py-8 px-4">
        <ProjectEditorHeader isNew={isNew} />
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Loading project data...</div>
          </div>
        ) : (
          <div className="max-w-3xl">
            <ProjectEditorForm
              isNew={isNew}
              title={projectData.title}
              setTitle={projectData.setTitle}
              client={projectData.client}
              setClient={projectData.setClient}
              description={projectData.description}
              setDescription={projectData.setDescription}
              imageUrl={projectData.imageUrl}
              setImageUrl={projectData.setImageUrl}
              liveUrl={projectData.liveUrl}
              setLiveUrl={projectData.setLiveUrl}
              involvement={projectData.involvement}
              setInvolvement={projectData.setInvolvement}
              tags={projectData.tags}
              setTags={projectData.setTags}
              newTag={projectData.newTag}
              setNewTag={projectData.setNewTag}
              handleAddTag={handleAddTag}
              handleRemoveTag={handleRemoveTag}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectEditor;
