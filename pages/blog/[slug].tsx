import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Head from 'next/head'
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
        <h1>{props.title}</h1>
        <div>{props.date}</div>
        <MDXRemote compiledSource={props.source.compiledSource} />
      </main>
    </>
  )
}
