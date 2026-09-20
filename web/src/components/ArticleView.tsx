import React, { useEffect, useState, useMemo } from 'react';
import type { BlogPost } from '../types';
import { fetchArticleMarkdown } from '../services/cmsService';
import { translateMarkdownToMeeteiMayek, translateToMeeteiMayekWithVocab } from '../services/meeteiMayekService';
import { ArrowLeft, Clock, Share2, Check, PenLine, Sparkles, Languages } from 'lucide-react';
import { marked } from 'marked';

interface ArticleViewProps {
  post: BlogPost;
  onBack: () => void;
  onEditDraft?: () => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ post, onBack, onEditDraft }) => {
  const [rawMarkdown, setRawMarkdown] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isTranslated, setIsTranslated] = useState<boolean>(post.language === 'mni');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    if (post.content && post.content.trim()) {
      setRawMarkdown(post.content);
      setLoading(false);
      return;
    }

    fetchArticleMarkdown(post.content_url)
      .then((markdown) => {
        if (!isMounted) return;
        setRawMarkdown(markdown);
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

  // Derived content based on translation toggle
  const effectiveTitle = isTranslated ? translateToMeeteiMayekWithVocab(post.title) : post.title;
  const effectiveCategory = isTranslated ? translateToMeeteiMayekWithVocab(post.category) : post.category;
  const effectiveAuthor = isTranslated ? translateToMeeteiMayekWithVocab(post.author) : post.author;

  const contentHtml = useMemo(() => {
    if (!rawMarkdown) return '';
    try {
      const textToParse = isTranslated ? translateMarkdownToMeeteiMayek(rawMarkdown) : rawMarkdown;
      return marked.parse(textToParse, { gfm: true, breaks: true }) as string;
    } catch (err: any) {
      return `<p>Error rendering article content: ${err.message}</p>`;
    }
  }, [rawMarkdown, isTranslated]);

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
    <div
      className={`reader-container ${isTranslated || post.language === 'mni' ? 'lang-mni' : ''}`}
      lang={isTranslated ? 'mni' : (post.language || 'en')}
    >
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

      {/* Meetei Mayek Translation Toggle Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: '0.65rem 1.15rem',
        marginBottom: '2rem',
        background: 'rgba(24, 24, 27, 0.65)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-full)',
        boxShadow: 'var(--shadow-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <Languages size={15} color="var(--accent-cyan)" />
          <span style={{ fontWeight: 600, color: '#fff' }}>Language View:</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            (Powered by Google Noto Sans Meetei Mayek)
          </span>
        </div>

        <div className="studio-view-toggle" style={{ background: 'rgba(9, 9, 11, 0.8)' }}>
          <button
            type="button"
            className={`view-toggle-btn ${!isTranslated ? 'active' : ''}`}
            onClick={() => setIsTranslated(false)}
            id="btn-toggle-lang-en"
          >
            <span>English</span>
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${isTranslated ? 'active' : ''}`}
            onClick={() => setIsTranslated(true)}
            id="btn-toggle-lang-mni"
          >
            <span style={{ fontFamily: 'var(--font-meetei)', fontSize: '0.95rem' }}>ꯃꯤꯇꯩ ꯃꯌꯦꯛ</span>
            <span>(Meetei Mayek)</span>
          </button>
        </div>
      </div>

      {/* Article Header */}
      <header>
        <div className="reader-header-meta">
          <span style={{ color: '#fff', fontWeight: 600 }}>{effectiveCategory}</span>
          <span>&bull;</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={13} />
            {post.reading_time_min} min read
          </span>
          <span>&bull;</span>
          <span style={{ fontFamily: isTranslated ? 'var(--font-meetei)' : undefined }}>
            {isTranslated ? 'ꯃꯤꯇꯩ ꯃꯌꯦꯛ' : post.language.toUpperCase()}
          </span>
        </div>

        <h1 className="reader-title">{effectiveTitle}</h1>

        <div className="reader-author-strip">
          <div className="reader-author-info">
            <div className="author-avatar-fallback">
              {post.author.charAt(0)}
            </div>
            <div>
              <div className="author-name">{effectiveAuthor}</div>
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
