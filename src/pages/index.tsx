import { ArrowRightIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { Switch, Thumb } from "@radix-ui/react-switch";
import { clsx } from "clsx";
import { type NextPage } from "next";
import { lazy, Suspense, useRef, useState } from "react";
import type { RouterOutputs } from "../utils/trpc";
import { trpc } from "../utils/trpc";

const Score = lazy(() => import("../components/_score"));
const TimeStamp = lazy(() => import("../components/_time-stamp"));

const Home: NextPage = () => {
    // React query sets data to undefined when the query changes / shrug
    const results = useRef<RouterOutputs["searchContent"]["search"] | null>(
        null
    );

    const answer = useRef<RouterOutputs["askQuestion"]["askQuestion"] | null>(
        null
    );

    const [hasSearched, setHasSearched] = useState(false);
    const [query, setQuery] = useState<string>("");
    const [questionMode, setQuestionMode] = useState<boolean>(true);

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
                setHasSearched(true);
            },
            onSuccess(data) {
                results.current = data;
                setHasSearched(true);
            },
        }
    );
    const {
        refetch: getAnswer,
        isFetching: isFetchingAnswer,
        isError: errorAnswer,
    } = trpc.askQuestion.askQuestion.useQuery(
        { searchTerm: query },
        {
            enabled: false,
            refetchOnWindowFocus: false,
            onError() {
                answer.current = null;
                setHasSearched(true);
            },
            onSuccess(data) {
                answer.current = data;
                setHasSearched(true);
            },
        }
    );

    const searchOrAnswer = () => {
        if (query?.length) {
            questionMode ? getAnswer() : search();
        }
    };

    const noAnswer =
        questionMode &&
        !isFetchingAnswer &&
        hasSearched &&
        !errorAnswer &&
        !answer.current;

    const noSearchResults =
        !questionMode &&
        !isFetching &&
        hasSearched &&
        !error &&
        !results.current?.length;

    return (
        <div className="h-screen">
            <main className="flex min-h-[calc(100%-4rem)] flex-col">
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
                    <div className="big-shadow min-3rem relative mb-4 flex h-20 w-full justify-center overflow-hidden rounded-2xl border border-[#C9C9C9]/30 bg-[#000]/60 shadow-2xl  md:w-[600px]">
                        <input
                            maxLength={50}
                            className="text-md w-full rounded-2xl border border-none bg-transparent pr-[16.666667%] pl-8 outline-none "
                            placeholder={
                                questionMode
                                    ? "Ask Theo a question"
                                    : "Search Theo's channel"
                            }
                            aria-label={
                                questionMode
                                    ? "Enter term to see a response from ai theo"
                                    : "Enter a term to Search Theo's channel"
                            }
                            aria-required="true"
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyUp={(e) =>
                                e.key === "Enter" && searchOrAnswer()
                            }
                        />
                        <button
                            className=" absolute right-0 flex h-full w-2/12 bg-transparent text-[#C9C9C9]/30 hover:text-white"
                            onClick={() => searchOrAnswer()}
                        >
                            <ArrowRightIcon className="m-auto h-6 w-6  transition-colors " />
                        </button>
                    </div>
                    <div className="mb-4 flex h-8 w-full ">
                        <Links />
                        <Switch
                            defaultChecked={true}
                            className="text relative ml-auto flex h-8 overflow-hidden rounded-md bg-[#000]/60 text-sm"
                            onCheckedChange={(e) => {
                                answer.current = null;
                                results.current = null;
                                setQuestionMode(e);
                                if (query)
                                    questionMode ? search() : getAnswer();
                            }}
                        >
                            <div
                                className={clsx(
                                    "my-auto w-[10ch] flex-1 px-2 transition-opacity",
                                    {
                                        "opacity-40": !questionMode,
                                    }
                                )}
                            >
                                Ask Theo
                            </div>
                            <div
                                className={clsx(
                                    "my-auto w-[10ch] flex-1 px-2 transition-opacity",
                                    {
                                        "opacity-40": questionMode,
                                    }
                                )}
                            >
                                Search
                            </div>
                            <Thumb
                                className={clsx(
                                    "absolute -top-1 my-1  h-full w-[10ch] bg-white/10 transition-transform",
                                    {
                                        "translate-x-full": !questionMode,
                                    }
                                )}
                            />
                        </Switch>
                    </div>

                    {questionMode && !isFetchingAnswer && answer.current && (
                        <div className="mb-auto w-[90%] px-4  md:w-[600px]">
                            <div className="mb-2 text-sm font-bold opacity-50">
                                Theo would probably say:
                            </div>
                            {answer.current}
                        </div>
                    )}
                    {noAnswer && (
                        <div className="w-full text-center">
                            Not quite sure what Theo would say. Try another
                            question.
                        </div>
                    )}
                    {noSearchResults && (
                        <div className="w-full text-center">
                            Not results found, try searching something else
                        </div>
                    )}

                    {!questionMode && !isFetching && (
                        <div className="mb-auto">
                            {results.current?.map((result, i) => (
                                <div
                                    key={result.embed + i}
                                    className="w-full md:w-[600px]"
                                >
                                    <iframe
                                        className="mb-4 aspect-video w-full rounded-md"
                                        src={result.embed}
                                        title={result.content}
                                        allowFullScreen
                                    ></iframe>

                                    <div className="mb-6 flex w-full justify-between text-sm opacity-50">
                                        <Suspense>
                                            <a
                                                href={result.url}
                                                className="underline"
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <TimeStamp
                                                    seconds={result.offset}
                                                />
                                            </a>
                                        </Suspense>

                                        <Suspense fallback={null}>
                                            <Score value={result.score} />
                                        </Suspense>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {((isFetching && !questionMode) ||
                        (isFetchingAnswer && questionMode)) && (
                        <div>
                            <div className="mb-6 aspect-video w-full animate-pulse rounded-md bg-black/50"></div>
                            {!questionMode && (
                                <>
                                    <div className="mb-6 aspect-video w-full animate-pulse rounded-md bg-black/50"></div>
                                    <div className="mb-6 aspect-video w-full animate-pulse rounded-md bg-black/50"></div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mx-auto text-2xl font-bold text-red-700">
                        Failed to load search results
                    </div>
                )}

                {errorAnswer && (
                    <div className="mx-auto text-2xl font-bold text-red-700">
                        Failed generate answer
                    </div>
                )}
            </main>
            <footer className="w-full pb-4 text-center">
                Made with ❤️ by{" "}
                <a
                    href="https://github.com/FinnDore"
                    aria-label="Link to Finns Github"
                    className="underline"
                    target="_blank"
                    rel="noreferrer"
                >
                    Finn
                </a>
            </footer>
        </div>
    );
};

const Links = () => (
    <div className="my-auto flex h-4">
        <a
            href="https://github.com/FinnDore/thoogle"
            className="theo-cursor mx-2 transition-all hover:contrast-200"
            aria-label="Link to the source code on github"
            target="_blank"
            rel="noreferrer"
        >
            <GitHubLogoIcon className="aspect-square h-full w-4" />
        </a>

        <a
            className="mx-2 transition-all hover:contrast-200"
            href="https://discord.gg/xHdCpcPHRE"
            aria-label="Link to Theo's discord"
            target="_blank"
            rel="noreferrer"
        >
            <picture>
                <img
                    src="discord.svg"
                    alt="The discord logo"
                    className="aspect-square h-full"
                />
            </picture>
        </a>
        <a
            className="mx-2 transition-all hover:contrast-200"
            href="https://twitter.com/t3dotgg"
            aria-label="Link to Theo's twitter"
            target="_blank"
            rel="noreferrer"
        >
            <picture>
                <img
                    src="twitter.svg"
                    alt="The twitter logo"
                    className="aspect-square h-full"
                />
            </picture>
        </a>
        <a
            className="mx-2 transition-all hover:contrast-200"
            href="https://www.youtube.com/c/theobrowne1017"
            aria-label="Link to Theo's youtube"
            target="_blank"
            rel="noreferrer"
        >
            <picture>
                <img
                    src="youtube.png"
                    alt="The youtube logo"
                    className="aspect-square h-full"
                />
            </picture>
        </a>
    </div>
);

export default Home;
