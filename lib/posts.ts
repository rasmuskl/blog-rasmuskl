import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import dayjs, { Dayjs } from 'dayjs';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface Post {
  fileName: string;
  title: string;
  slug: string;
  date: string;
  link: string;
  content: string;
  year: string;
  month: string;
  day: string;
}

export function getPost(fileName: string): Post {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const post = buildPost(fileName, fileContents);
    return post;
}

function getLink(slug: string, date: Dayjs) {
    return `/${date.format('YYYY/MM/DD')}/${slug}`;
}

function buildPost(fileName: string, fileContents: string) {
  const matterResult = matter(fileContents);
  const date = dayjs(matterResult.data.date);
  const slug = matterResult.data.slug as string;
  const title = matterResult.data.title as string;

  return {
    fileName,
    date: date.format('DD/MM/YYYY'),
    slug,
    title,
    link: getLink(slug, date),
    content: fileContents,
    year: date.format('YYYY'),
    month: date.format('MM'),
    day: date.format('DD')
  };
}

export function getPostsSlugs(): Post[] {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return buildPost(fileName, fileContents);
    });
    
    return allPostsData;
}

export function getSortedPostsData(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
    const id = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return buildPost(fileName, fileContents);
  });

  return allPostsData.sort((a: any, b: any) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}