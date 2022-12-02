import { Head, Html, Main, NextScript } from "next/document";

export default function document() {
    const isProd = process.env.NODE_ENV === "production";
    return (
        <Html>
            <title>Thoogle</title>
            <Head>
                {isProd && (
                    <script
                        async
                        defer
                        data-website-id="cb9fc9bb-db7c-4a30-a675-7a9b3052bedf"
                        src="https://umami.finndore.dev/umami.js"
                    ></script>
                )}

                <link rel="icon" href="/favicon.ico" />
                <meta
                    property="og:image"
                    content="https://thoogle.finndore.dev/api/og"
                />
                <meta
                    property="og:image"
                    content="https://thoogle.finndore.dev/cover.webp"
                />
                <meta name="twitter:card" content="summary_large_image"></meta>
            </Head>
            <body className=" bg-[#1e2022] text-white ">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
