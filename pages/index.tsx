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
          <div key={id} style={{display: 'flex', justifyContent: 'space-between'}}>
            <Link href={link}>{title}</Link>
            <div>{date}</div>
          </div>
        ))}
      </div>
    </>
  )
}
