import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  RefreshCw,
  BookOpen,
  Download,
  ExternalLink,
  Trash2,
  FileText,
  Sparkles,
  Tag,
  Calendar,
  User,
  AlertTriangle,
  Loader2,
  Key,
} from 'lucide-react';
import type { PdfDocument } from '../types';
import { deletePdfFromGitHub, resolvePdfAssetUrl } from '../services/libraryService';
import { PdfUploadModal } from './PdfUploadModal';

interface PdfLibraryViewProps {
  documents: PdfDocument[];
  loading: boolean;
  onRefresh: () => void;
  onDocumentAdded: (newDoc: PdfDocument) => void;
  onDocumentDeleted: (deletedId: string) => void;
}

export const PdfLibraryView: React.FC<PdfLibraryViewProps> = ({
  documents,
  loading,
  onRefresh,
  onDocumentAdded,
  onDocumentDeleted,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmDeleteDoc, setConfirmDeleteDoc] = useState<PdfDocument | null>(null);
  const [deleteToken, setDeleteToken] = useState<string>(
    () => localStorage.getItem('github_cms_token') || localStorage.getItem('github_pat') || ''
  );

  // Categories extraction
  const categories = useMemo(() => {
    const set = new Set<string>();
    documents.forEach((d) => {
      if (d.category) set.add(d.category);
    });
    return ['All', ...Array.from(set)];
  }, [documents]);

  // Filtering
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesCategory =
        selectedCategory === 'All' || doc.category?.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.author.toLowerCase().includes(q) ||
        doc.description?.toLowerCase().includes(q) ||
        doc.tags?.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [documents, selectedCategory, searchQuery]);

  const handleDelete = async (doc: PdfDocument) => {
    const token =
      deleteToken.trim() ||
      localStorage.getItem('github_cms_token') ||
      localStorage.getItem('github_pat') ||
      '';
    if (!token) {
      setDeleteError('GitHub Personal Access Token is required to perform document deletions.');
      return;
    }

    localStorage.setItem('github_cms_token', token);
    localStorage.setItem('github_pat', token);
    setDeletingId(doc.id);
    setDeleteError(null);

    const res = await deletePdfFromGitHub(token, 'Arnold-cd/blog-cms', doc);
    setDeletingId(null);

    if (res.success) {
      setConfirmDeleteDoc(null);
      onDocumentDeleted(doc.id);
    } else {
      setDeleteError(res.message);
    }
  };

  const handleOpenPdf = async (e: React.MouseEvent, doc: PdfDocument) => {
    e.preventDefault();
    const resolved = resolvePdfAssetUrl(doc.pdf_url);

    // 1. Try checking if local/Vercel asset is available
    try {
      const res = await fetch(resolved, { method: 'HEAD' });
      if (res.ok) {
        window.open(resolved, '_blank', 'noopener,noreferrer');
        return;
      }
    } catch {
      // not yet deployed or network issue
    }

    // 2. If 404 (e.g. Vercel deployment still in progress) and admin has token, stream raw from GitHub API directly
    const token = localStorage.getItem('github_cms_token') || localStorage.getItem('github_pat') || '';
    if (token) {
      try {
        const rawRes = await fetch(
          `https://api.github.com/repos/Arnold-cd/blog-cms/contents/library/pdfs/${encodeURIComponent(doc.file_name)}`,
          {
            headers: {
              Authorization: `Bearer ${token.trim()}`,
              Accept: 'application/vnd.github.v3.raw',
            },
          }
        );
        if (rawRes.ok) {
          const blob = await rawRes.blob();
          const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
          window.open(blobUrl, '_blank', 'noopener,noreferrer');
          return;
        }
      } catch (ghErr) {
        console.warn('GitHub API direct stream fallback failed:', ghErr);
      }
    }

    // 3. Fallback: Open resolved URL directly
    window.open(resolved, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadPdf = async (e: React.MouseEvent, doc: PdfDocument) => {
    e.preventDefault();
    const resolved = resolvePdfAssetUrl(doc.pdf_url);

    try {
      const res = await fetch(resolved, { method: 'HEAD' });
      if (res.ok) {
        const a = document.createElement('a');
        a.href = resolved;
        a.download = doc.file_name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }
    } catch {}

    const token = localStorage.getItem('github_cms_token') || localStorage.getItem('github_pat') || '';
    if (token) {
      try {
        const rawRes = await fetch(
          `https://api.github.com/repos/Arnold-cd/blog-cms/contents/library/pdfs/${encodeURIComponent(doc.file_name)}`,
          {
            headers: {
              Authorization: `Bearer ${token.trim()}`,
              Accept: 'application/vnd.github.v3.raw',
            },
          }
        );
        if (rawRes.ok) {
          const blob = await rawRes.blob();
          const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = doc.file_name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
          return;
        }
      } catch (ghErr) {
        console.warn('GitHub API direct download fallback failed:', ghErr);
      }
    }

    const a = document.createElement('a');
    a.href = resolved;
    a.download = doc.file_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="feed-container" style={{ paddingBottom: '4rem' }}>
      {/* Top Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.08) 0%, rgba(180, 83, 9, 0.02) 100%)',
          border: '1px solid rgba(217, 119, 6, 0.2)',
          borderRadius: '16px',
          padding: '1.75rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: 'rgba(217, 119, 6, 0.15)',
                color: '#d97706',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
              }}
            >
              Document Repository
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {documents.length} Available Documents
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            PDF Library & Manuscripts
          </h1>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Store manuscripts, academic papers, and historical publications directly in your Git repository.
            Synced automatically to the Flutter mobile e-library.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onRefresh}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem' }}
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsUploadModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1.25rem',
              background: '#d97706',
              borderColor: '#b45309',
            }}
          >
            <Plus size={16} />
            <span>Upload PDF</span>
          </button>
        </div>
      </div>

      {deleteError && (
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
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
          }}
        >
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span>{deleteError}</span>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                background:
                  selectedCategory === cat
                    ? 'rgba(217, 119, 6, 0.15)'
                    : 'rgba(255, 255, 255, 0.04)',
                color: selectedCategory === cat ? '#d97706' : 'var(--text-secondary)',
                border: `1px solid ${
                  selectedCategory === cat ? 'rgba(217, 119, 6, 0.4)' : 'var(--border-subtle)'
                }`,
                borderRadius: '999px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: selectedCategory === cat ? 600 : 400,
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)',
            }}
          />
          <input
            type="text"
            className="input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents or tags..."
            style={{
              width: '100%',
              paddingLeft: '2.5rem',
              paddingRight: '0.85rem',
              paddingTop: '0.45rem',
              paddingBottom: '0.45rem',
              fontSize: '0.85rem',
              borderRadius: '999px',
            }}
          />
        </div>
      </div>

      {/* Grid of Documents */}
      {filteredDocuments.length === 0 ? (
        <div
          style={{
            border: '1px dashed var(--border-subtle)',
            borderRadius: '16px',
            padding: '4rem 2rem',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.01)',
          }}
        >
          <BookOpen size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: 600 }}>No PDF documents found</h3>
          <p style={{ margin: '0 auto 1.5rem', color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '420px' }}>
            {searchQuery || selectedCategory !== 'All'
              ? 'Try changing your search keywords or category filters.'
              : 'Add your first document to the repository using the button below.'}
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsUploadModalOpen(true)}
            style={{
              padding: '0.6rem 1.25rem',
              background: '#d97706',
              borderColor: '#b45309',
            }}
          >
            <Plus size={16} style={{ marginRight: '0.35rem' }} />
            <span>Upload New PDF</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
              }}
            >
              {/* Card Top: Cover Preview Banner & Badges */}
              <div
                style={{
                  height: '180px',
                  background: 'linear-gradient(135deg, #1c1c22 0%, #121216 100%)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                {doc.cover_url ? (
                  <img
                    src={resolvePdfAssetUrl(doc.cover_url)}
                    alt={doc.title}
                    style={{
                      maxHeight: '160px',
                      maxWidth: '120px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      boxShadow: '0 6px 18px rgba(0, 0, 0, 0.45)',
                      transform: 'perspective(600px) rotateY(-8deg)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      const token = localStorage.getItem('github_cms_token') || localStorage.getItem('github_pat') || '';
                      if (token && doc.cover_url && !img.dataset.triedGithub) {
                        img.dataset.triedGithub = 'true';
                        const coverName = doc.cover_url.split('/').pop();
                        if (coverName) {
                          fetch(
                            `https://api.github.com/repos/Arnold-cd/blog-cms/contents/library/covers/${encodeURIComponent(coverName)}`,
                            {
                              headers: {
                                Authorization: `Bearer ${token.trim()}`,
                                Accept: 'application/vnd.github.v3.raw',
                              },
                            }
                          )
                            .then((res) => (res.ok ? res.blob() : null))
                            .then((blob) => {
                              if (blob) img.src = URL.createObjectURL(blob);
                              else img.style.display = 'none';
                            })
                            .catch(() => {
                              img.style.display = 'none';
                            });
                          return;
                        }
                      }
                      img.style.display = 'none';
                    }}
                  />
                ) : (
                  <FileText size={48} style={{ color: '#d97706', opacity: 0.6 }} />
                )}

                {/* Badges on top */}
                <div
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    display: 'flex',
                    gap: '0.4rem',
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(0, 0, 0, 0.75)',
                      backdropFilter: 'blur(6px)',
                      color: '#fff',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    {doc.category || 'Document'}
                  </span>
                  {doc.featured && (
                    <span
                      style={{
                        background: '#d97706',
                        color: '#fff',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                      }}
                    >
                      <Sparkles size={11} />
                      Featured
                    </span>
                  )}
                </div>

                {/* File metrics badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0.75rem',
                    right: '0.75rem',
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(6px)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.72rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  📄 {doc.page_count} p • {doc.file_size_formatted || 'PDF'}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3
                  style={{
                    margin: '0 0 0.4rem',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    lineHeight: 1.35,
                    color: 'var(--text-primary)',
                  }}
                >
                  {doc.title}
                </h3>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.65rem',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <User size={13} />
                    {doc.author || 'SLLK'}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={13} />
                    {doc.published_date || 'Recent'}
                  </span>
                </div>

                <p
                  style={{
                    margin: '0 0 1rem',
                    fontSize: '0.84rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.45,
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {doc.description || 'No summary description provided.'}
                </p>

                {/* Tags */}
                {doc.tags && doc.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                    {doc.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.72rem',
                          background: 'rgba(255, 255, 255, 0.04)',
                          color: 'var(--text-secondary)',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                        }}
                      >
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Toolbar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <a
                    href={resolvePdfAssetUrl(doc.pdf_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleOpenPdf(e, doc)}
                    className="btn btn-secondary"
                    style={{
                      fontSize: '0.8rem',
                      padding: '0.4rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <ExternalLink size={13} />
                    <span>Open PDF</span>
                  </a>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a
                      href={resolvePdfAssetUrl(doc.pdf_url)}
                      download={doc.file_name}
                      onClick={(e) => handleDownloadPdf(e, doc)}
                      className="btn btn-secondary"
                      title="Download PDF file"
                      style={{
                        padding: '0.4rem 0.6rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Download size={14} />
                    </a>

                    <button
                      type="button"
                      className="btn-secondary btn-icon-danger"
                      onClick={() => {
                        setConfirmDeleteDoc(doc);
                        setDeleteError(null);
                      }}
                      title="Delete from repository"
                      style={{
                        padding: '0.4rem 0.6rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '34px',
                        height: '32px',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {confirmDeleteDoc && (
        <div
          className="modal-backdrop"
          onClick={() => {
            if (!deletingId) {
              setConfirmDeleteDoc(null);
              setDeleteError(null);
            }
          }}
        >
          <div
            className="modal-dialog"
            style={{ maxWidth: '460px', padding: '1.75rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(244, 63, 94, 0.12)',
                  color: 'var(--accent-rose)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                }}
              >
                <Trash2 size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>Delete Document?</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  This will remove the PDF and cover thumbnail from GitHub.
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete <strong style={{ color: 'var(--text-primary)' }}>{confirmDeleteDoc.title}</strong>?
            </p>

            {/* GitHub Token input */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.35rem',
                }}
              >
                <Key size={13} />
                <span>GitHub Personal Access Token</span>
              </label>
              <input
                type="password"
                className="input"
                style={{ width: '100%', fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={deleteToken}
                onChange={(e) => setDeleteToken(e.target.value)}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.3rem' }}>
                Requires repo permissions to commit deletions to GitHub.
              </span>
            </div>

            {deleteError && (
              <div
                style={{
                  padding: '0.7rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  background: 'rgba(244, 63, 94, 0.1)',
                  color: 'var(--accent-rose)',
                  border: '1px solid var(--accent-rose)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="modal-actions-row">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setConfirmDeleteDoc(null);
                  setDeleteError(null);
                }}
                disabled={deletingId === confirmDeleteDoc.id}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => handleDelete(confirmDeleteDoc)}
                disabled={deletingId === confirmDeleteDoc.id || !deleteToken.trim()}
              >
                {deletingId === confirmDeleteDoc.id ? (
                  <>
                    <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Deleting from Git...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    <span>Delete Document</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <PdfUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={(newDoc) => {
          onDocumentAdded(newDoc);
        }}
      />
    </div>
  );
};
