import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';

export function useCurrentUser() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: isProfileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  return {
    isAuthenticated,
    identity,
    userProfile,
    isProfileLoading,
    isFetched,
    userName: userProfile?.name,
  };
}
