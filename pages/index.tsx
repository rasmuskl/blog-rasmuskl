import Link from 'next/link';
import { generateRssFeed, getSortedPostsData, Post } from '../lib/posts';

export async function getStaticProps() {
  await generateRssFeed();
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData
    },
  };
}

export default function Home({ allPostsData }: { allPostsData: Post[] }) {
  return (
    <>
      <div className='post-list'>
        {allPostsData.map(({ id, date, link, title}: any) => (
          <div key={id} className="post-list-item">
            <Link href={link}>{title}</Link>
            <div className='post-list-item-date'>{date}</div>
          </div>
        ))}
      </div>
    </>
  )
}
