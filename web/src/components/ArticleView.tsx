import React, { useEffect, useState } from 'react';
import type { BlogPost } from '../types';
import { fetchArticleMarkdown } from '../services/cmsService';
import { ArrowLeft, Clock, Calendar, User, Share2, Check, Sparkles, Edit3 } from 'lucide-react';
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

    // 1. If content is already in memory (draft preview from CMS Studio or cached)
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

    // 2. Otherwise, fetch from content_url
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
    <div className="reader-view">
      {/* Draft Preview Indicator Banner */}
      {post.isDraft && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.75rem',
          background: 'rgba(56, 189, 248, 0.12)',
          border: '1px solid var(--border-active)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-glow)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontSize: '0.9rem', fontWeight: 600 }}>
            <Sparkles size={18} />
            <span>Draft Preview Mode &bull; Live in-memory render from CMS Studio</span>
          </div>

          {onEditDraft && (
            <button
              onClick={onEditDraft}
              className="btn-primary"
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', gap: '0.35rem' }}
              id="btn-edit-draft-back"
            >
              <Edit3 size={14} />
              <span>Continue Editing in Studio</span>
            </button>
          )}
        </div>
      )}

      {/* Top Bar Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button onClick={onBack} className="reader-back-btn" id="btn-reader-back" style={{ marginBottom: 0 }}>
          <ArrowLeft size={16} />
          <span>Back to Articles</span>
        </button>

        <button onClick={handleShare} className="reader-back-btn" id="btn-reader-share" style={{ marginBottom: 0 }}>
          {copied ? <Check size={16} color="var(--accent-emerald)" /> : <Share2 size={16} />}
          <span>{copied ? 'Link Copied' : 'Share'}</span>
        </button>
      </div>

      <header className="reader-header">
        {post.thumbnail_url && (
          <div className="reader-banner-wrap">
            <img
              src={post.thumbnail_url}
              alt={post.title}
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = 'images/banner-philosophy.svg';
              }}
            />
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          {post.featured && (
            <span className="badge-featured">
              <Sparkles size={13} /> Featured
            </span>
          )}
          <span className="badge-category">{post.category}</span>
          <span className="card-lang-badge" style={{ position: 'static' }}>
            {post.language.toUpperCase()}
          </span>
        </div>

        <h1 className="reader-title">{post.title}</h1>

        <div className="reader-meta-bar">
          <span className="reader-meta-item">
            <User size={16} />
            {post.author}
          </span>
          <span className="reader-meta-item">
            <Calendar size={16} />
            {formatDate(post.date)}
          </span>
          <span className="reader-meta-item">
            <Clock size={16} />
            {post.reading_time_min} min read
          </span>
        </div>
      </header>

      {loading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Loading article content...</p>
        </div>
      ) : error ? (
        <div style={{ padding: '3rem', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--accent-rose)', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ color: 'var(--accent-rose)', marginBottom: '0.5rem' }}>Failed to render article</h3>
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
        </div>
      ) : (
        <article
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      )}
    </div>
  );
};
