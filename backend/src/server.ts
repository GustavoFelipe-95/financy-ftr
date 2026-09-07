import 'dotenv/config';
import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSchema } from 'type-graphql';
import { resolvers } from './resolvers/index';
import { prisma, createContext } from './context';
import { AuthService } from './services/auth.service';
import { CategoryService } from './services/category.service';
import { TransactionService } from './services/transaction.service';

const authService = new AuthService(prisma);
const categoryService = new CategoryService(prisma);
const transactionService = new TransactionService(prisma);
const contextFn = createContext(authService, categoryService, transactionService);
 
const start = async () => {
  const schema = await buildSchema({
    resolvers: [...resolvers],
  });

  const server = new ApolloServer({ schema });

  const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT ? parseInt(process.env.PORT) : 3001 },
    context: contextFn,
  });

  console.log(`🚀  Server ready at: ${url}`);
};

start();
