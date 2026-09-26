import React, { useState } from 'react';
import { X, Cloud, Globe, HardDrive, Image as ImageIcon, FileText, Check, AlertCircle, Loader2 } from 'lucide-react';
import { extractGoogleDriveId } from '../services/googleDriveService';
import { extractArchiveId, fetchFromInternetArchive } from '../services/internetArchiveService';

interface CloudAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (markdownSnippet: string) => void;
}

type Provider = 'gdrive' | 'archive';
type AssetType = 'image' | 'pdf';

export const CloudAssetModal: React.FC<CloudAssetModalProps> = ({ isOpen, onClose, onInsert }) => {
  const [provider, setProvider] = useState<Provider>('gdrive');
  const [assetType, setAssetType] = useState<AssetType>('image');

  // Inputs
  const [urlInput, setUrlInput] = useState('');
  const [caption, setCaption] = useState('');

  // States
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const [previewCoverUrl, setPreviewCoverUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProviderChange = (p: Provider) => {
    setProvider(p);
    setError(null);
    setPreviewCoverUrl(null);
    if (p === 'archive' && assetType === 'image') {
      setAssetType('pdf'); // default to PDF for archive.org
    }
  };

  const handleFetchArchive = async () => {
    if (!urlInput.trim()) return;
    setFetching(true);
    setError(null);
    try {
      const data = await fetchFromInternetArchive(urlInput);
      setCaption(data.title || '');
      setPreviewCoverUrl(data.coverUrl);
    } catch (err: any) {
      setError(err.message || 'Could not fetch details from Internet Archive');
    } finally {
      setFetching(false);
    }
  };

  const generateSnippet = (): string => {
    const trimmedInput = urlInput.trim();
    if (!trimmedInput) return '';

    if (provider === 'gdrive') {
      const fileId = extractGoogleDriveId(trimmedInput);
      if (!fileId) return '';

      const alt = caption.trim() || 'Attached Document';
      if (assetType === 'image') {
        // High-res direct image stream from Google Drive
        return `\n\n![${alt}](https://drive.google.com/thumbnail?id=${fileId}&sz=w1200)\n\n`;
      } else {
        // Styled markdown callout link for PDF
        return `\n\n> 📄 **Attached Document:** [${alt} (PDF) ↗](https://drive.google.com/file/d/${fileId}/view)\n\n`;
      }
    } else {
      // Internet Archive
      const cleanId = extractArchiveId(trimmedInput);
      if (!cleanId) return '';

      const alt = caption.trim() || cleanId;
      if (assetType === 'image') {
        return `\n\n![${alt}](https://archive.org/services/img/${cleanId})\n\n`;
      } else {
        return `\n\n> 🏛️ **Historical Source:** [${alt} (Internet Archive) ↗](https://archive.org/details/${cleanId})\n\n`;
      }
    }
  };

  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const snippet = generateSnippet();
    if (!snippet) {
      setError(
        provider === 'gdrive'
          ? 'Please enter a valid Google Drive file share link.'
          : 'Please enter a valid Internet Archive URL or Identifier.'
      );
      return;
    }

    onInsert(snippet);
    onClose();
    // Reset state
    setUrlInput('');
    setCaption('');
    setPreviewCoverUrl(null);
  };

  const snippet = generateSnippet();

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '580px', width: '92%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.12)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Cloud size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>Embed Cloud Image or PDF</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Attach large files from cloud storage (0 bytes added to GitHub or Vercel)
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

        {/* Provider Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.4rem',
            padding: '0.3rem',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => handleProviderChange('gdrive')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.75rem',
              fontSize: '0.82rem',
              fontWeight: provider === 'gdrive' ? 600 : 400,
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              background: provider === 'gdrive' ? 'var(--accent-cyan)' : 'transparent',
              color: provider === 'gdrive' ? '#000' : 'var(--text-secondary)',
              transition: 'all 0.15s ease',
            }}
          >
            <HardDrive size={15} />
            <span>Google Drive</span>
          </button>

          <button
            type="button"
            onClick={() => handleProviderChange('archive')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.75rem',
              fontSize: '0.82rem',
              fontWeight: provider === 'archive' ? 600 : 400,
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              background: provider === 'archive' ? '#d97706' : 'transparent',
              color: provider === 'archive' ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.15s ease',
            }}
          >
            <Globe size={15} />
            <span>Internet Archive</span>
          </button>
        </div>

        <form onSubmit={handleInsert}>
          {/* Asset Type Selector */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Asset Type
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setAssetType('image')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: `1px solid ${assetType === 'image' ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                  background: assetType === 'image' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  color: assetType === 'image' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: assetType === 'image' ? 600 : 400,
                }}
              >
                <ImageIcon size={16} />
                <span>Inline Image / Photo</span>
              </button>

              <button
                type="button"
                onClick={() => setAssetType('pdf')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: `1px solid ${assetType === 'pdf' ? '#d97706' : 'var(--border-subtle)'}`,
                  background: assetType === 'pdf' ? 'rgba(217, 119, 6, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  color: assetType === 'pdf' ? '#d97706' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: assetType === 'pdf' ? 600 : 400,
                }}
              >
                <FileText size={16} />
                <span>PDF Document / Reader Link</span>
              </button>
            </div>
          </div>

          {/* URL Input */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                {provider === 'gdrive' ? 'Google Drive Share Link *' : 'Internet Archive URL or Identifier *'}
              </label>
              {provider === 'archive' && (
                <button
                  type="button"
                  onClick={handleFetchArchive}
                  disabled={fetching || !urlInput.trim()}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#d97706',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: 0,
                  }}
                >
                  {fetching ? <Loader2 size={12} className="spin" /> : null}
                  <span>Auto-fetch title</span>
                </button>
              )}
            </div>

            <input
              type="text"
              className="input"
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setError(null);
              }}
              placeholder={
                provider === 'gdrive'
                  ? 'https://drive.google.com/file/d/1A2B3C.../view?usp=sharing'
                  : 'e.g. principlesofecon0000mars or https://archive.org/details/...'
              }
              required
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.3rem' }}>
              {provider === 'gdrive'
                ? 'Make sure "Anyone with the link can view" is enabled on Google Drive.'
                : 'All Internet Archive items are permanently hosted and public.'}
            </span>
          </div>

          {/* Caption / Alt Text Input */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              {assetType === 'image' ? 'Image Caption / Alt Text' : 'Document Link Label'}
            </label>
            <input
              type="text"
              className="input"
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={
                assetType === 'image'
                  ? 'e.g. Ancient Manipuri Puya Folio 1'
                  : 'e.g. Read Complete Wakoklon Puya Manuscript'
              }
            />
          </div>

          {previewCoverUrl && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <img
                src={previewCoverUrl}
                alt="Cover Preview"
                style={{ width: '42px', height: '56px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <div>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Cover Thumbnail Detected</span>
                <p style={{ margin: '0.15rem 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Auto-linked from Internet Archive
                </p>
              </div>
            </div>
          )}

          {error && (
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
                fontSize: '0.82rem',
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Snippet Preview */}
          {snippet && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Markdown snippet that will be inserted:
              </div>
              <code style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', wordBreak: 'break-all' }}>
                {snippet.trim()}
              </code>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ padding: '0.55rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!urlInput.trim()}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Check size={15} />
              <span>Insert into Article</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
