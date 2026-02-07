import { ApiKey, Client } from "@prisma/client";

export type ApiKeyWithClient = ApiKey & { client: Client };

export interface GraphQLContext {
  apiKey: ApiKeyWithClient | null;
}
