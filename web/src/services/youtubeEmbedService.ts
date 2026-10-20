/**
 * YouTube Embed Utility for Web CMS and Article Reader
 */

/**
 * Extracts an 11-character YouTube video ID from various YouTube URL formats.
 */
export function extractYoutubeVideoId(url: string | undefined | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Direct 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Matches youtu.be, youtube.com/watch?v=, youtube.com/embed/, youtube.com/shorts/, etc.
  const regex = /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?.*?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const match = trimmed.match(regex);
  return match ? match[1] : null;
}

/**
 * Generates responsive YouTube iframe HTML snippet
 */
export function renderYoutubeEmbedHtml(videoId: string, title: string = 'YouTube video player'): string {
  const safeTitle = title.replace(/"/g, '&quot;');
  return `
<div class="video-embed-container">
  <iframe
    src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0"
    title="${safeTitle}"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
    loading="lazy"
  ></iframe>
</div>
`.trim();
}

/**
 * Transforms standalone YouTube links, markdown links, and iframes into responsive video players.
 */
export function transformMarkdownYoutubeEmbeds(markdown: string): string {
  if (!markdown) return '';

  const lines = markdown.split(/\r?\n/);
  const processedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Standalone raw YouTube URL on its own line
    // e.g. https://youtu.be/drINjNy-3K0?si=... or https://www.youtube.com/watch?v=...
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const videoId = extractYoutubeVideoId(trimmed);
      if (videoId && !trimmed.includes(' ')) {
        processedLines.push('\n' + renderYoutubeEmbedHtml(videoId) + '\n');
        continue;
      }
    }

    // 2. Standalone Markdown link with YouTube URL as href: [Title](https://youtu.be/...)
    const mdLinkMatch = trimmed.match(/^\[(.*?)\]\(((?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com|youtu\.be)[^\s)]+)\)$/i);
    if (mdLinkMatch) {
      const linkText = mdLinkMatch[1];
      const linkHref = mdLinkMatch[2];
      const videoId = extractYoutubeVideoId(linkHref);
      if (videoId) {
        processedLines.push('\n' + renderYoutubeEmbedHtml(videoId, linkText || 'YouTube video player') + '\n');
        continue;
      }
    }

    // 3. User syntax mistake: [https://youtu.be/...](https://) or [https://youtu.be/...]()
    const invertedMatch = trimmed.match(/^\[((?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com|youtu\.be)[^\s\]]+)\]\((?:https?:\/\/)?\)$/i);
    if (invertedMatch) {
      const videoId = extractYoutubeVideoId(invertedMatch[1]);
      if (videoId) {
        processedLines.push('\n' + renderYoutubeEmbedHtml(videoId) + '\n');
        continue;
      }
    }

    // 4. Standalone raw iframe embed without wrapper
    const iframeMatch = trimmed.match(/^<iframe.*?src=["'](?:https?:)?\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})[^"']*["'].*?<\/iframe>$/i);
    if (iframeMatch) {
      const videoId = iframeMatch[1];
      processedLines.push('\n' + renderYoutubeEmbedHtml(videoId) + '\n');
      continue;
    }

    processedLines.push(line);
  }

  return processedLines.join('\n');
}
