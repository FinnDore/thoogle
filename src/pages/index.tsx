import { ArrowRightIcon } from "@radix-ui/react-icons";
import { type NextPage } from "next";
import { lazy, Suspense, useRef, useState } from "react";
import type { RouterOutputs } from "../utils/trpc";
import { trpc } from "../utils/trpc";

const Score = lazy(() => import("./_score"));

const Home: NextPage = () => {
    // React query sets data to undefined when the query changes / shrug
    const results = useRef<RouterOutputs["searchContent"]["search"] | null>(
        null
    );
    const [query, setQuery] = useState<string>("");
    const {
        refetch: search,
        isFetching,
        error,
    } = trpc.searchContent.search.useQuery(
        { searchTerm: query },
        {
            enabled: false,
            refetchOnWindowFocus: false,
            onError() {
                results.current = null;
            },
            onSuccess(data) {
                results.current = data;
            },
        }
    );

    return (
        <>
            <main className="flex h-screen flex-col ">
                <div className="mx-auto w-[90%] md:mx-auto md:w-auto">
                    <div className="mt-8 mb-4 flex justify-between text-4xl font-bold md:mt-[10vh]">
                        <div>
                            <div className="google text-xl font-normal line-through opacity-40">
                                Google
                            </div>{" "}
                            Thoogle
                        </div>
                        <div className="relative h-[4.5rem] w-full overflow-visible">
                            <picture>
                                <img
                                    className="absolute bottom-0 right-0 -mb-4 h-32"
                                    src="/theo.webp"
                                    alt="Picture of Theo looking happy"
                                />
                            </picture>
                        </div>
                    </div>
                    <div className="big-shadow min-3rem relative mb-12 flex h-20 w-full justify-center overflow-hidden rounded-2xl border border-[#C9C9C9]/30 bg-[#000]/60 shadow-2xl  md:w-[600px]">
                        <input
                            className="w-full rounded-2xl border border-none bg-transparent pl-8 text-2xl outline-none"
                            placeholder="Search Theo's channel"
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyUp={(e) => e.key === "Enter" && search()}
                        />
                        <button
                            className=" absolute right-0 flex h-full w-2/12 bg-transparent"
                            onClick={() => search()}
                        >
                            <ArrowRightIcon className="m-auto h-6 w-6 text-[#C9C9C9]/30 transition-colors hover:text-white" />
                        </button>
                    </div>

                    <div className="mb-auto">
                        {results.current?.map((result, i) => (
                            <div
                                key={result.url + i}
                                className="w-[90%] md:w-[600px]"
                            >
                                <iframe
                                    className="mb-4  aspect-video w-full "
                                    src={result.url}
                                    title={result.content}
                                    allowFullScreen
                                ></iframe>

                                <div className="mb-6 flex w-full justify-between text-sm opacity-50">
                                    <div>time: {result.offset}</div>

                                    <Suspense fallback={null}>
                                        <Score value={result.score} />
                                    </Suspense>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isFetching && (
                        <div>
                            <div className="mb-6 aspect-video w-full animate-pulse rounded-md bg-black/50"></div>
                            <div className="mb-6 aspect-video w-full animate-pulse rounded-md bg-black/50"></div>
                            <div className="mb-6 aspect-video w-full animate-pulse rounded-md bg-black/50"></div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mx-auto text-2xl font-bold text-red-700">
                        Failed to load search results
                    </div>
                )}
            </main>
        </>
    );
};

export default Home;
