import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="th">
      <Head >
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
        <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
                
        {/* ✅ Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="font-prompt bg-gray-50 dark:bg-gray-800">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
