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
            <a href={link}>{title}</a>
            <div>{date}</div>
          </div>
        ))}
      </div>
    </>
  )
}
