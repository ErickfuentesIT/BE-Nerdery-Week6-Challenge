import { GraphQLContext, ApiKeyWithClient } from "../types/context";

export function getAuthenticatedClient(context: GraphQLContext): ApiKeyWithClient {
  const { apiKey } = context;

  if (!apiKey) {
    throw new Error("Missing or invalid API Key");
  }

  return apiKey;
}
