import React, { useEffect, useState } from 'react';
import type { BlogPost } from '../types';
import { fetchArticleMarkdown } from '../services/cmsService';
import { ArrowLeft, Clock, Share2, Check, PenLine, Sparkles } from 'lucide-react';
import { marked } from 'marked';

interface ArticleViewProps {
  post: BlogPost;
  onBack: () => void;
  onEditDraft?: () => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ post, onBack, onEditDraft }) => {
  const [contentHtml, setContentHtml] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    if (post.content && post.content.trim()) {
      try {
        const parsed = marked.parse(post.content, { gfm: true, breaks: true }) as string;
        setContentHtml(parsed);
        setLoading(false);
        return;
      } catch (err: any) {
        setError(err.message || 'Failed to render markdown content');
        setLoading(false);
        return;
      }
    }

    fetchArticleMarkdown(post.content_url)
      .then((markdown) => {
        if (!isMounted) return;
        const parsed = marked.parse(markdown, { gfm: true, breaks: true }) as string;
        setContentHtml(parsed);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Failed to load article content.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [post]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`reader-container ${post.language === "mni" ? "lang-mni" : ""}`} lang={post.language || "en"}>
      {/* Draft Mode Pill */}
      {post.isDraft && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          padding: '0.65rem 1rem',
          marginBottom: '1.5rem',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-active)',
          borderRadius: 'var(--radius-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '0.82rem', fontWeight: 500 }}>
            <Sparkles size={15} color="var(--accent-cyan)" />
            <span>Draft Preview Mode &bull; Live in-memory render</span>
          </div>

          {onEditDraft && (
            <button
              onClick={onEditDraft}
              className="btn-primary"
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}
              id="btn-edit-draft-back"
            >
              <PenLine size={13} />
              <span>Continue Editing</span>
            </button>
          )}
        </div>
      )}

      {/* Reader Nav Bar */}
      <div className="reader-nav-bar">
        <button onClick={onBack} className="btn-ghost" id="btn-back-to-feed">
          <ArrowLeft size={16} />
          <span>Back to Articles</span>
        </button>

        <button onClick={handleShare} className="btn-secondary" id="btn-share-article">
          {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Share2 size={14} />}
          <span>{copied ? 'Link Copied' : 'Share'}</span>
        </button>
      </div>

      {/* Article Header */}
      <header>
        <div className="reader-header-meta">
          <span style={{ color: '#fff', fontWeight: 600 }}>{post.category}</span>
          <span>&bull;</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={13} />
            {post.reading_time_min} min read
          </span>
          <span>&bull;</span>
          <span>{post.language.toUpperCase()}</span>
        </div>

        <h1 className="reader-title">{post.title}</h1>

        <div className="reader-author-strip">
          <div className="reader-author-info">
            <div className="author-avatar-fallback">
              {post.author.charAt(0)}
            </div>
            <div>
              <div className="author-name">{post.author}</div>
              <div className="publish-date">{formatDate(post.date)}</div>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        {post.thumbnail_url && (
          <div className="reader-hero-wrap">
            <img
              src={post.thumbnail_url}
              alt={post.title}
              className="reader-hero-img"
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = 'images/banner-philosophy.svg';
              }}
            />
          </div>
        )}
      </header>

      {/* Article Content */}
      <article>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <p>Loading article content...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '2rem', background: 'rgba(244, 63, 94, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-rose)', color: 'var(--accent-rose)' }}>
            <strong>Error loading content:</strong> {error}
          </div>
        ) : (
          <div
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
            id="reader-markdown-content"
          />
        )}
      </article>
    </div>
  );
};
