import type { BlogPost } from '../types';

const LOCAL_POSTS_URL = './posts.json';
const GITHUB_RAW_POSTS_URL =
  'https://raw.githubusercontent.com/Arnold-cd/blog-cms/main/posts.json';

export async function fetchPosts(): Promise<BlogPost[]> {
  try {
    // Try relative posts.json first (served by Vite or GitHub Pages)
    const res = await fetch(LOCAL_POSTS_URL);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Local posts.json fetch failed, falling back to GitHub raw URL', err);
  }

  // Fallback to GitHub raw
  const rawRes = await fetch(GITHUB_RAW_POSTS_URL);
  if (!rawRes.ok) {
    throw new Error(`Failed to load posts manifest (HTTP ${rawRes.status})`);
  }
  return await rawRes.json();
}

export async function fetchArticleMarkdown(contentUrl: string): Promise<string> {
  // If contentUrl is relative or remote, handle fetching
  try {
    const res = await fetch(contentUrl);
    if (res.ok) {
      const text = await res.text();
      return stripFrontmatter(text);
    }
  } catch (err) {
    console.warn(`Direct fetch for ${contentUrl} failed, trying raw fallback`, err);
  }

  // Fallback if contentUrl was a local relative path
  if (contentUrl.startsWith('posts/') || contentUrl.startsWith('./posts/')) {
    const rawGithubUrl = `https://raw.githubusercontent.com/Arnold-cd/blog-cms/main/${contentUrl.replace(/^\.\//, '')}`;
    const res = await fetch(rawGithubUrl);
    if (res.ok) {
      const text = await res.text();
      return stripFrontmatter(text);
    }
  }

  throw new Error('Unable to retrieve article markdown content.');
}

export function stripFrontmatter(rawMarkdown: string): string {
  // Regex to remove YAML block: leading --- ... ---
  const pattern = /^---\s*\n[\s\S]*?\n---\s*\n/;
  return rawMarkdown.replace(pattern, '').trim();
}

export function calculateReadingTime(markdownText: string): { words: number; minutes: number } {
  const clean = markdownText
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/[#*`_>~]/g, ' ')
    .trim();

  const words = clean ? clean.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return { words, minutes };
}

export function generateMarkdownWithFrontmatter(post: {
  id: string;
  title: string;
  summary: string;
  date: string;
  author: string;
  category: string;
  thumbnail: string;
  language: string;
  featured: boolean;
  content: string;
}): string {
  return `---
id: "${post.id.trim()}"
title: "${post.title.trim().replace(/"/g, '\\"')}"
summary: "${post.summary.trim().replace(/"/g, '\\"')}"
date: "${post.date.trim()}"
author: "${post.author.trim()}"
category: "${post.category.trim()}"
thumbnail: "${post.thumbnail.trim()}"
language: "${post.language.trim()}"
featured: ${post.featured ? 'true' : 'false'}
---

${post.content.trim()}
`;
}
