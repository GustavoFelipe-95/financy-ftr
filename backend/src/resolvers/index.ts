import { AuthResolver } from './auth.resolver';
import { HealthResolver } from './health.resolver';
import { CategoryResolver } from './category.resolver';
import { TransactionResolver } from './transaction.resolver';
import { UserResolver } from './user.resolver';

export const resolvers = [
    AuthResolver,
    HealthResolver,
    CategoryResolver,
    TransactionResolver,
    UserResolver
] as const;