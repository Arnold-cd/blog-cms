import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { BlogPost, PostDraft, UploadedAsset } from '../types';
import {
  calculateReadingTime,
  generateMarkdownWithFrontmatter,
} from '../services/cmsService';
import { createDownloadPackage, publishToGitHub } from '../services/exportService';
import { convertPdfToImages } from '../services/pdfService';
import {
  saveStoredAssets,
  getAllStoredAssets,
  removeStoredAsset,
  clearAllStoredAssets,
} from '../services/draftStorage';
import {
  Download,
  Copy,
  Check,
  Eye,
  AlertCircle,
  FileUp,
  Trash2,
  Send,
  Key,
  Paperclip,
  Loader2,
  RotateCcw,
  SlidersHorizontal,
  Columns,
  PenLine,
  Plus,
  CheckCircle,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { marked } from 'marked';
import { MeeteiMayekTool } from './MeeteiMayekTool';
import { translateMarkdownToMeeteiMayek, translateToMeeteiMayekWithVocab } from '../services/meeteiMayekService';

interface CmsEditorProps {
  onPreviewInFeed: (draftPost: BlogPost) => void;
  onPostPublished?: (newPost: BlogPost) => void;
}

export const CmsEditor: React.FC<CmsEditorProps> = ({ onPreviewInFeed, onPostPublished }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [viewMode, setViewMode] = useState<'split' | 'write' | 'preview'>('split');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showMeeteiTool, setShowMeeteiTool] = useState<boolean>(false);
  const [isPreviewMeetei, setIsPreviewMeetei] = useState<boolean>(false);

  const [draft, setDraft] = useState<PostDraft>(() => {
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
  const [publishResult, setPublishResult] = useState<{ postUrl?: string; postObj?: BlogPost } | null>(null);

  // Persist draft text in localStorage
  useEffect(() => {
    const toSave = { ...draft, assets: [] };
    localStorage.setItem('blog_cms_current_draft', JSON.stringify(toSave));
  }, [draft]);

  // Restore persistent assets (PDF pictures & uploaded images) from IndexedDB on mount
  useEffect(() => {
    getAllStoredAssets().then((storedAssets) => {
      if (storedAssets && storedAssets.length > 0) {
        setDraft((prev) => {
          const existingNames = new Set(prev.assets.map((a) => a.name));
          const toAdd = storedAssets.filter((a) => !existingNames.has(a.name));
          if (toAdd.length === 0) return prev;
          return {
            ...prev,
            assets: [...prev.assets, ...toAdd],
          };
        });
      }
    });
  }, []);

  // Reset draft to blank state
  const handleResetDraft = async () => {
    if (window.confirm('Start a new blank draft? This will clear current editor text and uploaded pictures.')) {
      await clearAllStoredAssets();
      localStorage.removeItem('blog_cms_current_draft');
      setDraft({
        id: 'new-article',
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
        content: '# New Article\n\nWrite your thoughts here...',
      });
    }
  };

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
    if (draft.assets && draft.assets.length > 0) {
      draft.assets.forEach((asset) => {
        const escaped = asset.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(?:\\.?\\/?images\\/)?${escaped}`, 'gi');
        content = content.replace(regex, asset.previewUrl);
      });
    }
    return content;
  }, [draft.content, draft.assets]);

  // Live HTML preview with custom image renderer
  const previewHtml = useMemo(() => {
    try {
      const renderer = new marked.Renderer();
      const defaultImage = renderer.image.bind(renderer);

      renderer.image = (token) => {
        const { href } = token;
        if (href.startsWith('images/') || href.startsWith('./images/')) {
          return `
            <div class="cms-missing-asset-notice">
              <span style="font-size: 1.25rem;">🖼️</span>
              <div style="flex: 1; min-width: 0;">
                <div style="color: #fff; font-weight: 600; margin-bottom: 0.2rem;">Asset Reference: <code>${href}</code></div>
                <p style="margin: 0; color: var(--text-muted); font-size: 0.8rem;">
                  Picture not loaded in current session. Upload the PDF or image above to render it.
                </p>
              </div>
            </div>
          `;
        }
        return defaultImage.call(renderer, token);
      };

      const markdownToRender = isPreviewMeetei
        ? translateMarkdownToMeeteiMayek(livePreviewMarkdown)
        : livePreviewMarkdown;
      return marked.parse(markdownToRender, { gfm: true, breaks: true, renderer }) as string;
    } catch {
      return '<p>Error rendering preview</p>';
    }
  }, [livePreviewMarkdown, isPreviewMeetei]);

  // Missing metadata validation with field descriptors for interactive jumps
  const missingFields = useMemo(() => {
    const fields: { key: string; label: string; elementId: string; drawerField: boolean }[] = [];
    if (!draft.title.trim()) {
      fields.push({ key: 'title', label: 'Title', elementId: 'input-inline-title', drawerField: false });
    }
    if (!draft.summary.trim()) {
      fields.push({ key: 'summary', label: 'Summary', elementId: 'textarea-cms-summary', drawerField: true });
    }
    if (!draft.id.trim()) {
      fields.push({ key: 'id', label: 'Slug ID', elementId: 'input-inline-title', drawerField: false });
    }
    if (!draft.author.trim()) {
      fields.push({ key: 'author', label: 'Author', elementId: 'input-cms-author', drawerField: true });
    }
    if (!draft.category.trim()) {
      fields.push({ key: 'category', label: 'Category', elementId: 'select-cms-category', drawerField: true });
    }
    if (!draft.thumbnail.trim()) {
      fields.push({ key: 'thumbnail', label: 'Banner Image', elementId: 'input-cms-thumbnail', drawerField: true });
    }
    return fields;
  }, [draft]);



  const isValid = missingFields.length === 0;

  const handleJumpToMissing = (field: { elementId: string; drawerField: boolean }) => {
    if (field.drawerField) {
      setShowSettings(true);
    }
    setTimeout(() => {
      const el = document.getElementById(field.elementId);
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  };

  // Insert markdown helper at cursor
  const insertMarkdownSyntax = (prefix: string, suffix: string = '') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selected = text.substring(start, end);
    const replacement = `${prefix}${selected}${suffix}`;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setDraft({ ...draft, content: newContent });

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  // Upload custom thumbnail
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (isPdf) {
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
          await saveStoredAssets([asset]);
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

    await saveStoredAssets([asset]);
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

      await saveStoredAssets(newAssets);
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

  // Remove asset
  const handleRemoveAsset = (name: string) => {
    setDraft((prev) => ({
      ...prev,
      assets: prev.assets.filter((a) => a.name !== name),
      thumbnailPreviewUrl: prev.thumbnail === `images/${name}` ? '' : prev.thumbnailPreviewUrl,
    }));
    removeStoredAsset(name);
  };

  // Insert asset markdown at cursor
  const handleInsertAsset = (asset: UploadedAsset) => {
    const md = `![${asset.name}](images/${asset.name})`;
    insertMarkdownSyntax(md);
  };

  // Copy Markdown with frontmatter
  const handleCopyMd = () => {
    const fullText = generateMarkdownWithFrontmatter(draft);
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download complete .zip package
  const handleDownloadZip = async () => {
    try {
      const zipBlob = await createDownloadPackage(draft);
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${draft.id || 'article'}-package.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Failed to create .zip export: ${err.message}`);
    }
  };

  // Preview in Reader Feed
  const handlePreviewInFeed = () => {
    const assetMatch = draft.assets?.find((a) => draft.thumbnail.toLowerCase().includes(a.name.toLowerCase()));
    const effectiveThumbnail =
      draft.thumbnailPreviewUrl ||
      assetMatch?.previewUrl ||
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
      content: livePreviewMarkdown,
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

    if (!githubRepo.trim() || !githubRepo.includes('/')) {
      alert('Please enter a valid GitHub repository in "owner/repo" format.');
      return;
    }

    localStorage.setItem('github_cms_token', githubToken);

    setPublishStatus({ loading: true, message: 'Connecting to GitHub API and uploading...' });
    setPublishResult(null);

    try {
      const result = await publishToGitHub(githubToken, githubRepo, draft);
      setPublishStatus({
        loading: false,
        message: result.message,
        success: result.success,
      });

      if (result.success && result.postObj) {
        setPublishResult({
          postUrl: result.postUrl,
          postObj: result.postObj,
        });
        if (onPostPublished) {
          onPostPublished(result.postObj);
        }
      }
    } catch (err: any) {
      setPublishStatus({
        loading: false,
        message: err.message || 'Failed to publish to GitHub',
        success: false,
      });
    }
  };

  return (
    <div className="studio-container">
      {/* Hidden file inputs */}
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

      {/* Top Utility & Mode Bar */}
      <div className="studio-top-bar">
        <div className="studio-title-group">
          <span className="studio-status-pill">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-emerald)' }} />
            <span>Auto-saved locally</span>
          </span>

          {/* View Mode Toggle */}
          <div className="studio-view-toggle">
            <button
              className={`view-toggle-btn ${viewMode === 'split' ? 'active' : ''}`}
              onClick={() => setViewMode('split')}
              title="Side-by-side Editor & Preview"
              id="btn-view-split"
            >
              <Columns size={13} />
              <span>Split</span>
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'write' ? 'active' : ''}`}
              onClick={() => setViewMode('write')}
              title="Distraction-Free Writing"
              id="btn-view-write"
            >
              <PenLine size={13} />
              <span>Write</span>
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
              onClick={() => setViewMode('preview')}
              title="Full Article Preview"
              id="btn-view-preview"
            >
              <Eye size={13} />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="studio-actions-group">
          <button
            onClick={() => setShowMeeteiTool(true)}
            className="btn-secondary"
            title="Meetei Mayek Translator & Character Palette"
            id="btn-meetei-mayek-tool"
          >
            <span style={{ fontFamily: "var(--font-meetei)", fontSize: "1.05rem", lineHeight: 1 }}>ꯃ</span>
            <span>Meetei Mayek</span>
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="btn-secondary"
            title="Configure category, author, summary, and banner"
            id="btn-toggle-settings"
            style={{
              background: showSettings ? 'rgba(255, 255, 255, 0.12)' : undefined,
              borderColor: showSettings ? 'var(--border-active)' : undefined,
            }}
          >
            <SlidersHorizontal size={14} />
            <span>Settings</span>
            {!isValid && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-rose)' }} />}
          </button>

          <button
            onClick={handleResetDraft}
            className="btn-secondary"
            title="Start a blank draft"
            id="btn-reset-draft"
          >
            <RotateCcw size={14} />
            <span>New Draft</span>
          </button>

          <button
            onClick={handleCopyMd}
            className="btn-secondary"
            title="Copy entire markdown with YAML frontmatter"
            id="btn-copy-md"
          >
            {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownloadZip}
            className="btn-secondary"
            title="Download .zip package with Markdown and all pictures"
            id="btn-download-zip"
          >
            <Download size={14} />
            <span>Export Zip</span>
          </button>

          <button
            onClick={handlePreviewInFeed}
            className="btn-secondary"
            title="Open in reader mode"
            id="btn-preview-feed"
          >
            <Eye size={14} />
            <span>Reader View</span>
          </button>

          <button
            onClick={() => {
              if (!isValid) {
                alert("Please complete required fields: " + missingFields.map(f => f.label).join(", "));
                handleJumpToMissing(missingFields[0]);
                return;
              }
              setShowGitHubModal(true);
            }}
            className="btn-primary"
            title="Commit and deploy directly to GitHub"
            id="btn-publish-github"
          >
            <Send size={14} />
            <span>Publish to Git</span>
          </button>
        </div>
      </div>

      {/* Inline Large Title & Permalink */}
      <div className="studio-headline-bar">
        <input
          type="text"
          className="inline-title-input"
          placeholder="Untitled Article (Click to enter Title)..."
          value={draft.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          id="input-inline-title"
          style={{
            borderBottom: !draft.title.trim() ? '2px dashed rgba(245, 158, 11, 0.4)' : undefined,
          }}
        />
        <div className="inline-slug-bar">
          <span>Permalink:</span>
          <code>posts/{draft.id || 'article'}.md</code>
          <span>&bull;</span>
          <span>{words} words</span>
          <span>&bull;</span>
          <span>{minutes} min read</span>
          {!isValid && (
            <button
              type="button"
              onClick={() => handleJumpToMissing(missingFields[0])}
              style={{
                color: 'var(--accent-amber)',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                padding: '0.15rem 0.55rem',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                marginLeft: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.74rem',
                fontWeight: 500,
              }}
              title="Click to jump to missing field"
            >
              <AlertCircle size={13} />
              <span>Missing: {missingFields.map((f) => f.label).join(', ')} (click to edit)</span>
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Article Settings Drawer */}
      {showSettings && (
        <section className="settings-drawer" id="panel-article-settings">
          <div className="form-field">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              id="select-cms-category"
            >
              <option value="Philosophy">Philosophy</option>
              <option value="Architecture">Architecture</option>
              <option value="Engineering">Engineering</option>
              <option value="DevOps">DevOps</option>
              <option value="Tutorials">Tutorials</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Author *</label>
            <input
              type="text"
              className="form-input"
              value={draft.author}
              onChange={(e) => setDraft({ ...draft, author: e.target.value })}
              id="input-cms-author"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              id="input-cms-date"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Language</label>
            <select
              className="form-select"
              value={draft.language}
              onChange={(e) => setDraft({ ...draft, language: e.target.value })}
              id="select-cms-language"
            >
              <option value="en">English (en)</option>
              <option value="mni">Meetei Mayek (mni)</option>
              <option value="fr">French (fr)</option>
              <option value="es">Spanish (es)</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Banner Image *</label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="text"
                className="form-input"
                style={{ flex: 1 }}
                placeholder="images/banner.png"
                value={draft.thumbnail}
                onChange={(e) => setDraft({ ...draft, thumbnail: e.target.value, thumbnailPreviewUrl: '' })}
                id="input-cms-thumbnail"
              />
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="btn-secondary"
                style={{ padding: '0 0.75rem', fontSize: '0.78rem' }}
                title="Browse Image or PDF for Banner"
              >
                Browse
              </button>
            </div>
          </div>

          <div className="form-field" style={{ justifyContent: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '1rem', fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                id="checkbox-cms-featured"
              />
              <span>Feature on publication hero</span>
            </label>
          </div>

          <div className="form-field" style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                Summary (Card snippet for readers) *
              </label>
              {draft.content && (
                <button
                  type="button"
                  onClick={() => {
                    const lines = draft.content.split('\n');
                    const firstPara = lines.find(
                      (l) => l.trim().length > 0 && !l.trim().startsWith('#') && !l.trim().startsWith('!') && !l.trim().startsWith('```')
                    );
                    if (firstPara) {
                      setDraft((prev) => ({ ...prev, summary: firstPara.trim().slice(0, 160) }));
                    }
                  }}
                  className="btn-secondary"
                  style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', height: 'auto' }}
                  title="Extract first paragraph as summary"
                >
                  Auto-fill from content
                </button>
              )}
            </div>
            <textarea
              rows={2}
              className="form-textarea"
              placeholder="Short 2-line overview of the article..."
              value={draft.summary}
              onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
              id="textarea-cms-summary"
              style={{
                borderColor: !draft.summary.trim() ? 'rgba(245, 158, 11, 0.6)' : undefined,
              }}
            />
          </div>
        </section>
      )}

      {/* Attached Media Strip */}
      <section className="media-strip">
        <div className="media-strip-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Paperclip size={14} color="var(--accent-indigo)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Attached Pictures &amp; PDF Pages ({draft.assets.length})
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              (PDFs automatically rasterize to pictures)
            </span>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingPdf}
            className="btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', gap: '0.35rem' }}
            id="btn-upload-media"
          >
            {isProcessingPdf ? (
              <>
                <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Rasterizing PDF Pages...</span>
              </>
            ) : (
              <>
                <FileUp size={13} />
                <span>Upload PDF or Image</span>
              </>
            )}
          </button>
        </div>

        {isProcessingPdf && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-cyan)', fontSize: '0.82rem' }}>
            <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
            <span>Processing document &bull; Rendering PDF pages into crisp pictures...</span>
          </div>
        )}

        {draft.assets.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="media-dropzone"
          >
            Drop PDF pages or images here, or click to upload. They will instantly appear as pictures.
          </div>
        ) : (
          <div className="media-pill-list">
            {draft.assets.map((asset) => (
              <div key={asset.name} className="media-pill-item">
                <img src={asset.previewUrl} alt={asset.name} className="media-pill-thumb" />
                <div style={{ minWidth: 0, maxWidth: '180px' }}>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {asset.name}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>
                    {(asset.size / 1024).toFixed(1)} KB
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleInsertAsset(asset)}
                  className="btn-ghost"
                  style={{ padding: '0.2rem 0.4rem', fontSize: '0.72rem' }}
                  title="Insert markdown link at cursor"
                >
                  <Plus size={12} />
                  <span>Insert</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRemoveAsset(asset.name)}
                  className="btn-ghost"
                  style={{ padding: '0.2rem 0.35rem', color: 'var(--text-muted)' }}
                  title="Delete asset"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Main Studio Workspace Grid */}
      <div className={`studio-workspace mode-${viewMode}`}>
        {/* Editor Pane (Hidden in preview mode) */}
        {viewMode !== 'preview' && (
          <div className="studio-pane">
            <div className="pane-header">
              <span>Markdown Source</span>
              <div className="pane-toolbar">
                <button type="button" onClick={() => insertMarkdownSyntax('# ')} className="pane-tool-btn" title="H1 Heading">H1</button>
                <button type="button" onClick={() => insertMarkdownSyntax('## ')} className="pane-tool-btn" title="H2 Heading">H2</button>
                <button type="button" onClick={() => insertMarkdownSyntax('**', '**')} className="pane-tool-btn" title="Bold">B</button>
                <button type="button" onClick={() => insertMarkdownSyntax('*', '*')} className="pane-tool-btn" title="Italic">I</button>
                <button type="button" onClick={() => insertMarkdownSyntax('> ')} className="pane-tool-btn" title="Quote">Quote</button>
                <button type="button" onClick={() => insertMarkdownSyntax('`', '`')} className="pane-tool-btn" title="Inline Code">Code</button>
                <button type="button" onClick={() => insertMarkdownSyntax('```\n', '\n```')} className="pane-tool-btn" title="Code Block">Block</button>
                <button type="button" onClick={() => insertMarkdownSyntax('- ')} className="pane-tool-btn" title="Bullet List">&bull; List</button>
                <button type="button" onClick={() => insertMarkdownSyntax('[', '](https://)')} className="pane-tool-btn" title="Link">Link</button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              className="studio-textarea"
              value={draft.content}
              onChange={(e) => {
                const val = e.target.value;
                setDraft((prev) => {
                  let nextTitle = prev.title;
                  let nextId = prev.id;
                  if (!prev.title.trim()) {
                    const match = val.match(/^#\s+([^\n]+)/m);
                    if (match && match[1].trim()) {
                      nextTitle = match[1].trim();
                      const slug = nextTitle
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-+|-+$/g, '');
                      if (slug) nextId = slug;
                    }
                  }
                  return {
                    ...prev,
                    content: val,
                    title: nextTitle,
                    id: nextId,
                  };
                });
              }}
              placeholder="Write your article in Markdown..."
              id="textarea-cms-content"
            />
          </div>
        )}

        {/* Live Preview Pane (Hidden in write mode) */}
        {viewMode !== 'write' && (
          <div className="studio-pane">
            <div className="pane-header">
              <span>Live Article Preview</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="studio-view-toggle">
                  <button
                    type="button"
                    className={`view-toggle-btn ${!isPreviewMeetei ? 'active' : ''}`}
                    onClick={() => setIsPreviewMeetei(false)}
                    style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}
                    id="btn-preview-lang-en"
                  >
                    <span>English</span>
                  </button>
                  <button
                    type="button"
                    className={`view-toggle-btn ${isPreviewMeetei ? 'active' : ''}`}
                    onClick={() => setIsPreviewMeetei(true)}
                    style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}
                    id="btn-preview-lang-mni"
                  >
                    <span style={{ fontFamily: 'var(--font-meetei)' }}>ꯃꯤꯇꯩ ꯃꯌꯦꯛ</span>
                  </button>
                </div>
                <span style={{ color: 'var(--accent-emerald)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-emerald)' }} />
                  <span>Auto-synced</span>
                </span>
              </div>
            </div>

            <div
              className={`studio-preview-pane markdown-body ${isPreviewMeetei ? 'lang-mni' : ''}`}
              dangerouslySetInnerHTML={{ __html: previewHtml }}
              id="cms-live-preview-container"
            />
          </div>
        )}
      </div>

      {/* GitHub Direct Publish Modal */}
      {showGitHubModal && (
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
            border: '1px solid var(--border-active)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '520px',
            width: '100%',
            padding: '2rem',
            boxShadow: 'var(--shadow-elevated)',
          }}>
            {publishStatus.success && publishResult?.postObj ? (
              <div>
                <div style={{ textAlign: 'center', padding: '0.5rem 0 1rem' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: 'var(--accent-emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                  }}>
                    <CheckCircle size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    Published to GitHub Successfully!
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Committed to <strong>posts/{draft.id || 'article'}.md</strong> in repository <strong>{githubRepo}</strong>.
                  </p>
                </div>

                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem 1rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '1.5rem',
                  lineHeight: 1.5,
                }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    ℹ️ Console 404 explanation:
                  </div>
                  Any red <code>404 (Not Found)</code> seen in DevTools console was only GitHub checking if the article already existed before creating it. Your post has been published and added to the reader!
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  {publishResult.postUrl && (
                    <a
                      href={publishResult.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                    >
                      <span>View Commit ↗</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setShowGitHubModal(false);
                      setPublishStatus({ loading: false, message: '' });
                      if (publishResult.postObj) {
                        onPreviewInFeed(publishResult.postObj);
                      }
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                  >
                    <BookOpen size={14} />
                    <span>View in Reader</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                  <Send size={18} color="var(--accent-cyan)" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Publish Directly to GitHub</h3>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  This will commit your article and all rendered images directly to <strong>{githubRepo}</strong> via the GitHub REST API, automatically triggering GitHub Actions to deploy.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                        <Key size={13} />
                        <span>GitHub Personal Access Token (repo scope)</span>
                      </label>
                      <a
                        href="https://github.com/settings/tokens/new?scopes=repo&description=Blog+CMS+Publish+Token"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}
                        title="Create a new personal access token with repo scope pre-selected"
                      >
                        <span>Create Token ↗</span>
                      </a>
                    </div>
                    <input
                      type="password"
                      className="form-input"
                      style={{ width: '100%' }}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      id="input-github-token"
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                      Token is stored only in your local browser storage.
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
                      id="input-github-repo"
                    />
                  </div>
                </div>

                {publishStatus.message && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    marginBottom: '1.25rem',
                    background: publishStatus.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
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
                    disabled={publishStatus.loading}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handlePublishToGitHub}
                    className="btn-primary"
                    disabled={publishStatus.loading}
                    id="btn-confirm-github-publish"
                  >
                    {publishStatus.loading ? (
                      <>
                        <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                        <span>Committing to Git...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Commit &amp; Publish</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {/* Meetei Mayek Translation & Character Tool */}
      {showMeeteiTool && (
        <MeeteiMayekTool
          onInsertText={(txt) => insertMarkdownSyntax(txt)}
          onClose={() => setShowMeeteiTool(false)}
          onTranslateFullDraft={() => {
            const translatedContent = translateMarkdownToMeeteiMayek(draft.content);
            const translatedTitle = translateToMeeteiMayekWithVocab(draft.title);
            setDraft((prev) => ({
              ...prev,
              title: translatedTitle || prev.title,
              content: translatedContent,
              language: 'mni',
            }));
            setShowMeeteiTool(false);
          }}
        />
      )}
    </div>
  );
};
