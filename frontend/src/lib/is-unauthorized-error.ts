import type { ApolloError } from "@apollo/client";

export function isUnauthorizedError(error: ApolloError) {
  if (
    error.networkError &&
    "statusCode" in error.networkError &&
    error.networkError.statusCode === 401
  ) {
    return true;
  }

  return error.graphQLErrors.some((graphQLError) => {
    const code = graphQLError.extensions?.code;

    return (
      code === "UNAUTHENTICATED" ||
      code === "UNAUTHORIZED" ||
      graphQLError.message === "Unauthorized"
    );
  });
}
