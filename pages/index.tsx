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
      <main>
        <div className='post-list'>
          {allPostsData.map(({ id, date, slug, title}: any) => (
            <div key={id}>
              <a href={`/blog/${slug}`}>{title} ({date})</a>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
