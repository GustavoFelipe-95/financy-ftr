
// import { UserResolver } from './user.resolver';
// import { CategoryResolver } from './category.resolver';
// import { TransactionResolver } from './transaction.resolver';

import { AuthResolver } from './auth.resolver';
import { HealthResolver } from './health.resolver';


export const resolvers = [
    AuthResolver,
    HealthResolver,
] as const;