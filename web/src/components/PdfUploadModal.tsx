import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { extractPdfInfo, publishPdfToGitHub } from '../services/libraryService';
import type { PdfDocument, PdfUploadPayload } from '../types';

interface PdfUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newDoc: PdfDocument) => void;
}

export const PdfUploadModal: React.FC<PdfUploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState<boolean>(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  // Extracted Metadata
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [fileSizeBytes, setFileSizeBytes] = useState<number>(0);
  const [fileSizeFormatted, setFileSizeFormatted] = useState<string>('');

  // Form Fields
  const [title, setTitle] = useState<string>('');
  const [docId, setDocId] = useState<string>('');
  const [author, setAuthor] = useState<string>('SLLK');
  const [category, setCategory] = useState<string>('Puya & History');
  const [language, setLanguage] = useState<string>('mni');
  const [description, setDescription] = useState<string>('');
  const [featured, setFeatured] = useState<boolean>(false);
  const [tagsInput, setTagsInput] = useState<string>('Puya, History, Manuscript');

  // GitHub Auth
  const [token, setToken] = useState<string>(() => localStorage.getItem('github_pat') || '');
  const [repo, setRepo] = useState<string>('Arnold-cd/blog-cms');

  // Upload state
  const [uploading, setUploading] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

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
    if (!selectedFile || !coverFile) {
      setUploadError('Please select a PDF document first.');
      return;
    }
    if (!token.trim()) {
      setUploadError('GitHub Personal Access Token is required to commit to repository.');
      return;
    }
    if (!docId.trim() || !title.trim()) {
      setUploadError('Title and Document ID are required.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    localStorage.setItem('github_pat', token.trim());

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

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
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '640px', width: '92%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(217, 119, 6, 0.12)',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookOpen size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>Upload PDF to Library</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Store in repository and publish to mobile app & web
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
              borderRadius: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {uploadError && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#ef4444',
            marginBottom: '1rem',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{uploadError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* File Dropzone */}
          {!selectedFile ? (
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
                transition: 'border-color 0.2s ease'
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
          ) : (
            <div style={{
              display: 'flex',
              gap: '1rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.25rem',
              alignItems: 'center'
            }}>
              {/* Cover Preview */}
              <div style={{
                width: '80px',
                height: '110px',
                borderRadius: '6px',
                overflow: 'hidden',
                background: '#fff',
                flexShrink: 0,
                border: '1px solid var(--border-active)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                {extracting ? (
                  <Loader2 size={24} className="spin" style={{ color: '#d97706' }} />
                ) : coverPreviewUrl ? (
                  <img
                    src={coverPreviewUrl}
                    alt="Cover preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <FileText size={32} style={{ color: '#888' }} />
                )}
              </div>

              {/* PDF Info Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.92rem', wordBreak: 'break-all' }}>
                    {selectedFile.name}
                  </span>
                  <Sparkles size={14} style={{ color: '#d97706', flexShrink: 0 }} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <span>📄 {pageCount} pages</span>
                  <span>•</span>
                  <span>💾 {fileSizeFormatted}</span>
                  <span>•</span>
                  <span style={{ color: '#10b981' }}>Cover ready</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setCoverPreviewUrl('');
                    setCoverFile(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    padding: 0,
                    marginTop: '0.4rem',
                    textDecoration: 'underline'
                  }}
                >
                  Choose a different file
                </button>
              </div>
            </div>
          )}

          {extractionError && (
            <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>{extractionError}</p>
          )}

          {/* Metadata Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Document Title *
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
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
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              Target Repository & GitHub Token
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', alignItems: 'center' }}>
            {uploading && (
              <span style={{ fontSize: '0.8rem', color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Loader2 size={14} className="spin" />
                {progressMsg || 'Uploading...'}
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
              disabled={uploading || !selectedFile || extracting}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                background: '#d97706',
                borderColor: '#b45309',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
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
