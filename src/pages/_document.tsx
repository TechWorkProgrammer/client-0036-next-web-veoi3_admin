import {Html, Head, Main, NextScript} from 'next/document';
import React from "react";

export default function Document() {
    const APP_URL = "https://admin.veoi3.app";
    const APP_DESCRIPTION = "Generate stunning, high-quality videos from simple text or images using cutting-edge generative AI. Integrated with Web3 for a seamless creative economy.";

    return (
        <Html lang="en">
            <Head>
                <meta charSet="UTF-8"/>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <meta name="description" content={APP_DESCRIPTION}/>
                <meta name="author" content="fnrafa"/>
                <link rel="canonical" href={APP_URL}/>

                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
                      rel="stylesheet"/>
            </Head>
            <body className="bg-background-dark text-white antialiased">
            <Main/>
            <NextScript/>
            </body>
        </Html>
    );
}