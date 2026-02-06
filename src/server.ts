import express, { Application, Request } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './resolvers/products.resolver';
import { validateApiKeyFromHeader } from './middlewares/api-key.middleware';
import { formatError } from './utils/errors';
import { GraphQLContext } from './types/context';
import apiKeyRoute from './routes/api-key.route';

dotenv.config();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

async function start() {
  const app: Application = express();
  app.use(cors());

  // Routes
  app.use('/api/key', apiKeyRoute);

  // GraphQL server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }: { req: Request }): Promise<GraphQLContext> => {
      try {
        const apiKey = await validateApiKeyFromHeader(req);
        return { apiKey };
      } catch (error) {
        console.error(formatError('Error building GraphQL context', error));
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
