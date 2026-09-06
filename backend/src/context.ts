import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { AuthService } from "./services/auth.service";
import { CategoryService } from "./services/category.service";
import { TransactionService } from "./services/transaction.service";
import { verifyAuthToken } from "./utils/authenticate";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });

export interface Context {
    prisma: PrismaClient;
    authService: AuthService;
    categoryService: CategoryService;
    transactionService: TransactionService;
    user: { id: string } | null;
}

export function createContext(
  authService: AuthService,
  categoryService: CategoryService,
  transactionService: TransactionService
) {
    return async ({req}: any): Promise<Context> => {
      const token = req.headers.authorization || "";
      let user = null;

      if (token) {
        const bearer = token.startsWith("Bearer ") ? token.slice(7) : token;
        const decoded = verifyAuthToken(bearer);
        if (decoded) {
          user = { id: decoded.userID };
        }
      }

      return { prisma, authService, categoryService, transactionService, user };
    };
};