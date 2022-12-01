import { router } from "../trpc";
import { searchRouter } from "./search";

export const appRouter = router({
    searchContent: searchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
