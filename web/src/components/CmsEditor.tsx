import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { BlogPost, PostDraft, UploadedAsset } from '../types';
import {
  calculateReadingTime,
  generateMarkdownWithFrontmatter,
} from '../services/cmsService';
import { createDownloadPackage, publishToGitHub } from '../services/exportService';
import { convertPdfToImages } from '../services/pdfService';
import {
  Download,
  Copy,
  Check,
  Eye,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
  Upload,
  FileUp,
  Trash2,
  Package,
  Send,
  Key,
  Paperclip,
  Loader2,
} from 'lucide-react';
import { marked } from 'marked';

interface CmsEditorProps {
  onPreviewInFeed: (draftPost: BlogPost) => void;
}

export const CmsEditor: React.FC<CmsEditorProps> = ({ onPreviewInFeed }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [draft, setDraft] = useState<PostDraft>(() => {
    // Try restoring draft from localStorage if available
    const saved = localStorage.getItem('blog_cms_current_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, assets: [] };
      } catch {
        // fallback
      }
    }
    return {
      id: 'my-new-article',
      title: '',
      summary: '',
      date: todayStr,
      author: 'Arnold CD',
      category: 'Philosophy',
      thumbnail: 'images/banner-philosophy.svg',
      thumbnailPreviewUrl: '',
      language: 'en',
      featured: false,
      assets: [],
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
    };
  });

  const [copied, setCopied] = useState<boolean>(false);
  const [isProcessingPdf, setIsProcessingPdf] = useState<boolean>(false);
  const [showGitHubModal, setShowGitHubModal] = useState<boolean>(false);
  const [githubToken, setGithubToken] = useState<string>(() => localStorage.getItem('github_cms_token') || '');
  const [githubRepo, setGithubRepo] = useState<string>('Arnold-cd/blog-cms');
  const [publishStatus, setPublishStatus] = useState<{ loading: boolean; message: string; success?: boolean }>({
    loading: false,
    message: '',
  });

  // Persist draft text in localStorage
  useEffect(() => {
    const toSave = { ...draft, assets: [] };
    localStorage.setItem('blog_cms_current_draft', JSON.stringify(toSave));
  }, [draft]);

  // Auto-generate slug from title
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

  // Replace internal asset URLs with local blob URLs for live preview
  const livePreviewMarkdown = useMemo(() => {
    let content = draft.content;
    if (draft.assets) {
      draft.assets.forEach((asset) => {
        // replace occurrences of images/asset.name with local previewUrl
        content = content.split(`images/${asset.name}`).join(asset.previewUrl);
      });
    }
    return content;
  }, [draft.content, draft.assets]);

  // Live HTML preview
  const previewHtml = useMemo(() => {
    try {
      return marked.parse(livePreviewMarkdown, { gfm: true, breaks: true }) as string;
    } catch {
      return '<p>Error rendering preview</p>';
    }
  }, [livePreviewMarkdown]);

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

  // Handle Banner Upload (JPG, PNG, SVG, or PDF page 1)
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setIsProcessingPdf(true);
      try {
        const pages = await convertPdfToImages(file, 1);
        if (pages.length > 0) {
          const firstPage = pages[0];
          const asset: UploadedAsset = {
            name: firstPage.name,
            size: firstPage.file.size,
            type: 'image',
            file: firstPage.file,
            previewUrl: firstPage.previewUrl,
            cmsPath: `images/${firstPage.name}`,
          };
          setDraft((prev) => ({
            ...prev,
            thumbnail: `images/${firstPage.name}`,
            thumbnailPreviewUrl: firstPage.previewUrl,
            assets: [...prev.assets.filter((a) => a.name !== firstPage.name), asset],
          }));
        }
      } catch (err: any) {
        alert(`Failed to extract banner image from PDF: ${err.message}`);
      } finally {
        setIsProcessingPdf(false);
      }
      return;
    }

    const cleanName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
    const previewUrl = URL.createObjectURL(file);

    const asset: UploadedAsset = {
      name: cleanName,
      size: file.size,
      type: 'image',
      file,
      previewUrl,
      cmsPath: `images/${cleanName}`,
    };

    setDraft((prev) => ({
      ...prev,
      thumbnail: `images/${cleanName}`,
      thumbnailPreviewUrl: previewUrl,
      assets: [...prev.assets.filter((a) => a.name !== cleanName), asset],
    }));
  };

  // Handle General Media & Document Upload (PDF, JPG, PNG)
  const handleAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingPdf(true);
    const newAssets: UploadedAsset[] = [];
    let appendMarkdown = '';

    try {
      for (const file of Array.from(files)) {
        const cleanName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
        const isPdf = file.type === 'application/pdf' || cleanName.endsWith('.pdf');

        if (isPdf) {
          // Render each PDF page as a high-resolution PNG picture (no download link!)
          const pages = await convertPdfToImages(file, 10);
          pages.forEach((page) => {
            const asset: UploadedAsset = {
              name: page.name,
              size: page.file.size,
              type: 'image',
              file: page.file,
              previewUrl: page.previewUrl,
              cmsPath: `images/${page.name}`,
            };
            newAssets.push(asset);
            appendMarkdown += `\n\n![${file.name} - Page ${page.pageNumber}](images/${page.name})\n`;
          });
        } else {
          // Standard Image (JPG, PNG, SVG)
          const previewUrl = URL.createObjectURL(file);
          const asset: UploadedAsset = {
            name: cleanName,
            size: file.size,
            type: 'image',
            file,
            previewUrl,
            cmsPath: `images/${cleanName}`,
          };
          newAssets.push(asset);
          appendMarkdown += `\n\n![${cleanName.replace(/\.[^/.]+$/, '')}](images/${cleanName})\n`;
        }
      }

      setDraft((prev) => ({
        ...prev,
        assets: [...prev.assets, ...newAssets],
        content: prev.content + appendMarkdown,
      }));
    } catch (err: any) {
      alert(`Error rendering uploaded file: ${err.message}`);
    } finally {
      setIsProcessingPdf(false);
    }
  };

  // Remove uploaded asset
  const handleRemoveAsset = (name: string) => {
    setDraft((prev) => ({
      ...prev,
      assets: prev.assets.filter((a) => a.name !== name),
      thumbnailPreviewUrl: prev.thumbnail === `images/${name}` ? '' : prev.thumbnailPreviewUrl,
    }));
  };

  // Download complete .zip package
  const handleDownloadZip = async () => {
    try {
      const zipBlob = await createDownloadPackage(draft);
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${draft.id || 'article'}-package.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Error creating zip package: ${err.message}`);
    }
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
    const effectiveThumbnail =
      draft.thumbnailPreviewUrl ||
      draft.thumbnail ||
      'images/banner-philosophy.svg';

    const postObj: BlogPost = {
      id: draft.id || 'draft-article',
      title: draft.title.trim() || 'Untitled Draft Article',
      summary: draft.summary.trim() || 'No summary provided for this draft article.',
      date: draft.date || todayStr,
      author: draft.author.trim() || 'Anonymous Author',
      category: draft.category || 'General',
      thumbnail_url: effectiveThumbnail,
      content_url: `posts/${draft.id || 'draft-article'}.md`,
      reading_time_min: minutes,
      language: draft.language || 'en',
      featured: draft.featured,
      content: livePreviewMarkdown, // Pass live rendered markdown directly!
      isDraft: true,
    };

    onPreviewInFeed(postObj);
  };

  // Direct GitHub Publish handler
  const handlePublishToGitHub = async () => {
    if (!githubToken.trim()) {
      alert('Please enter a GitHub Personal Access Token.');
      return;
    }

    setPublishStatus({ loading: true, message: 'Publishing article and assets to GitHub...' });
    localStorage.setItem('github_cms_token', githubToken.trim());

    const res = await publishToGitHub(githubToken, githubRepo, draft);
    setPublishStatus({
      loading: false,
      message: res.message,
      success: res.success,
    });
  };

  return (
    <div className="editor-container">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={bannerInputRef}
        onChange={handleBannerUpload}
        accept="image/png, image/jpeg, image/svg+xml, image/webp, application/pdf"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAssetUpload}
        multiple
        accept="image/png, image/jpeg, image/svg+xml, image/webp, application/pdf"
        style={{ display: 'none' }}
      />

      {/* Editor Header Bar */}
      <div className="editor-header-bar">
        <div className="editor-title-group">
          <h2>Markdown CMS Studio</h2>
          <p>Compose articles &bull; PDFs automatically render as picture pages &bull; Publish to Git</p>
        </div>

        <div className="editor-actions-group">
          <button
            onClick={() => setShowGitHubModal(true)}
            className="btn-secondary"
            title="Publish directly to GitHub via API"
            id="btn-publish-github"
            style={{ color: 'var(--accent-cyan)' }}
          >
            <Send size={15} />
            <span>Publish to Git</span>
          </button>

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
            onClick={handleDownloadZip}
            className="btn-secondary"
            title="Download ZIP with .md and all uploaded assets ready for repo"
            id="btn-download-zip"
          >
            <Package size={15} />
            <span>Package (.zip)</span>
          </button>

          <button
            onClick={handleDownloadMd}
            className="btn-secondary"
            title="Download .md file ready for posts/ directory"
            id="btn-download-md"
          >
            <Download size={15} />
            <span>Download .md</span>
          </button>

          <button
            onClick={handlePreviewInFeed}
            className="btn-primary"
            title="Preview article formatted live in the Reader"
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

          {/* Banner Image Uploader */}
          <div className="form-field col-span-full">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <label className="form-label">Thumbnail Banner Image *</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  className="btn-secondary"
                  style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', gap: '0.35rem' }}
                >
                  <Upload size={13} />
                  <span>Upload JPG / PNG / PDF</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                style={{ flex: 1 }}
                placeholder="images/banner-philosophy.svg or custom upload"
                value={draft.thumbnail}
                onChange={(e) => setDraft({ ...draft, thumbnail: e.target.value, thumbnailPreviewUrl: '' })}
                id="input-cms-thumbnail"
              />
              {draft.thumbnailPreviewUrl && (
                <div style={{ width: '56px', height: '40px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-active)' }}>
                  <img src={draft.thumbnailPreviewUrl} alt="Thumbnail preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>

          <div className="form-field" style={{ justifyContent: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', marginTop: '0.5rem' }}>
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
            <label className="form-label">Summary (Brief description for mobile feed cards) *</label>
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

      {/* Asset Upload & Media Management Panel */}
      <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Paperclip size={18} color="var(--accent-indigo)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
              Attached Media &amp; Rendered PDF Pictures ({draft.assets.length})
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
              (PDFs are automatically rendered into pictures)
            </span>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingPdf}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', gap: '0.4rem' }}
            id="btn-upload-media"
          >
            {isProcessingPdf ? (
              <>
                <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Rendering PDF to Pictures...</span>
              </>
            ) : (
              <>
                <FileUp size={15} color="var(--accent-cyan)" />
                <span>Upload PDF or Image</span>
              </>
            )}
          </button>
        </div>

        {isProcessingPdf && (
          <div style={{ padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid var(--border-active)', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-cyan)' }}>
            <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            <span>Processing document &bull; Rendering PDF pages into high-resolution pictures...</span>
          </div>
        )}

        {draft.assets.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '1.5rem',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            <Upload size={20} style={{ margin: '0 auto 0.5rem', opacity: 0.7 }} />
            <p>Click here or drag &amp; drop <strong>PDF, JPG, or PNG</strong> files. PDFs will render as pictures!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
            {draft.assets.map((asset) => (
              <div
                key={asset.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border-subtle)' }}>
                  <img src={asset.previewUrl} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.8rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {asset.name}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {(asset.size / 1024).toFixed(1)} KB &bull; PICTURE
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveAsset(asset.name)}
                  style={{ color: 'var(--text-muted)', padding: '0.25rem' }}
                  title="Remove picture"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
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
              <button onClick={() => fileInputRef.current?.click()} className="toolbar-btn" title="Upload Media/PDF">
                <Paperclip size={13} />
              </button>
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

      {/* Direct GitHub Publish Modal */}
      {showGitHubModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-active)',
            borderRadius: 'var(--radius-md)',
            maxWidth: '520px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <Send size={20} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Publish Directly to GitHub</h3>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              This will commit your article and all rendered images directly to <strong>{githubRepo}</strong> via the GitHub API, automatically triggering GitHub Actions to build and deploy!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <Key size={13} />
                  <span>GitHub Personal Access Token (repo scope)</span>
                </label>
                <input
                  type="password"
                  className="form-input"
                  style={{ width: '100%' }}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                  Token is saved in your local browser only. Never shared or sent to any third-party server.
                </span>
              </div>

              <div>
                <label className="form-label" style={{ marginBottom: '0.35rem' }}>Repository (owner/repo)</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ width: '100%' }}
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                />
              </div>
            </div>

            {publishStatus.message && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                background: publishStatus.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: publishStatus.success ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                border: `1px solid ${publishStatus.success ? 'var(--accent-emerald)' : 'var(--accent-rose)'}`,
              }}>
                {publishStatus.message}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  setShowGitHubModal(false);
                  setPublishStatus({ loading: false, message: '' });
                }}
                className="btn-secondary"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePublishToGitHub}
                disabled={publishStatus.loading}
                className="btn-primary"
              >
                {publishStatus.loading ? 'Committing to Git...' : 'Publish to GitHub'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
