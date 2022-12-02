import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

interface YoutubeProps {
    _offset: Offset;
}

interface Offset {
    indexed: boolean;
    value: Value<number>;
}

interface Value<T> {
    case: string;
    value: T;
}

export interface YoutubeObjectProps {
    properties: Properties;
}

export interface Properties {
    _description: Description;
    _image: Image;
    _title: Title;
    _url: Url;
}

export interface Description {
    indexed: boolean;
    value: Value<string>;
}

export interface Image {
    indexed: boolean;
    value: Value<string>;
}

export interface Title {
    indexed: boolean;
    value: Value<string>;
}

export interface Url {
    indexed: boolean;
    value: Value<string>;
}

export const askRouter = router({
    askQuestion: publicProcedure
        .input(z.object({ searchTerm: z.string().min(1) }).nullish())
        .query(async ({ input, ctx }) => {
            console.log("Returning answer", input?.searchTerm);
            try {
                const res = await ctx.operand.answer({
                    query: input?.searchTerm,
                });

                return res.answer?.answer ?? null;
            } catch (e) {
                console.error(e);
                console.error(
                    `Could not get awnser: ${input?.searchTerm} ${e}`
                );
                throw new TRPCError({
                    message: "Could not search for your term bozo",
                    code: "INTERNAL_SERVER_ERROR",
                });
            }
        }),
});
