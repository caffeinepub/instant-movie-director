import { useState, useEffect } from 'react';
import { useCurrentUser } from '../auth/useCurrentUser';
import { useGetAllUserProjects, useCreateMovieProject, useUpdateMovieProject, useDeleteMovieProject } from '../../hooks/useQueries';
import { loadDraftFromLocalStorage, saveDraftToLocalStorage, clearDraftFromLocalStorage } from './localDraftStorage';
import { createEmptyProject } from '../workspace/state/projectDraft';
import type { ProjectDraft, RolePromptEntry } from '../workspace/types';
import type { Project, ProjectId, Prompt } from '../../backend';
import { toast } from 'sonner';

export function useProjects() {
  const { isAuthenticated, identity } = useCurrentUser();
  const { data: backendProjects = [], isLoading } = useGetAllUserProjects();
  const createProject = useCreateMovieProject();
  const updateProject = useUpdateMovieProject();
  const deleteProject = useDeleteMovieProject();

  const [currentProject, setCurrentProject] = useState<ProjectDraft>(createEmptyProject());
  const [currentProjectId, setCurrentProjectId] = useState<ProjectId | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      setIsAnonymous(false);
      if (backendProjects.length > 0) {
        const latest = backendProjects[0];
        setCurrentProject(convertBackendToLocal(latest));
        setCurrentProjectId(BigInt(0));
      } else {
        setCurrentProject(createEmptyProject());
        setCurrentProjectId(null);
      }
    } else {
      setIsAnonymous(true);
      const draft = loadDraftFromLocalStorage();
      setCurrentProject(draft || createEmptyProject());
      setCurrentProjectId(null);
    }
  }, [isAuthenticated, backendProjects]);

  useEffect(() => {
    if (isAnonymous && currentProject) {
      saveDraftToLocalStorage(currentProject);
    }
  }, [currentProject, isAnonymous]);

  const updateCurrentProject = (updated: ProjectDraft) => {
    setCurrentProject(updated);
  };

  const saveProject = async () => {
    if (!isAuthenticated || !identity) {
      toast.error('Please sign in to save projects');
      return;
    }

    try {
      const backendProject = convertLocalToBackend(currentProject, identity.getPrincipal());
      
      if (currentProjectId !== null && backendProjects.length > 0) {
        await updateProject.mutateAsync({
          projectId: BigInt(0),
          project: backendProject,
        });
        toast.success('Project updated');
      } else {
        const newId = await createProject.mutateAsync(backendProject);
        setCurrentProjectId(newId);
        toast.success('Project saved');
      }
    } catch (error) {
      toast.error('Failed to save project');
      console.error(error);
    }
  };

  const createNewProject = () => {
    const newProject = createEmptyProject();
    setCurrentProject(newProject);
    setCurrentProjectId(null);
    if (isAnonymous) {
      clearDraftFromLocalStorage();
    }
    toast.success('New project created');
  };

  const switchProject = (index: number) => {
    if (backendProjects[index]) {
      setCurrentProject(convertBackendToLocal(backendProjects[index]));
      setCurrentProjectId(BigInt(index));
    }
  };

  const deleteCurrentProject = async () => {
    if (!isAuthenticated || currentProjectId === null) {
      toast.error('Cannot delete this project');
      return;
    }

    try {
      await deleteProject.mutateAsync(BigInt(0));
      setCurrentProject(createEmptyProject());
      setCurrentProjectId(null);
      toast.success('Project deleted');
    } catch (error) {
      toast.error('Failed to delete project');
      console.error(error);
    }
  };

  return {
    currentProject,
    updateCurrentProject,
    saveProject,
    createNewProject,
    switchProject,
    deleteCurrentProject,
    backendProjects,
    isLoading,
    isAnonymous,
    isSaving: createProject.isPending || updateProject.isPending,
  };
}

function decodePromptLinkage(prompt: Prompt): { elementType?: string; elementId?: string; elementLabel?: string } {
  const match = prompt.title.match(/^\[([^:]+):([^\]]+)\]\s*(.+)$/);
  if (match) {
    const [, elementType, elementId, actualTitle] = match;
    return {
      elementType,
      elementId,
      elementLabel: actualTitle,
    };
  }
  return {};
}

function convertBackendToLocal(backend: Project): ProjectDraft {
  return {
    title: backend.title,
    logline: backend.logLine,
    synopsis: backend.synopsis,
    characters: [],
    locations: [],
    scenes: backend.scenes,
    rolePrompts: backend.prompts.map((p, i) => {
      const linkage = decodePromptLinkage(p);
      const cleanTitle = linkage.elementLabel || p.title;
      
      return {
        id: `prompt-${i}`,
        role: backend.roles[0] || 'Director',
        title: cleanTitle,
        content: p.promptText,
        systemMessage: p.systemMessage,
        elementType: linkage.elementType as any,
        elementId: linkage.elementId,
        elementLabel: linkage.elementLabel,
      };
    }),
    assembly: {
      outputType: 'feature-film',
      timeline: [],
    },
  };
}

function encodePromptLinkage(prompt: RolePromptEntry): string {
  if (prompt.elementType && prompt.elementId) {
    return `[${prompt.elementType}:${prompt.elementId}] ${prompt.title}`;
  }
  return prompt.title;
}

function convertLocalToBackend(local: ProjectDraft, user: any): Project {
  return {
    title: local.title,
    logLine: local.logline,
    synopsis: local.synopsis,
    scenes: local.scenes,
    roles: ['Director', 'Screenwriter', 'Cinematographer', 'Producer', 'Editor', 'Sound'],
    prompts: local.rolePrompts.map((p) => ({
      project: BigInt(0),
      title: encodePromptLinkage(p),
      promptText: p.content,
      systemMessage: p.systemMessage || undefined,
      promptType: { role: null } as any,
    })),
    user,
  };
}
