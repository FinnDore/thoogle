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

export const searchRouter = router({
    search: publicProcedure
        .input(z.object({ searchTerm: z.string().min(1) }).nullish())
        .query(async ({ input, ctx }) => {
            console.log("Returning results", input?.searchTerm);
            try {
                const res = await ctx.operand.searchWithin({
                    query: input?.searchTerm,
                });

                if (!res.matches) {
                    return null;
                }

                const results = res.matches.map((m) => {
                    const offset =
                        (m.extra?.properties as unknown as YoutubeProps)
                            ?._offset?.value?.value ?? null;
                    // Look the fuck away ok 🔫
                    const url =
                        (
                            res.objects[m.objectId]
                                ?.properties as unknown as YoutubeObjectProps
                        )?.properties?._url?.value?.value ??
                        "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
                    return {
                        embed:
                            url.replace("watch?v=", "embed/") +
                            "?start=" +
                            offset,
                        url: url + "&t=" + offset,
                        content: m.content,
                        score: m.score,
                        offset,
                    };
                });

                return results;
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
