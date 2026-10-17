import type { BlogPost } from '../types';

const LOCAL_POSTS_URL = './posts.json';
const GITHUB_PAGES_POSTS_URL =
  'https://arnold-cd.github.io/blog-cms/posts.json';
const GITHUB_RAW_POSTS_URL =
  'https://raw.githubusercontent.com/Arnold-cd/blog-cms/main/posts.json';

/**
 * Resolves an asset URL (image, thumbnail) to relative './images/...' or GitHub Pages CDN,
 * bypassing GitHub raw 404s on private repositories.
 */
export function resolveAssetUrl(rawUrl: string | undefined): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  const rawBase = 'https://raw.githubusercontent.com/Arnold-cd/blog-cms/main';
  if (trimmed.startsWith(rawBase)) {
    const rel = trimmed.slice(rawBase.length).replace(/^\/?/, '');
    return `./${rel}`;
  }
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('./') && !trimmed.startsWith('/')) {
    return `./${trimmed}`;
  }
  return trimmed;
}

export async function fetchPosts(): Promise<BlogPost[]> {
  const timestamp = Date.now();
  const token = localStorage.getItem('github_cms_token');

  // 1. If user has a GitHub token, query GitHub API directly (real-time 0-second sync even on private repos)
  if (token && token.trim()) {
    try {
      const apiRes = await fetch(
        `https://api.github.com/repos/Arnold-cd/blog-cms/contents/posts.json?t=${timestamp}`,
        {
          headers: {
            Authorization: `Bearer ${token.trim()}`,
            Accept: 'application/vnd.github.v3+json',
          },
          cache: 'no-store',
        }
      );
      if (apiRes.ok) {
        const fileData = await apiRes.json();
        const decoded = decodeURIComponent(escape(atob(fileData.content.replace(/\s/g, ''))));
        const data = JSON.parse(decoded);
        if (Array.isArray(data)) {
          return data.map((p: BlogPost) => ({
            ...p,
            thumbnail_url: resolveAssetUrl(p.thumbnail_url),
          }));
        }
      }
    } catch (err) {
      console.warn('GitHub API authenticated posts.json fetch failed:', err);
    }
  }

  // 2. Try local posts.json (bundled static asset on GitHub Pages)
  try {
    const localRes = await fetch(`${LOCAL_POSTS_URL}?t=${timestamp}`, {
      cache: 'no-store',
    });
    if (localRes.ok) {
      const data = await localRes.json();
      if (Array.isArray(data)) {
        return data.map((p: BlogPost) => ({
          ...p,
          thumbnail_url: resolveAssetUrl(p.thumbnail_url),
        }));
      }
    }
  } catch (err) {
    console.warn('Local posts.json fetch failed:', err);
  }

  // 3. Try GitHub Pages CDN manifest (cache-busted)
  try {
    const ghPagesRes = await fetch(`${GITHUB_PAGES_POSTS_URL}?t=${timestamp}`, {
      cache: 'no-store',
    });
    if (ghPagesRes.ok) {
      const data = await ghPagesRes.json();
      if (Array.isArray(data)) {
        return data.map((p: BlogPost) => ({
          ...p,
          thumbnail_url: resolveAssetUrl(p.thumbnail_url),
        }));
      }
    }
  } catch (err) {
    console.warn('GitHub Pages CDN posts.json fetch failed:', err);
  }

  // 3. Try GitHub raw manifest
  try {
    const rawRes = await fetch(`${GITHUB_RAW_POSTS_URL}?t=${timestamp}`, {
      cache: 'no-store',
    });
    if (rawRes.ok) {
      const data = await rawRes.json();
      if (Array.isArray(data)) {
        return data.map((p: BlogPost) => ({
          ...p,
          thumbnail_url: resolveAssetUrl(p.thumbnail_url),
        }));
      }
    }
  } catch (err) {
    console.warn('GitHub raw posts.json fetch failed:', err);
  }

  // 4. Fallback to local posts.json (bundled static asset or offline mode)
  try {
    const res = await fetch(`${LOCAL_POSTS_URL}?t=${timestamp}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map((p: BlogPost) => ({
          ...p,
          thumbnail_url: resolveAssetUrl(p.thumbnail_url),
        }));
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
  let content = rawMarkdown.trim();

  // 1. Repeatedly strip all standard frontmatter blocks delimited by --- or +++
  const frontmatterRegex = /^(?:---|(?:\+\+\+))\s*[\r\n]+[\s\S]*?[\r\n]+(?:---|(?:\+\+\+))\s*/;
  while (frontmatterRegex.test(content)) {
    content = content.replace(frontmatterRegex, '').trim();
  }

  // 2. Strip any naked/un-delimited YAML metadata blocks at the start of the article
  const metadataKeyRegex = /^\s*(?:id|title|summary|date|author|category|thumbnail|language|featured|tags|slug)\s*:\s*.*$/i;
  const lines = content.split(/\r?\n/);
  let dropUntil = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '' || line === '---' || line === '***' || line === '___' || metadataKeyRegex.test(line)) {
      dropUntil = i + 1;
    } else {
      break;
    }
  }
  if (dropUntil > 0) {
    content = lines.slice(dropUntil).join('\n').trim();
  }

  // 3. Remove any metadata blocks collapsed onto one line
  const inlineMetadataBlockRegex = /(?:^|\n)\s*id:\s*["']?[^"'\n\r]+["']?(?:\s+(?:title|summary|date|author|category|thumbnail|language|featured|tags):\s*["']?[^"'\n\r]+["']?)+[^\n\r]*(?:\r?\n|$)/gi;
  content = content.replace(inlineMetadataBlockRegex, '\n');

  // 4. Remove any isolated id: "..." lines
  content = content.replace(/^\s*id\s*:\s*["']?[^"'\r\n]*["']?\s*$/gmi, '');

  return content.trim();
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
