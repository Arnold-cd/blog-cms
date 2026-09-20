import React, { useState } from 'react';
import {
  IYEK_IPEE,
  ADDITIONAL_IPEE,
  LONSUM,
  CHEITAP,
  NUMERALS,
  translateToMeeteiMayek,
} from '../services/meeteiMayekService';
import { Languages, Copy, Check, Plus, ExternalLink, X } from 'lucide-react';

interface MeeteiMayekToolProps {
  onInsertText: (text: string) => void;
  onClose: () => void;
  onTranslateFullDraft?: () => void;
}

export const MeeteiMayekTool: React.FC<MeeteiMayekToolProps> = ({ onInsertText, onClose, onTranslateFullDraft }) => {
  const [inputText, setInputText] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'translate' | 'ipee' | 'lonsum' | 'cheitap' | 'numerals'>('translate');

  const handleTranslate = () => {
    const result = translateToMeeteiMayek(inputText);
    setConvertedText(result);
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = (text: string) => {
    if (!text) return;
    onInsertText(text);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '1rem',
    }}>
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-active)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-elevated)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Languages size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                Meetei Mayek Translation &amp; Script Tool
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Powered by Google <strong>Noto Sans Meetei Mayek</strong> standard.{' '}
              <a
                href="https://notofonts.github.io/meetei-mayek/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-cyan)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}
              >
                <span>notofonts.github.io/meetei-mayek</span>
                <ExternalLink size={11} />
              </a>
            </p>
          </div>

          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`category-chip ${activeTab === 'translate' ? 'active' : ''}`}
            onClick={() => setActiveTab('translate')}
          >
            Translate / Transliterate
          </button>
          <button
            className={`category-chip ${activeTab === 'ipee' ? 'active' : ''}`}
            onClick={() => setActiveTab('ipee')}
          >
            Iyek Ipee (ꯀ-ꯑ)
          </button>
          <button
            className={`category-chip ${activeTab === 'lonsum' ? 'active' : ''}`}
            onClick={() => setActiveTab('lonsum')}
          >
            Lonsum (ꯛ-ꯢ)
          </button>
          <button
            className={`category-chip ${activeTab === 'cheitap' ? 'active' : ''}`}
            onClick={() => setActiveTab('cheitap')}
          >
            Cheitap &amp; Tone (ꯥ-꯫)
          </button>
          <button
            className={`category-chip ${activeTab === 'numerals' ? 'active' : ''}`}
            onClick={() => setActiveTab('numerals')}
          >
            Numerals (꯰-꯹)
          </button>
        </div>

        {/* Tab 1: Translation / Transliteration */}
        {activeTab === 'translate' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="form-label">English / Latin Phonetics or Bengali Script Input</label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="Type Latin words (e.g. kangleipak, meetei mayek, manipur, puya) or paste Bengali script text..."
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setConvertedText(translateToMeeteiMayek(e.target.value));
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button onClick={handleTranslate} className="btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}>
                Translate Input
              </button>
              {onTranslateFullDraft && (
                <button
                  type="button"
                  onClick={onTranslateFullDraft}
                  className="btn-secondary"
                  style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}
                >
                  <span style={{ fontFamily: "var(--font-meetei)" }}>ꯃ</span>
                  <span>Translate Entire Current Article</span>
                </button>
              )}
            </div>

            {convertedText && (
              <div style={{
                background: 'rgba(9, 9, 11, 0.8)',
                border: '1px solid var(--border-active)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="form-label" style={{ color: 'var(--accent-cyan)' }}>
                    Meetei Mayek Result (Noto Sans Meetei Mayek)
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleCopy(convertedText)}
                      className="btn-secondary"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      {copied ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => handleInsert(convertedText)}
                      className="btn-primary"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      <Plus size={12} />
                      <span>Insert into Article</span>
                    </button>
                  </div>
                </div>

                <div style={{
                  fontFamily: 'var(--font-meetei)',
                  fontSize: '1.4rem',
                  lineHeight: 1.8,
                  color: '#ffffff',
                  wordBreak: 'break-word',
                }}>
                  {convertedText}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Iyek Ipee (Core & Additional Consonants) */}
        {activeTab === 'ipee' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Click any character to insert it into your article at the cursor:
            </span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '0.6rem',
              maxHeight: '360px',
              overflowY: 'auto',
            }}>
              {[...IYEK_IPEE, ...ADDITIONAL_IPEE].map((item) => (
                <button
                  key={item.char}
                  onClick={() => handleInsert(item.char)}
                  className="btn-secondary"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0.65rem 0.5rem',
                    textAlign: 'center',
                    borderRadius: 'var(--radius-sm)',
                  }}
                  title={`Insert ${item.char} (${item.name})`}
                >
                  <span style={{ fontFamily: 'var(--font-meetei)', fontSize: '1.6rem', color: '#fff', lineHeight: 1.2 }}>
                    {item.char}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                    {item.name}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {item.meaning}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Lonsum */}
        {activeTab === 'lonsum' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Dependent final consonants (Lonsum):
            </span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '0.6rem',
            }}>
              {LONSUM.map((item) => (
                <button
                  key={item.char}
                  onClick={() => handleInsert(item.char)}
                  className="btn-secondary"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0.65rem 0.5rem',
                    textAlign: 'center',
                  }}
                  title={`Insert ${item.char} (${item.name})`}
                >
                  <span style={{ fontFamily: 'var(--font-meetei)', fontSize: '1.6rem', color: '#fff', lineHeight: 1.2 }}>
                    {item.char}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                    {item.name}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {item.meaning}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Cheitap & Punctuation */}
        {activeTab === 'cheitap' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Vowel signs (Cheitap) and Punctuation (Cheikhei):
            </span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '0.6rem',
            }}>
              {CHEITAP.map((item) => (
                <button
                  key={item.char}
                  onClick={() => handleInsert(item.char)}
                  className="btn-secondary"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0.65rem 0.5rem',
                    textAlign: 'center',
                  }}
                  title={`Insert ${item.char} (${item.name})`}
                >
                  <span style={{ fontFamily: 'var(--font-meetei)', fontSize: '1.6rem', color: '#fff', lineHeight: 1.2 }}>
                    {item.char}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                    {item.name}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {item.meaning}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Numerals */}
        {activeTab === 'numerals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Meetei Mayek Digits (꯰ ꯱ ꯲ ꯳ ꯴ ꯵ ꯶ ꯷ ꯸ ꯹):
            </span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
              gap: '0.6rem',
            }}>
              {NUMERALS.map((item) => (
                <button
                  key={item.char}
                  onClick={() => handleInsert(item.char)}
                  className="btn-secondary"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0.65rem 0.5rem',
                    textAlign: 'center',
                  }}
                  title={`Insert ${item.char} (${item.name})`}
                >
                  <span style={{ fontFamily: 'var(--font-meetei)', fontSize: '1.6rem', color: '#fff', lineHeight: 1.2 }}>
                    {item.char}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
