import {
  useClearSessionsMutation,
  useFindProfileQuery,
} from "@/graphql/generated/output";
import { useAuth } from "@/hooks/user-auth";
import { isUnauthorizedError } from "@/lib/is-unauthorized-error";
import { useEffect } from "react";

export function useCurrent() {
  const { isAuthenticated, exit } = useAuth();

  const { data, loading, refetch, error } = useFindProfileQuery({
    skip: !isAuthenticated,
  });
  const [clearSessions] = useClearSessionsMutation();

  useEffect(() => {
    if (!error || !isUnauthorizedError(error)) return;

    if (isAuthenticated) {
      clearSessions();
    }
    exit();
  }, [error, isAuthenticated, clearSessions, exit]);

  return {
    user: data?.findProfile,
    isLoadingProfile: loading,
    refetch,
  };
}
