import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure, router } from "../trpc";

export const exampleRouter = router({
    search: publicProcedure
        .input(z.object({ searchTerm: z.string() }).nullish())
        .query(async ({ input, ctx }) => {
            try {
                // const res = await ctx.operand.searchWithin({
                //     query: input?.searchTerm,
                // });

                // if (!res.matches) {
                //     return null;
                // }

                // console.log(res);
                return [
                    {
                        url: "https://www.youtube.com/embed/G1RtAmI0-vc?t=120",
                        score: 0.9,
                        offset: "1:20",
                    },
                    {
                        url: "https://www.youtube.com/embed/G1RtAmI0-vc?t=120",
                        score: 0.35,
                        offset: "1:20",
                    },
                    {
                        url: "https://www.youtube.com/embed/G1RtAmI0-vc?t=120",
                        score: 0.1,
                        offset: "1:20",
                    },
                ];
            } catch (e) {
                console.error(e);
                console.error(
                    `Could not search for term: ${input?.searchTerm} ${e}`
                );
                throw new TRPCError({
                    message: "Could not search for your term bozo",
                    code: "INTERNAL_SERVER_ERROR",
                });
            }
        }),
});
