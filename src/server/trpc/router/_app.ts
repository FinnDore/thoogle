import { router } from "../trpc";
import { askRouter } from "./ask";
import { searchRouter } from "./search";

export const appRouter = router({
    searchContent: searchRouter,
    askQuestion: askRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
