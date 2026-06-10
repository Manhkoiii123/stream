import {
  useClearSessionsMutation,
  useFindProfileQuery,
} from "@/graphql/generated/output";
import { useAuth } from "@/hooks/user-auth";

export function useCurrent() {
  const { isAuthenticated, exit } = useAuth();

  const { data, loading, refetch, error } = useFindProfileQuery({
    skip: !isAuthenticated,
  });
  const [clearSessions] = useClearSessionsMutation();
  if (error) {
    if (isAuthenticated) {
      clearSessions();
    }
    exit();
  }
  return {
    user: data?.findProfile,
    isLoadingProfile: loading,
    refetch,
  };
}
