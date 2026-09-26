import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  BookOpen,
  Globe,
  HardDrive,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { extractPdfInfo, publishPdfToGitHub, publishExternalPdfToGitHub } from '../services/libraryService';
import { fetchFromInternetArchive } from '../services/internetArchiveService';
import { parseGoogleDriveUrl } from '../services/googleDriveService';
import type { PdfDocument, PdfUploadPayload, ExternalPdfPayload } from '../types';

interface PdfUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newDoc: PdfDocument) => void;
}

type SourceType = 'archive' | 'gdrive' | 'local';

export const PdfUploadModal: React.FC<PdfUploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  // Source selection tab
  const [sourceType, setSourceType] = useState<SourceType>('archive');

  // Local File State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState<boolean>(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  // External Source (Internet Archive & Google Drive) Inputs
  const [archiveInput, setArchiveInput] = useState<string>('');
  const [gdriveInput, setGdriveInput] = useState<string>('');
  const [fetchingExternal, setFetchingExternal] = useState<boolean>(false);
  const [externalPdfUrl, setExternalPdfUrl] = useState<string | null>(null);

  // Common Extracted Metadata
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>('');
  const [pageCount, setPageCount] = useState<number>(0);
  const [fileSizeBytes, setFileSizeBytes] = useState<number>(0);
  const [fileSizeFormatted, setFileSizeFormatted] = useState<string>('');

  // Form Fields (Editable by Admin)
  const [title, setTitle] = useState<string>('');
  const [docId, setDocId] = useState<string>('');
  const [author, setAuthor] = useState<string>('SLLK');
  const [category, setCategory] = useState<string>('Puya & History');
  const [language, setLanguage] = useState<string>('mni');
  const [description, setDescription] = useState<string>('');
  const [featured, setFeatured] = useState<boolean>(false);
  const [tagsInput, setTagsInput] = useState<string>('Puya, History, Manuscript');

  // GitHub Auth
  const [token, setToken] = useState<string>(
    () => localStorage.getItem('github_cms_token') || localStorage.getItem('github_pat') || ''
  );
  const [repo, setRepo] = useState<string>('Arnold-cd/blog-cms');

  // Upload state
  const [uploading, setUploading] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Reset document state
  const handleClearDocument = () => {
    setSelectedFile(null);
    setCoverFile(null);
    setExternalPdfUrl(null);
    setCoverPreviewUrl('');
    setPageCount(0);
    setFileSizeBytes(0);
    setFileSizeFormatted('');
    setExtractionError(null);
  };

  // Switch source tabs
  const handleTabChange = (type: SourceType) => {
    if (type !== sourceType) {
      setSourceType(type);
      handleClearDocument();
      setUploadError(null);
    }
  };

  // 1. Handle Local File Upload
  const handleFileSelect = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setExtractionError('Please select a valid PDF document (.pdf)');
      return;
    }

    setSelectedFile(file);
    setExtractionError(null);
    setExtracting(true);

    try {
      const info = await extractPdfInfo(file);
      setCoverPreviewUrl(info.coverPreviewUrl);
      setCoverFile(info.coverFile);
      setPageCount(info.pageCount);
      setFileSizeBytes(info.fileSizeBytes);
      setFileSizeFormatted(info.fileSizeFormatted);

      // Auto-populate Title and Slug
      const cleanName = file.name
        .replace(/\.pdf$/i, '')
        .replace(/[-_]+/g, ' ')
        .trim();
      const generatedTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      const generatedSlug = cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      if (!title) setTitle(generatedTitle);
      if (!docId) setDocId(generatedSlug);
    } catch (err: any) {
      console.error('PDF extraction error:', err);
      setExtractionError(err.message || 'Could not parse PDF. Ensure the file is not corrupted.');
    } finally {
      setExtracting(false);
    }
  };

  // 2. Handle Fetching from Internet Archive
  const handleFetchInternetArchive = async () => {
    if (!archiveInput.trim()) return;
    setFetchingExternal(true);
    setUploadError(null);
    setExtractionError(null);

    try {
      const data = await fetchFromInternetArchive(archiveInput);

      // Auto-fill form fields
      setTitle(data.title);
      setDocId(data.id.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
      if (data.author) setAuthor(data.author);
      if (data.description) setDescription(data.description);
      setCoverPreviewUrl(data.coverUrl);
      setExternalPdfUrl(data.pdfUrl);
      setPageCount(data.pageCount);
      setFileSizeBytes(data.fileSizeBytes);
      setFileSizeFormatted(data.fileSizeFormatted);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to fetch from Internet Archive');
    } finally {
      setFetchingExternal(false);
    }
  };

  // 3. Handle Loading from Google Drive
  const handleLoadGoogleDrive = () => {
    if (!gdriveInput.trim()) return;
    setUploadError(null);
    setExtractionError(null);

    try {
      const data = parseGoogleDriveUrl(gdriveInput);
      setExternalPdfUrl(data.pdfUrl);
      setCoverPreviewUrl(data.coverUrl);
      setFileSizeFormatted('Google Drive Cloud');
      setFileSizeBytes(0);
      setPageCount(0);

      // Suggest Title and Slug if empty
      if (!title) {
        setTitle('Google Drive Document');
      }
      if (!docId) {
        setDocId(data.suggestedSlug);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Invalid Google Drive link');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isExternal = sourceType === 'archive' || sourceType === 'gdrive';

    if (isExternal && !externalPdfUrl) {
      setUploadError(
        sourceType === 'archive'
          ? 'Please fetch a document from Internet Archive first.'
          : 'Please load a Google Drive document link first.'
      );
      return;
    }

    if (!isExternal && (!selectedFile || !coverFile)) {
      setUploadError('Please select a local PDF document first.');
      return;
    }

    if (!token.trim()) {
      setUploadError('GitHub Personal Access Token is required to commit to repository.');
      return;
    }
    if (!docId.trim() || !title.trim()) {
      setUploadError('Document Title and ID/Slug are required.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    localStorage.setItem('github_pat', token.trim());
    localStorage.setItem('github_cms_token', token.trim());

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (isExternal && externalPdfUrl) {
        // External PDF (Internet Archive or Google Drive) -> Only update library.json!
        const payload: ExternalPdfPayload = {
          id: docId.trim(),
          title: title.trim(),
          description: description.trim(),
          author: author.trim(),
          category: category.trim(),
          language: language.trim(),
          published_date: new Date().toISOString().split('T')[0],
          file_name: `${docId.trim()}.pdf`,
          pdf_url: externalPdfUrl,
          cover_url: coverPreviewUrl || '',
          page_count: pageCount,
          file_size_bytes: fileSizeBytes,
          file_size_formatted: fileSizeFormatted || (sourceType === 'gdrive' ? 'Google Drive Cloud' : 'Internet Archive'),
          featured,
          tags,
          source_type: sourceType,
        };

        const res = await publishExternalPdfToGitHub(token, repo, payload, (msg) => setProgressMsg(msg));
        setUploading(false);

        if (res.success && res.doc) {
          onSuccess(res.doc);
          onClose();
        } else {
          setUploadError(res.message);
        }
      } else if (selectedFile && coverFile) {
        // Local File -> Uploads PDF binary, cover PNG, and updates library.json
        const payload: PdfUploadPayload = {
          id: docId.trim(),
          title: title.trim(),
          description: description.trim(),
          author: author.trim(),
          category: category.trim(),
          language: language.trim(),
          published_date: new Date().toISOString().split('T')[0],
          pdfFile: selectedFile,
          coverFile: coverFile,
          coverPreviewUrl: coverPreviewUrl,
          page_count: pageCount,
          file_size_bytes: fileSizeBytes,
          file_size_formatted: fileSizeFormatted,
          featured,
          tags,
        };

        const res = await publishPdfToGitHub(token, repo, payload, (msg) => setProgressMsg(msg));
        setUploading(false);

        if (res.success && res.doc) {
          onSuccess(res.doc);
          onClose();
        } else {
          setUploadError(res.message);
        }
      }
    } catch (err: any) {
      setUploading(false);
      setUploadError(err.message || 'An unexpected error occurred while saving.');
    }
  };

  const isDocumentReady = Boolean(externalPdfUrl || selectedFile);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '660px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'rgba(217, 119, 6, 0.12)',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BookOpen size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>Add PDF to Library</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Sync with mobile e-library without consuming server storage
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '4px',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Source Selector Pills */}
        <div className="source-selector-bar">
          <button
            type="button"
            onClick={() => handleTabChange('archive')}
            className="source-selector-btn"
            style={{
              background: sourceType === 'archive' ? '#d97706' : 'transparent',
              color: sourceType === 'archive' ? '#fff' : 'var(--text-secondary)',
              fontWeight: sourceType === 'archive' ? 600 : 400,
            }}
          >
            <Globe size={14} />
            <span>Internet Archive</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('gdrive')}
            className="source-selector-btn"
            style={{
              background: sourceType === 'gdrive' ? '#d97706' : 'transparent',
              color: sourceType === 'gdrive' ? '#fff' : 'var(--text-secondary)',
              fontWeight: sourceType === 'gdrive' ? 600 : 400,
            }}
          >
            <HardDrive size={14} />
            <span>Google Drive</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('local')}
            className="source-selector-btn"
            style={{
              background: sourceType === 'local' ? '#d97706' : 'transparent',
              color: sourceType === 'local' ? '#fff' : 'var(--text-secondary)',
              fontWeight: sourceType === 'local' ? 600 : 400,
            }}
          >
            <UploadCloud size={14} />
            <span>Upload Local PDF</span>
          </button>
        </div>

        {uploadError && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#ef4444',
              marginBottom: '1rem',
              fontSize: '0.85rem',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{uploadError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Top Document Preview or Fetch Inputs */}
          {isDocumentReady ? (
            /* Document Active Preview Card */
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                background: 'rgba(217, 119, 6, 0.04)',
                border: '1px solid rgba(217, 119, 6, 0.3)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.25rem',
                alignItems: 'center',
              }}
            >
              {/* Cover Preview */}
              <div
                style={{
                  width: '80px',
                  height: '110px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  background: '#1a1a1f',
                  flexShrink: 0,
                  border: '1px solid var(--border-active)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {extracting ? (
                  <Loader2 size={24} className="spin" style={{ color: '#d97706' }} />
                ) : coverPreviewUrl ? (
                  <img
                    src={coverPreviewUrl}
                    alt="Cover preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <FileText size={32} style={{ color: '#888' }} />
                )}
              </div>

              {/* Document Details & Quick Actions */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.92rem', wordBreak: 'break-all' }}>
                    {title || selectedFile?.name || 'Document Ready'}
                  </span>
                  <Sparkles size={14} style={{ color: '#d97706', flexShrink: 0 }} />
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {pageCount > 0 && <span>📄 {pageCount} pages •</span>}
                  <span>💾 {fileSizeFormatted || 'Ready'}</span>
                  <span>•</span>
                  <span style={{ color: '#10b981' }}>
                    {sourceType === 'archive'
                      ? '🌐 Hosted on Archive.org'
                      : sourceType === 'gdrive'
                      ? '☁️ Hosted on Google Drive'
                      : 'Cover rasterized'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  {externalPdfUrl && (
                    <a
                      href={externalPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '0.78rem',
                        color: '#d97706',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontWeight: 500,
                      }}
                    >
                      <span>Preview Source PDF</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={handleClearDocument}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <RotateCcw size={12} />
                    <span>Change Document</span>
                  </button>
                </div>
              </div>
            </div>
          ) : sourceType === 'archive' ? (
            /* Internet Archive Input Bar */
            <div
              style={{
                border: '2px dashed var(--border-active)',
                borderRadius: '12px',
                padding: '1.75rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.02)',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <Globe size={32} style={{ margin: '0 auto 0.5rem', color: '#d97706' }} />
                <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.25rem' }}>
                  Fetch PDF from Internet Archive
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Paste any archive.org URL or item identifier to auto-extract title, cover, and streaming link
                </p>
              </div>

              <div className="fetch-input-row">
                <input
                  type="text"
                  className="input"
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                  }}
                  value={archiveInput}
                  onChange={(e) => setArchiveInput(e.target.value)}
                  placeholder="e.g. https://archive.org/details/principlesofecon0000mars"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleFetchInternetArchive();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleFetchInternetArchive}
                  disabled={fetchingExternal || !archiveInput.trim()}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    background: '#d97706',
                    borderColor: '#b45309',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {fetchingExternal ? (
                    <>
                      <Loader2 size={14} className="spin" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <span>Fetch & Auto-fill</span>
                  )}
                </button>
              </div>
            </div>
          ) : sourceType === 'gdrive' ? (
            /* Google Drive Input Bar */
            <div
              style={{
                border: '2px dashed var(--border-active)',
                borderRadius: '12px',
                padding: '1.75rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.02)',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <HardDrive size={32} style={{ margin: '0 auto 0.5rem', color: '#d97706' }} />
                <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.25rem' }}>
                  Connect PDF from Google Drive
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Paste a share link set to "Anyone with the link can view". Cover & streaming links are auto-generated.
                </p>
              </div>

              <div className="fetch-input-row">
                <input
                  type="text"
                  className="input"
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                  }}
                  value={gdriveInput}
                  onChange={(e) => setGdriveInput(e.target.value)}
                  placeholder="https://drive.google.com/file/d/1A2B3C.../view?usp=sharing"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleLoadGoogleDrive();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleLoadGoogleDrive}
                  disabled={!gdriveInput.trim()}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    background: '#d97706',
                    borderColor: '#b45309',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Load from Drive
                </button>
              </div>
            </div>
          ) : (
            /* Local PDF Dropzone */
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                border: '2px dashed var(--border-active)',
                borderRadius: '12px',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
                cursor: 'pointer',
                marginBottom: '1.25rem',
                transition: 'border-color 0.2s ease',
              }}
              onClick={() => document.getElementById('pdf-file-input')?.click()}
            >
              <UploadCloud size={36} style={{ margin: '0 auto 0.75rem', color: '#d97706' }} />
              <div style={{ fontWeight: 600, marginBottom: '0.35rem' }}>
                Drag and drop your PDF here, or <span style={{ color: '#d97706', textDecoration: 'underline' }}>browse</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Cover thumbnail will be auto-generated from Page 1
              </p>
              <input
                id="pdf-file-input"
                type="file"
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
            </div>
          )}

          {extractionError && (
            <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>{extractionError}</p>
          )}

          {/* Metadata Fields (Always Editable by Admin!) */}
          <div className="modal-form-grid">
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Document Title * (Editable)
              </label>
              <input
                type="text"
                className="input"
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Ancient Manipuri Puya Chronicles"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Document ID / Slug *
              </label>
              <input
                type="text"
                className="input"
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}
                value={docId}
                onChange={(e) => setDocId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                placeholder="e.g. ancient-puya-chronicles"
                required
              />
            </div>
          </div>

          <div className="modal-form-grid">
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Author / Organization
              </label>
              <input
                type="text"
                className="input"
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. SLLK Archives"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Category
              </label>
              <select
                className="input"
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Puya & History">Puya & History</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Literature">Literature</option>
                <option value="Culture & Heritage">Culture & Heritage</option>
                <option value="Research & Papers">Research & Papers</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div className="modal-form-grid">
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Language
              </label>
              <select
                className="input"
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="mni">Meetei Mayek (mni)</option>
                <option value="en">English (en)</option>
                <option value="bilingual">Bilingual (mni/en)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Tags (comma-separated)
              </label>
              <input
                type="text"
                className="input"
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Manuscript, Puya, History"
              />
            </div>
          </div>

          <div style={{ marginBottom: '0.85rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Description / Summary
            </label>
            <textarea
              className="input"
              rows={2}
              style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', resize: 'vertical' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the document contents for mobile app preview..."
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="checkbox"
              id="pdf-featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
            />
            <label htmlFor="pdf-featured" style={{ fontSize: '0.82rem', cursor: 'pointer', userSelect: 'none' }}>
              Feature this document in Mobile App Library header
            </label>
          </div>

          {/* GitHub Credentials Section */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '0.85rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              Target Repository & GitHub Token
            </div>
            <div className="modal-form-grid" style={{ marginBottom: 0 }}>
              <input
                type="text"
                className="input"
                style={{ padding: '0.5rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem' }}
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="owner/repo"
              />
              <input
                type="password"
                className="input"
                style={{ padding: '0.5rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem' }}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Personal Access Token (ghp_...)"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions-row">
            {uploading && (
              <span style={{ fontSize: '0.8rem', color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Loader2 size={14} className="spin" />
                {progressMsg || 'Saving to repository...'}
              </span>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={uploading}
              style={{ padding: '0.55rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading || !isDocumentReady || extracting}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                background: '#d97706',
                borderColor: '#b45309',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              {uploading ? (
                <>
                  <Loader2 size={15} className="spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  <span>Publish to Repo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
