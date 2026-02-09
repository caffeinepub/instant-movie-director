import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Project, ProjectId, UserProfile } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetAllUserProjects() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Project[]>({
    queryKey: ['userProjects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUserProjects();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateMovieProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Project) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createMovieProject(project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
    },
  });
}

export function useUpdateMovieProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, project }: { projectId: ProjectId; project: Project }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMovieProject(projectId, project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
    },
  });
}

export function useDeleteMovieProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: ProjectId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMovieProject(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
    },
  });
}
