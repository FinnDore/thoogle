import {
    indexIDHeaderKey,
    ObjectService,
    operandClient,
} from "@operandinc/sdk";
import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { env } from "../../env/server.mjs";

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type CreateContextOptions = Record<string, never>;

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (_opts: CreateContextOptions) => {
    const operand = operandClient(
        ObjectService,
        env.OPERAND_API_KEY,
        "https://api.operand.ai",
        {
            [indexIDHeaderKey]: env.OPERAND_INDEX_ID,
        }
    );
    return { operand };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (_opts: CreateNextContextOptions) => {
    return await createContextInner({});
};

export type Context = inferAsyncReturnType<typeof createContext>;
