import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Head from 'next/head'
import React from 'react';
import { YouTubeEmbed } from '../../../../components/YouTubeEmbed';
import { getPost, getPostsSlugs, Post } from '../../../../lib/posts'
import rehypePrism from '@mapbox/rehype-prism';

export async function getStaticPaths() {
    const slugs = getPostsSlugs();
    return {
        paths: slugs.map(s => ({
            params: s
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
    
    const serialized = await serialize(post.content, { 
      mdxOptions: { 
        rehypePlugins: [rehypePrism] 
      } 
    });

    return {
        props: {
          source: serialized.compiledSource,
          ...post,
        },
    }
}

export default function PostSlug(props: { source: string } & Post) {
  return (
    <>
      <Head>
        <title>{`${props.title} | rasmuskl`}</title>
      </Head>
      <div className="post">
        <h1>{props.title}</h1>
        <div>{props.date}</div>
        <MDXRemote compiledSource={props.source} components={components} />
      </div>
    </>
  )
}
