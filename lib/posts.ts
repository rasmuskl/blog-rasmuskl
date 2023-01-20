import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import dayjs, { Dayjs } from 'dayjs';
import { Feed } from 'feed';
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const postsDirectory = path.join(process.cwd(), 'posts');

export interface Post extends PostMeta {
  content: string;
}

export interface PostMeta {
  fileName: string;
  title: string;
  slug: string;
  displayDate: string;
  link: string;
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
    displayDate: date.format('DD/MM/YYYY'),
    slug,
    title,
    link: getLink(slug, date),
    content: matterResult.content,
    year: date.format('YYYY'),
    month: date.format('MM'),
    day: date.format('DD')
  };
}

export function getPostsMeta(): PostMeta[] {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return buildPost(fileName, fileContents);
    }).map(convertToMeta);
    
    return sortPosts(allPostsData);
}

function convertToMeta(post: Post): PostMeta {
  let { content, ...postMeta } = post;
  return postMeta;
}

export function getPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
    const id = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return buildPost(fileName, fileContents);
  });

  return sortPosts(allPostsData);
}

function sortPosts<T extends PostMeta>(posts: T[]): T[] {
  return posts.sort((a: T, b: T) => {
    if (parseDayjs(a.displayDate) < parseDayjs(b.displayDate)) {
      return 1;
    } else {
      return -1;
    }
  });
}

function parseDayjs(date: string) {
  return dayjs.utc(date, 'DD-MM-YYYY');
}

export async function generateRssFeed() {
  const posts = getPosts();
  const siteUrl = "https://rasmuskl.dk";
  const date = new Date();
  const author = {
    name: "Rasmus Kromann-Larsen",
    email: "rasmus@kromann-larsen.dk",
    link: "https://twitter.com/rasmuskl",
  };
  const feed = new Feed({
    title: "rasmuskl",
    description: "",
    id: siteUrl,
    link: siteUrl,
    copyright: `All rights reserved ${date.getFullYear()}, Rasmus Kromann-Larsen`,
    updated: date,
    generator: "Feed for Node.js",
    feedLinks: {
      rss2: `${siteUrl}/rss/feed.xml`,
      json: `${siteUrl}/rss/feed.json`,
      atom: `${siteUrl}/rss/atom.xml`,
    },
    author,
  });
  posts.forEach((post) => {
    const url = `${siteUrl}/blog/${post.slug}`;

    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      content: post.content,
      author: [author],
      contributor: [author],
      date: parseDayjs(post.displayDate).toDate(),
    });
  })


  fs.mkdirSync("./public", { recursive: true });
  fs.writeFileSync("./public/feed.xml", feed.rss2());
  fs.writeFileSync("./public/atom.xml", feed.atom1());
  fs.writeFileSync("./public/feed.json", feed.json1());
}
