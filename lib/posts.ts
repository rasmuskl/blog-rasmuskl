import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import dayjs, { Dayjs } from 'dayjs';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getPost(fileName: string) {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
        fileName,
        title: matterResult.data.title,
        content: matterResult.content,
        date: matterResult.data.date
    };
}


export function getPostsSlugs(): { fileName: string, slug: string, date: Dayjs }[] {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
      return {
        fileName,
        slug: matterResult.data.slug,
        date: dayjs(matterResult.data.date)
      };
    });
    
    return allPostsData;
}

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.mdx$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    const date = dayjs(matterResult.data.date);

    // Combine the data with the id
    return {
      id,
      date,
      link: `/${date.format('YYYY/MM/DD')}/${matterResult.data.slug}`, 
      ...matterResult.data,
    };
  });
  // Sort posts by date
  return allPostsData.sort((a: any, b: any) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}