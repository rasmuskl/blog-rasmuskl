import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Head from 'next/head'
import React from 'react';
import { YouTubeEmbed } from '../../../../components/YouTubeEmbed';
import { getPost, getPostsSlugs } from '../../../../lib/posts'

export async function getStaticPaths() {
    const slugs = getPostsSlugs();
    return {
        paths: slugs.map(s => ({
            params: {
                slug: s.slug,
                year: s.date.format('YYYY'),
                month: s.date.format('MM'),
                day: s.date.format('DD')
            }
        })),
        fallback: false
    }
}

const components = {
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
        <title>{props.title}</title>
      </Head>
      <div className="post">
        <h1>{props.title}</h1>
        <div>{props.date}</div>
        <MDXRemote compiledSource={props.source.compiledSource} components={components} />
      </div>
    </>
  )
}
