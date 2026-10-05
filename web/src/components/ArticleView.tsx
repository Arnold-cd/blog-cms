import React, { useEffect, useState, useMemo } from 'react';
import type { BlogPost, PostDraft } from '../types';
import { fetchArticleMarkdown, stripFrontmatter, resolveAssetUrl } from '../services/cmsService';
import {
  convertUnicodeToPukokFont,
  translateToPukokFontWithVocab,
  translateMarkdownToPukok,
} from '../services/meeteiMayekService';
import { ArrowLeft, Clock, Share2, Check, PenLine, Sparkles, Languages, Trash2, AlertTriangle, Key, Loader2, Download } from 'lucide-react';
import { marked } from 'marked';

interface ArticleViewProps {
  post: BlogPost;
  onBack: () => void;
  onEditDraft?: () => void;
  onEditArticle?: (draft: PostDraft) => void;
  onDeletePost?: (post: BlogPost, token: string) => Promise<void>;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ post, onBack, onEditDraft, onEditArticle, onDeletePost }) => {
  const [rawMarkdown, setRawMarkdown] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isTranslated, setIsTranslated] = useState<boolean>(post.language === 'mni');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteToken, setDeleteToken] = useState<string>(() => localStorage.getItem('github_cms_token') || '');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    if (post.content && post.content.trim()) {
      setRawMarkdown(stripFrontmatter(post.content));
      setLoading(false);
      return;
    }

    fetchArticleMarkdown(post.content_url)
      .then((markdown) => {
        if (!isMounted) return;
        setRawMarkdown(stripFrontmatter(markdown));
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

  // Derived content based on translation
  const effectiveTitle = useMemo(() => {
    return isTranslated ? translateToPukokFontWithVocab(post.title) : post.title;
  }, [post.title, isTranslated]);

  const effectiveCategory = useMemo(() => {
    return isTranslated ? translateToPukokFontWithVocab(post.category) : post.category;
  }, [post.category, isTranslated]);

  const effectiveAuthor = useMemo(() => {
    return isTranslated ? translateToPukokFontWithVocab(post.author) : post.author;
  }, [post.author, isTranslated]);

  const formattedDate = useMemo(() => {
    try {
      const formatted = new Date(post.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      return isTranslated ? translateToPukokFontWithVocab(formatted) : formatted;
    } catch {
      return isTranslated ? translateToPukokFontWithVocab(post.date) : post.date;
    }
  }, [post.date, isTranslated]);

  const readingTimeText = useMemo(() => {
    if (isTranslated) {
      const numPukok = translateToPukokFontWithVocab(String(post.reading_time_min));
      const suffixPukok = convertUnicodeToPukokFont('ꯃꯤꯅꯤꯠ ꯄꯥꯕ');
      return `${numPukok} ${suffixPukok}`;
    }
    return `${post.reading_time_min} min read`;
  }, [post.reading_time_min, isTranslated]);

  const contentHtml = useMemo(() => {
    if (!rawMarkdown) return '';
    try {
      // Normalize image paths so that relative images/ and ./images/ cleanly resolve to /images/
      const sanitizedMarkdown = rawMarkdown
        .replaceAll(
          'https://raw.githubusercontent.com/Arnold-cd/blog-cms/main/images/',
          '/images/'
        )
        .replace(/\((?:\.\/)?images\//g, '(/images/');
      const textToParse = isTranslated ? translateMarkdownToPukok(sanitizedMarkdown) : sanitizedMarkdown;
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

  const handleEditClick = async () => {
    if (post.isDraft) {
      onEditDraft?.();
      return;
    }

    let contentToUse = rawMarkdown || post.content || '';
    if (!contentToUse && post.content_url) {
      try {
        contentToUse = await fetchArticleMarkdown(post.content_url);
      } catch (err) {
        console.warn('Could not fetch markdown for editing:', err);
      }
    }

    let thumbnailPath = post.thumbnail_url || '';
    const rawMatch = thumbnailPath.match(/main\/(.+)$/);
    if (rawMatch) {
      thumbnailPath = rawMatch[1];
    }

    const draftToLoad: PostDraft = {
      id: post.id,
      title: post.title,
      summary: post.summary || '',
      date: post.date || new Date().toISOString().split('T')[0],
      author: post.author || '',
      category: post.category || 'General',
      thumbnail: thumbnailPath,
      thumbnailPreviewUrl: post.thumbnail_url || '',
      language: post.language || 'en',
      featured: post.featured || false,
      assets: [],
      content: contentToUse || `# ${post.title}\n\n`,
    };

    onEditArticle?.(draftToLoad);
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '0.82rem', fontWeight: 500 }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={handleShare} className="btn-secondary" id="btn-share-article">
            {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Share2 size={14} />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>

          <button
            onClick={handleEditClick}
            className="btn-secondary"
            id="btn-edit-article"
            title="Edit article in CMS Studio"
            style={{
              padding: '0.45rem 0.75rem',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <PenLine size={14} />
            <span>Edit</span>
          </button>

          {!post.isDraft && onDeletePost && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn-ghost"
              style={{
                color: 'var(--accent-rose)',
                padding: '0.45rem 0.75rem',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
              title="Delete article from GitHub"
              id="btn-delete-article"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Meetei Mayek Translation Toggle Bar */}
      <div className={`reader-lang-bar ${isTranslated ? 'active-mni' : ''}`}>
        <div className="reader-lang-bar-left">
          <Languages size={15} color="var(--accent-indigo)" />
          <span className="reader-lang-title">Language View:</span>
          <span className="reader-lang-subtitle">
            (Authentic Wakoklon Pukok Eeyek Font)
          </span>
        </div>

        <div className="reader-lang-bar-actions">
          {/* Font Downloads */}
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <a
              href="fonts/PukokEeyek.otf"
              download="PukokEeyek.otf"
              className="btn-ghost reader-download-ttf"
              style={{ color: 'var(--accent-amber)', borderColor: 'rgba(245, 158, 11, 0.3)' }}
              title="Download Authentic Puya Pukok Eeyek Font (.otf) by Kanglei Eempham"
              id="link-download-pukok-otf"
            >
              <Download size={13} />
              <span>Pukok Eeyek OTF</span>
            </a>
          </div>

          {/* Language Toggle */}
          <div className="studio-view-toggle">
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
              <span>(Meetei)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <header>
        <div className="reader-header-meta">
          <span
            className={`reader-category-badge ${isTranslated ? 'font-pukok' : ''}`}
            style={{
              color: 'var(--accent-indigo)',
              fontWeight: 600,
              background: 'rgba(99, 102, 241, 0.12)',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {isTranslated ? effectiveCategory : effectiveCategory.toUpperCase()}
          </span>
          <span>&bull;</span>
          <span
            className={`reader-reading-time ${isTranslated ? 'font-pukok' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Clock size={13} />
            {readingTimeText}
          </span>
          <span>&bull;</span>
          <span
            className={`reader-meta-item ${isTranslated ? 'font-pukok' : ''}`}
            style={{
              padding: '0.2rem 0.55rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(20, 184, 166, 0.12)',
              color: 'var(--accent-teal)',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            {isTranslated ? convertUnicodeToPukokFont('ꯃꯤꯇꯩ ꯃꯌꯦꯛ') : (post.language === 'mni' ? convertUnicodeToPukokFont('ꯃꯤꯇꯩ ꯃꯌꯦꯛ') : post.language.toUpperCase())}
          </span>
        </div>

        <h1
          className={`reader-title ${isTranslated ? 'font-pukok' : ''}`}
          id="reader-article-title"
        >
          {effectiveTitle}
        </h1>

        <div className="reader-author-strip">
          <div className="reader-author-info">
            <div
              className={`author-avatar-fallback ${isTranslated ? 'font-pukok' : ''}`}
              style={{
                fontSize: isTranslated ? '1.1rem' : undefined,
              }}
            >
              {effectiveAuthor ? effectiveAuthor.trim().charAt(0) : 'A'}
            </div>
            <div>
              <div
                className={`author-name ${isTranslated ? 'font-pukok' : ''}`}
                style={{
                  fontSize: isTranslated ? '1.05rem' : undefined,
                }}
              >
                {effectiveAuthor}
              </div>
              <div
                className={`publish-date ${isTranslated ? 'font-pukok' : ''}`}
                style={{
                  fontSize: isTranslated ? '0.85rem' : undefined,
                }}
              >
                {formattedDate}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        {post.thumbnail_url && (
          <div className="reader-hero-wrap">
            <img
              src={resolveAssetUrl(post.thumbnail_url)}
              alt={post.title}
              className="reader-hero-img"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedVercel) {
                  target.dataset.triedVercel = 'true';
                  const filename = target.src.split('/').pop()?.split('?')[0];
                  if (filename) {
                    target.src = `https://blog-cms-gilt.vercel.app/images/${filename}`;
                    return;
                  }
                }
                const parent = target.parentElement;
                if (parent) parent.style.display = 'none';
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
            className={`markdown-body ${isTranslated ? 'font-pukok' : ''}`}
            data-font={isTranslated ? 'pukok' : undefined}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
            id="reader-markdown-content"
          />
        )}
      </article>
    
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-backdrop" onClick={() => !isDeleting && setShowDeleteModal(false)}>
          <div className="modal-dialog" style={{
            border: '1px solid rgba(244, 63, 94, 0.4)',
            maxWidth: '480px',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', color: 'var(--accent-rose)' }}>
              <AlertTriangle size={20} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Delete Article from GitHub</h3>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Are you sure you want to permanently delete <strong>"{post.title}"</strong> (<code>posts/{post.id}.md</code>)?
              This will remove the file from your GitHub repository and update the article index.
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Key size={13} />
                <span>GitHub Personal Access Token</span>
              </label>
              <input
                type="password"
                className="form-input"
                style={{ width: '100%' }}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={deleteToken}
                onChange={(e) => setDeleteToken(e.target.value)}
                id="input-delete-token"
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                Requires repo permissions to commit deletion to main branch.
              </span>
            </div>

            {deleteError && (
              <div style={{
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                background: 'rgba(244, 63, 94, 0.12)',
                color: 'var(--accent-rose)',
                border: '1px solid var(--accent-rose)',
                marginBottom: '1.25rem',
              }}>
                {deleteError}
              </div>
            )}

            <div className="modal-actions-row">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ background: 'var(--accent-rose)', borderColor: 'var(--accent-rose)' }}
                disabled={isDeleting || !deleteToken.trim()}
                onClick={async () => {
                  if (!deleteToken.trim()) return;
                  localStorage.setItem('github_cms_token', deleteToken);
                  setIsDeleting(true);
                  setDeleteError(null);
                  try {
                    if (onDeletePost) {
                      await onDeletePost(post, deleteToken);
                    }
                  } catch (err: any) {
                    setDeleteError(err.message || 'Failed to delete article');
                    setIsDeleting(false);
                  }
                }}
                id="btn-confirm-delete"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Deleting from Git...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
