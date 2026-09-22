import type { BlogPost } from '../types';

const LOCAL_POSTS_URL = './posts.json';
const GITHUB_RAW_POSTS_URL =
  'https://raw.githubusercontent.com/Arnold-cd/blog-cms/main/posts.json';

export async function fetchPosts(): Promise<BlogPost[]> {
  const timestamp = Date.now();

  // 1. Try real-time GitHub raw manifest first (cache-busted) so remote additions/deletions reflect immediately
  try {
    const rawRes = await fetch(`${GITHUB_RAW_POSTS_URL}?t=${timestamp}`, {
      cache: 'no-store',
    });
    if (rawRes.ok) {
      const data = await rawRes.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err) {
    console.warn('GitHub raw posts.json fetch failed, trying local fallback:', err);
  }

  // 2. Fallback to local posts.json (bundled static asset or offline mode)
  try {
    const res = await fetch(`${LOCAL_POSTS_URL}?t=${timestamp}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Local posts.json fetch failed:', err);
  }

  return [];
}

export async function fetchArticleMarkdown(contentUrl: string): Promise<string> {
  // If it's a draft URL, handle gracefully
  if (!contentUrl || contentUrl.startsWith('draft://')) {
    return '# Draft Content\n\nNo content provided for this draft.';
  }

  // 1. Try local relative path first
  const filename = contentUrl.split('/').pop();
  if (filename) {
    try {
      const localRes = await fetch(`./posts/${filename}`);
      if (localRes.ok) {
        const text = await localRes.text();
        return stripFrontmatter(text);
      }
    } catch {
      // ignore and try next
    }
  }

  // 2. Try direct contentUrl
  try {
    const res = await fetch(contentUrl);
    if (res.ok) {
      const text = await res.text();
      return stripFrontmatter(text);
    }
  } catch {
    // ignore and try next
  }

  // 3. Fallback to GitHub raw
  if (filename) {
    try {
      const rawGithubUrl = `https://raw.githubusercontent.com/Arnold-cd/blog-cms/main/posts/${filename}`;
      const res = await fetch(rawGithubUrl);
      if (res.ok) {
        const text = await res.text();
        return stripFrontmatter(text);
      }
    } catch {
      // ignore
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
