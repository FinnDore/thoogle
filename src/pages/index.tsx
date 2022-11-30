import { ArrowRightIcon } from "@radix-ui/react-icons";
import { type NextPage } from "next";
import { lazy, Suspense, useState } from "react";

import { trpc } from "../utils/trpc";

const Score = lazy(() => import("./_score"));

const Home: NextPage = () => {
    const [query, setQuery] = useState<string>("");
    const { data, refetch: search } = trpc.example.search.useQuery(
        { searchTerm: query },
        {
            enabled: true,
        }
    );

    return (
        <>
            <main className="grid h-screen place-items-center items-center">
                <div className="big-shadow min-3rem relative mt-8 mb-12 flex h-20 w-[90%] justify-center overflow-hidden rounded-2xl border border-[#C9C9C9]/30 bg-[#000]/60 shadow-2xl md:mt-[15vh] md:w-[600px]">
                    <input
                        className="w-full border border-[#C9C9C9]/30 bg-transparent pl-8 text-2xl"
                        placeholder="search for a term"
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyUp={(e) => e.key === "Enter" && search()}
                        value={"what is vercel"}
                    />
                    <button className=" absolute right-0 flex h-full w-2/12 bg-transparent">
                        <ArrowRightIcon className="m-auto w-6 text-[#C9C9C9]/30 transition-colors hover:text-white" />
                    </button>
                </div>

                <div>
                    {data?.map((result) => (
                        <div key={result.url} className="w-[90%] md:w-[600px]">
                            <iframe
                                className="mb-4  aspect-video w-full "
                                src={result.url}
                                title={result.url}
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
            </main>
        </>
    );
};

export default Home;
