import type { AppProps } from 'next/app'
import Head from 'next/head'
import Prism from "prismjs";
import React from 'react';

import 'sakura.css/css/normalize.css';
import 'sakura.css/css/sakura.css';
import 'prismjs/themes/prism-coy.css';
import '../styles/global.css';

import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-python';
import Layout from '../components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>Blog | rasmuskl</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
