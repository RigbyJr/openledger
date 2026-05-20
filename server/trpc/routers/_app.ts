import { router } from "../trpc";
import { accountsRouter } from "./accounts";
import { categoriesRouter } from "./categories";
import { transactionsRouter } from "./transactions";
import { analyticsRouter } from "./analytics";

export const appRouter = router({
  accounts: accountsRouter,
  categories: categoriesRouter,
  transactions: transactionsRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
