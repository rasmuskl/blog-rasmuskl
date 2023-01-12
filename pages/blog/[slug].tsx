import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Head from 'next/head'
import React from 'react';
import { getPost, getPostsSlugs } from '../../lib/posts'

export async function getStaticPaths() {
    const slugs = getPostsSlugs();
    return {
        paths: slugs.map(s => ({
            params: {
                slug: s.slug,
            }
        })),
        fallback: false
    }
}

function YouTubeEmbed(props: { id: string }) {
  return (
    <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}>
      <iframe style={{ position: 'absolute', width: '100%', height: '100%'}} src={`//youtube.com/embed/${props.id}`} frameBorder={0} allowFullScreen={true} />
    </div>
  );
}

function TestButton() {
  const [x, setX] = React.useState(false);
  return (
    <div onClick={() => setX(!x)} style={{border: '1px solid #fff'}}>Test button {x ? 'ON' : 'OFF'}</div>
  )
}

const components = {
  TestButton,
  YouTubeEmbed
};


export async function getStaticProps(context: any) {
    const slugs = getPostsSlugs();
    const current = slugs.find(x => x.slug === context.params.slug)!;
    const post = getPost(current.fileName);
    const source = await serialize(post.content);
    return {
        props: {
            source,
            ...post
        },
    }
}

export default function Post(props: any) {
  return (
    <>
      <Head>
        <title>Blog</title>
      </Head>
      <main>
        <div className="post">
          <h1>{props.title}</h1>
          <div>{props.date}</div>
          <MDXRemote compiledSource={props.source.compiledSource} components={components} />
        </div>
      </main>
    </>
  )
}
