import React, { useEffect, useState, useMemo } from 'react';
import type { BlogPost, PostDraft } from '../types';
import { fetchArticleMarkdown, stripFrontmatter } from '../services/cmsService';
import {
  translateMarkdownToMeeteiMayek,
  translateToMeeteiMayekWithVocab,
  convertUnicodeToPukokFont,
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
  const [fontMode, setFontMode] = useState<'noto' | 'pukok'>('noto');
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

  // Derived content based on translation and font mode
  const rawTitle = isTranslated ? translateToMeeteiMayekWithVocab(post.title) : post.title;
  const rawCategory = isTranslated ? translateToMeeteiMayekWithVocab(post.category) : post.category;
  const rawAuthor = isTranslated ? translateToMeeteiMayekWithVocab(post.author) : post.author;

  const effectiveTitle = fontMode === 'pukok' && isTranslated ? convertUnicodeToPukokFont(rawTitle) : rawTitle;
  const effectiveCategory = fontMode === 'pukok' && isTranslated ? convertUnicodeToPukokFont(rawCategory) : rawCategory;
  const effectiveAuthor = fontMode === 'pukok' && isTranslated ? convertUnicodeToPukokFont(rawAuthor) : rawAuthor;

  const contentHtml = useMemo(() => {
    if (!rawMarkdown) return '';
    try {
      const unicodeParsed = isTranslated ? translateMarkdownToMeeteiMayek(rawMarkdown) : rawMarkdown;
      const textToParse = fontMode === 'pukok' && isTranslated ? convertUnicodeToPukokFont(unicodeParsed) : unicodeParsed;
      return marked.parse(textToParse, { gfm: true, breaks: true }) as string;
    } catch (err: any) {
      return `<p>Error rendering article content: ${err.message}</p>`;
    }
  }, [rawMarkdown, isTranslated, fontMode]);

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

  const formatDate = (dateStr: string) => {
    try {
      const formatted = new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      return isTranslated ? translateToMeeteiMayekWithVocab(formatted) : formatted;
    } catch {
      return isTranslated ? translateToMeeteiMayekWithVocab(dateStr) : dateStr;
    }
  };

  return (
    <div
      className={`reader-container ${isTranslated || post.language === 'mni' ? 'lang-mni' : ''} ${fontMode === 'pukok' && isTranslated ? 'font-pukok' : ''}`}
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
      <div className="reader-lang-bar">
        <div className="reader-lang-bar-left">
          <Languages size={15} color="var(--accent-cyan)" />
          <span className="reader-lang-title">Language View:</span>
          <span className="reader-lang-subtitle">
            {fontMode === 'pukok' && isTranslated
              ? '(Powered by Authentic Wakoklon Pukok Eeyek Font)'
              : '(Powered by Google Noto Sans Meetei Mayek)'}
          </span>
        </div>

        <div className="reader-lang-bar-actions">
          {/* Font Downloads */}
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <a
              href="fonts/PukokEeyek.otf"
              download="PukokEeyek.otf"
              className="btn-ghost reader-download-ttf"
              title="Download Authentic Puya Pukok Eeyek Font (.otf) by Kanglei Eempham"
              id="link-download-pukok-otf"
            >
              <Download size={13} />
              <span>Pukok OTF</span>
            </a>
            <a
              href="fonts/NotoSansMeeteiMayek-Regular.ttf"
              download="NotoSansMeeteiMayek-Regular.ttf"
              className="btn-ghost reader-download-ttf"
              title="Download Meetei Mayek TrueType Font (.ttf)"
              id="link-download-ttf"
            >
              <Download size={13} />
              <span>Noto TTF</span>
            </a>
          </div>

          {/* Script / Font Family Mode Selector (visible when Meetei Mayek is active) */}
          {isTranslated && (
            <div className="studio-view-toggle">
              <button
                type="button"
                className={`view-toggle-btn ${fontMode === 'noto' ? 'active' : ''}`}
                onClick={() => setFontMode('noto')}
                title="Google Noto Sans Meetei Mayek (Unicode standard)"
                id="btn-font-noto"
              >
                <span>Noto Sans</span>
              </button>
              <button
                type="button"
                className={`view-toggle-btn ${fontMode === 'pukok' ? 'active' : ''}`}
                onClick={() => setFontMode('pukok')}
                title="Authentic Wakoklon Pukok Eeyek Font by Kanglei Eempham"
                id="btn-font-pukok"
              >
                <span style={{ fontFamily: 'var(--font-pukok)', fontSize: '1rem', lineHeight: 1 }}>pFyJ</span>
                <span>Pukok Puya</span>
              </button>
            </div>
          )}

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
              <span>(Meetei Mayek)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <header>
        <div className="reader-header-meta">
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{effectiveCategory}</span>
          <span>&bull;</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={13} />
            {isTranslated
              ? `${translateToMeeteiMayekWithVocab(String(post.reading_time_min))} ꯃꯤꯅꯤꯠ ꯄꯥꯕ`
              : `${post.reading_time_min} min read`}
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
              {effectiveAuthor ? effectiveAuthor.trim().charAt(0) : 'A'}
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
            className={`markdown-body ${fontMode === 'pukok' && isTranslated ? 'font-pukok' : ''}`}
            data-font={fontMode === 'pukok' && isTranslated ? 'pukok' : undefined}
            style={{
              fontFamily: fontMode === 'pukok' && isTranslated ? "'Pukok Eeyek', var(--font-pukok)" : undefined,
            }}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
            id="reader-markdown-content"
          />
        )}
      </article>
    
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div className="modal-dialog" style={{
            background: 'var(--bg-elevated)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '480px',
            width: '100%',
            padding: '2rem',
            boxShadow: 'var(--shadow-elevated)',
          }}>
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
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
