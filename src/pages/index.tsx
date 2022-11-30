import { type NextPage } from "next";
import { useState } from "react";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
    const [query, setQuery] = useState<string>("");
    const { data, refetch: search } = trpc.example.hello.useQuery(
        { searchTerm: query },
        {
            enabled: false,
        }
    );

    return (
        <>
            <main className="grid h-screen place-items-center">
                <div className="big-shadow relative flex w-[90%] flex-col justify-center overflow-hidden rounded-2xl border border-[#C9C9C9]/30 bg-[#000]/60 shadow-2xl md:w-[600px]">
                    <div className="mb-6 -mt-6 flex justify-center">
                        Theooogle
                    </div>

                    <input
                        className="h-20 w-40 border border-[#C9C9C9]/30 bg-transparent"
                        placeholder="search for somthing"
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                search();
                                console.log(e.target);
                            }
                        }}
                    />
                </div>

                <pre>{JSON.stringify(data, null, 2)}</pre>
            </main>
        </>
    );
};

export default Home;
