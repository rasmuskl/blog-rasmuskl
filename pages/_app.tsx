import type { AppProps } from 'next/app'
import Head from 'next/head'
import Prism from "prismjs";
import React from 'react';

import 'sakura.css/css/normalize.css';
import 'sakura.css/css/sakura.css';
import 'prismjs/themes/prism-coy.css';

require("prismjs/components/prism-javascript");
require("prismjs/components/prism-css");
require("prismjs/components/prism-jsx");
require("prismjs/components/prism-csharp");
require("prismjs/components/prism-python");

export default function App({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>Blog</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
