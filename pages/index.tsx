import Link from 'next/link';
import { getSortedPostsData } from '../lib/posts';

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }: any) {
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
