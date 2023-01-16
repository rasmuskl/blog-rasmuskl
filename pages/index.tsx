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
          <div key={id}>
            <a href={link}>{title} ({date})</a>
          </div>
        ))}
      </div>
    </>
  )
}
