import { router } from "../trpc";
import { exampleRouter } from "./search";

export const appRouter = router({
    example: exampleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
