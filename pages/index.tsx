import Link from 'next/link';
import { generateRssFeed, getPostsMeta, PostMeta } from '../lib/posts';

export async function getStaticProps() {
  await generateRssFeed();
  const allPostsData = getPostsMeta();
  return {
    props: {
      allPostsData
    },
  };
}

export default function Home({ allPostsData }: { allPostsData: PostMeta[] }) {
  return (
    <>
      <div className='post-list'>
        {allPostsData.map(({ slug, displayDate, link, title}) => (
          <div key={slug} className="post-list-item">
            <Link href={link}>{title}</Link>
            <div className='post-list-item-date'>{displayDate}</div>
          </div>
        ))}
      </div>
    </>
  )
}
