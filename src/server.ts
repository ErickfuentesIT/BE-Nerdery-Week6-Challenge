import express, { Application, Request } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './resolvers/products.resolver';
import { validateApiKeyFromHeader } from './middlewares/api-key.middleware';
import cookieParser from 'cookie-parser';
import { ApiKeyService } from './services/api-key.service';
import { GraphQLContext } from './types/context';

dotenv.config();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

async function start() {
  const app: Application = express();
  app.use(cors());
  app.use(cookieParser());

  // PUBLIC: get API key by client id
  app.get('/api/key/:clientId', express.json(), async (req, res) => {
    try {
      const clientId = req.params.clientId;
      if (!clientId) return res.status(400).json({ message: 'Missing clientId' });
      const apiKey = await ApiKeyService.findByClientId(clientId);
      if (!apiKey) return res.status(404).json({ message: 'API key not found' });
      return res.json({ key: apiKey.key, expiration: apiKey.expiration });
    } catch (error) {
      console.error('Error fetching API key:', error instanceof Error ? error.message : error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // GraphQL server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }: { req: Request }): Promise<GraphQLContext> => {
      try {
        const apiKey = await validateApiKeyFromHeader(req);
        return { apiKey };
      } catch (error) {
        console.error('Error building GraphQL context:', error instanceof Error ? error.message : error);
        return { apiKey: null };
      }
    },
  });

  await server.start();
  server.applyMiddleware({ app: app as any, path: '/graphql' });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
