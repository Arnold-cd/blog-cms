import React, { useState, useMemo } from 'react';
import type { BlogPost, PostDraft } from '../types';
import {
  calculateReadingTime,
  generateMarkdownWithFrontmatter,
} from '../services/cmsService';
import {
  Download,
  Copy,
  Check,
  Eye,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { marked } from 'marked';

interface CmsEditorProps {
  onPreviewInFeed: (draftPost: BlogPost) => void;
}

export const CmsEditor: React.FC<CmsEditorProps> = ({ onPreviewInFeed }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [draft, setDraft] = useState<PostDraft>({
    id: 'my-new-article',
    title: '',
    summary: '',
    date: todayStr,
    author: 'Arnold CD',
    category: 'Philosophy',
    thumbnail: 'images/banner-philosophy.svg',
    language: 'en',
    featured: false,
    content: `# Introduction

Write your Markdown article here. Changes update live in the right preview panel.

## Section 1: The Core Idea

Support for **bold**, *italics*, quotes, and tables:

| Key | Description |
| --- | --- |
| Fast | Serverless Git Headless CMS |
| Portable | Standard Markdown + YAML |

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra
`,
  });

  const [copied, setCopied] = useState<boolean>(false);

  // Auto-generate slug from title if user hasn't customized it heavily
  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setDraft((prev) => ({
      ...prev,
      title: val,
      id: slug || prev.id,
    }));
  };

  // Live stats
  const { words, minutes } = useMemo(() => {
    return calculateReadingTime(draft.content);
  }, [draft.content]);

  // Live HTML preview
  const previewHtml = useMemo(() => {
    try {
      return marked.parse(draft.content, { gfm: true, breaks: true }) as string;
    } catch {
      return '<p>Error rendering preview</p>';
    }
  }, [draft.content]);

  // Validation checks
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (!draft.id.trim()) errors.push('Slug ID is required');
    if (!draft.title.trim()) errors.push('Title is required');
    if (!draft.summary.trim()) errors.push('Summary is required');
    if (!draft.author.trim()) errors.push('Author is required');
    if (!draft.category.trim()) errors.push('Category is required');
    if (!draft.thumbnail.trim()) errors.push('Thumbnail is required');
    return errors;
  }, [draft]);

  const isValid = validationErrors.length === 0;

  // Insert markdown helper
  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('cms-markdown-input') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    const updated =
      textarea.value.substring(0, start) + replacement + textarea.value.substring(end);

    setDraft((prev) => ({ ...prev, content: updated }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
    }, 50);
  };

  // Download .md file
  const handleDownloadMd = () => {
    const fullMarkdown = generateMarkdownWithFrontmatter(draft);
    const blob = new Blob([fullMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${draft.id || 'article'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copy to clipboard
  const handleCopyMd = () => {
    const fullMarkdown = generateMarkdownWithFrontmatter(draft);
    navigator.clipboard.writeText(fullMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Preview in Reader Feed
  const handlePreviewInFeed = () => {
    const postObj: BlogPost = {
      id: draft.id,
      title: draft.title || 'Untitled Article',
      summary: draft.summary || 'No summary provided',
      date: draft.date,
      author: draft.author,
      category: draft.category,
      thumbnail_url: draft.thumbnail,
      content_url: 'draft://local',
      reading_time_min: minutes,
      language: draft.language,
      featured: draft.featured,
    };
    onPreviewInFeed(postObj);
  };

  return (
    <div className="editor-container">
      {/* Editor Header Bar */}
      <div className="editor-header-bar">
        <div className="editor-title-group">
          <h2>Markdown CMS Studio</h2>
          <p>Compose articles, configure frontmatter, and export ready-to-push .md files</p>
        </div>

        <div className="editor-actions-group">
          <button
            onClick={handleCopyMd}
            className="btn-secondary"
            title="Copy entire markdown with YAML frontmatter"
            id="btn-copy-md"
          >
            {copied ? <Check size={15} color="var(--accent-emerald)" /> : <Copy size={15} />}
            <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handleDownloadMd}
            className="btn-primary"
            title="Download .md file ready for posts/ directory"
            id="btn-download-md"
          >
            <Download size={15} />
            <span>Download .md</span>
          </button>

          <button
            onClick={handlePreviewInFeed}
            className="btn-secondary"
            id="btn-preview-feed"
          >
            <Eye size={15} />
            <span>Preview in Reader</span>
          </button>
        </div>
      </div>

      {/* Frontmatter Configuration Panel */}
      <section className="frontmatter-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>YAML Frontmatter Metadata</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
            {isValid ? (
              <span style={{ color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={15} /> Valid Frontmatter
              </span>
            ) : (
              <span style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertCircle size={15} /> Missing required fields
              </span>
            )}
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Article Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. The Architecture of Subjective Time"
              value={draft.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              id="input-cms-title"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Slug ID (Filename) *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. architecture-of-time"
              value={draft.id}
              onChange={(e) => setDraft({ ...draft, id: e.target.value })}
              id="input-cms-id"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              id="select-cms-category"
            >
              <option value="Philosophy">Philosophy</option>
              <option value="Culture">Culture</option>
              <option value="History">History</option>
              <option value="Science">Science</option>
              <option value="Technology">Technology</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Date (YYYY-MM-DD) *</label>
            <input
              type="date"
              className="form-input"
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              id="input-cms-date"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Author Name *</label>
            <input
              type="text"
              className="form-input"
              value={draft.author}
              onChange={(e) => setDraft({ ...draft, author: e.target.value })}
              id="input-cms-author"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Language *</label>
            <select
              className="form-select"
              value={draft.language}
              onChange={(e) => setDraft({ ...draft, language: e.target.value })}
              id="select-cms-language"
            >
              <option value="en">English (en)</option>
              <option value="mni">Meetei Mayek (mni)</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Thumbnail Path or URL *</label>
            <input
              type="text"
              className="form-input"
              value={draft.thumbnail}
              onChange={(e) => setDraft({ ...draft, thumbnail: e.target.value })}
              id="input-cms-thumbnail"
            />
          </div>

          <div className="form-field" style={{ justifyContent: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', marginTop: '1.2rem' }}>
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-cyan)' }}
                id="checkbox-cms-featured"
              />
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: draft.featured ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}>
                Featured Article (Hero display)
              </span>
            </label>
          </div>

          <div className="form-field col-span-full">
            <label className="form-label">Summary (Brief 2-line description) *</label>
            <textarea
              rows={2}
              className="form-textarea"
              placeholder="Short 2-line summary for card previews..."
              value={draft.summary}
              onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
              id="textarea-cms-summary"
            />
          </div>
        </div>
      </section>

      {/* Editor & Live Preview Split Workspace */}
      <div className="editor-workspace">
        {/* Left: Markdown Input */}
        <div className="editor-pane">
          <div className="editor-pane-header">
            <span>Markdown Source</span>
            <div className="editor-toolbar">
              <button onClick={() => insertMarkdown('# ')} className="toolbar-btn" title="Heading 1">H1</button>
              <button onClick={() => insertMarkdown('## ')} className="toolbar-btn" title="Heading 2">H2</button>
              <button onClick={() => insertMarkdown('**', '**')} className="toolbar-btn" title="Bold">B</button>
              <button onClick={() => insertMarkdown('*', '*')} className="toolbar-btn" title="Italic">I</button>
              <button onClick={() => insertMarkdown('> ')} className="toolbar-btn" title="Blockquote">Quote</button>
              <button onClick={() => insertMarkdown('`', '`')} className="toolbar-btn" title="Inline Code">Code</button>
              <button onClick={() => insertMarkdown('```\n', '\n```')} className="toolbar-btn" title="Code Block">Block</button>
              <button onClick={() => insertMarkdown('- ')} className="toolbar-btn" title="List">• List</button>
            </div>
          </div>

          <textarea
            id="cms-markdown-input"
            className="markdown-textarea"
            value={draft.content}
            onChange={(e) => setDraft({ ...draft, content: e.target.value })}
            placeholder="Type your markdown article content here..."
          />

          <div style={{ padding: '0.5rem 1rem', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>{words} words</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-cyan)' }}>
              <Clock size={12} /> ~{minutes} min read
            </span>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="editor-pane">
          <div className="editor-pane-header">
            <span>Live Article Preview</span>
            <span style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>Auto-synced</span>
          </div>

          <div className="preview-body markdown-body" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      </div>
    </div>
  );
};
