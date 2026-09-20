import React, { useState } from 'react';
import {
  ALL_27_MAIN_LETTERS,
  LONSUM_8,
  CHEITAP_8,
  SPECIAL_MARKS_3,
  NUMERALS_10,
  CHEISHING_THIBA,
  EXTENSIONS_BLOCK,
  translateToMeeteiMayekWithVocab,
} from '../services/meeteiMayekService';
import { Languages, Copy, Check, Plus, ExternalLink, X } from 'lucide-react';

interface MeeteiMayekToolProps {
  onInsertText: (text: string) => void;
  onClose: () => void;
  onTranslateFullDraft?: () => void;
}

export const MeeteiMayekTool: React.FC<MeeteiMayekToolProps> = ({
  onInsertText,
  onClose,
  onTranslateFullDraft,
}) => {
  const [inputText, setInputText] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'translate' | 'main27' | 'lonsum' | 'cheitap' | 'extensions' | 'numerals'>('translate');

  const handleTranslate = () => {
    const result = translateToMeeteiMayekWithVocab(inputText);
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
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(14px)',
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
        maxWidth: '860px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-elevated)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}>
        {/* Header with Official Unicode Specs */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Languages size={20} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                Meetei Mayek Unicode Suite
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
              Official Standards: Standard Block (
              <a
                href="https://unicode.org/charts/PDF/UABC0.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}
              >
                U+ABC0..U+ABFF
              </a>
              ) &amp; Extensions Block (
              <a
                href="https://unicode.org/charts/PDF/UAAE0.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}
              >
                U+AAE0..U+AAFF
              </a>
              ) &bull;{' '}
              <a
                href="https://en.wikipedia.org/wiki/Meitei_script"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
              >
                Wikipedia Spec <ExternalLink size={10} style={{ display: 'inline' }} />
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
            className={`category-chip ${activeTab === 'main27' ? 'active' : ''}`}
            onClick={() => setActiveTab('main27')}
          >
            27 Main Letters (ꯀ-ꯚ)
          </button>
          <button
            className={`category-chip ${activeTab === 'lonsum' ? 'active' : ''}`}
            onClick={() => setActiveTab('lonsum')}
          >
            8 Lonsum (ꯛ-ꯢ)
          </button>
          <button
            className={`category-chip ${activeTab === 'cheitap' ? 'active' : ''}`}
            onClick={() => setActiveTab('cheitap')}
          >
            8 Cheitap &amp; Marks
          </button>
          <button
            className={`category-chip ${activeTab === 'extensions' ? 'active' : ''}`}
            onClick={() => setActiveTab('extensions')}
          >
            Extensions (U+AAE0)
          </button>
          <button
            className={`category-chip ${activeTab === 'numerals' ? 'active' : ''}`}
            onClick={() => setActiveTab('numerals')}
          >
            10 Digits & Cheishing (ꯆꯩꯁꯤꯡ)
          </button>
        </div>

        {/* Tab 1: Translation / Transliteration */}
        {activeTab === 'translate' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="form-label">Type English / Latin Phonetics or Bengali Script</label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="Type Latin words (e.g., 'kangleipak', 'meetei mayek', 'manipur', 'puya') or paste Bengali script text..."
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setConvertedText(translateToMeeteiMayekWithVocab(e.target.value));
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
                  <span style={{ fontFamily: 'var(--font-meetei)' }}>ꯃ</span>
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
                    Meetei Mayek Unicode Result
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
                  lineHeight: 1.85,
                  color: 'var(--text-primary)',
                  wordBreak: 'break-word',
                }}>
                  {convertedText}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: 27 Main Letters (18 Core + 9 Additional) */}
        {activeTab === 'main27' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              The 27 Main Letters of Modern Meetei Mayek (U+ABC0 to U+ABDA) &bull; Click to insert at cursor:
            </span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))',
              gap: '0.6rem',
              maxHeight: '380px',
              overflowY: 'auto',
            }}>
              {ALL_27_MAIN_LETTERS.map((item) => (
                <button
                  key={item.codePoint}
                  onClick={() => handleInsert(item.char)}
                  className="btn-secondary"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0.6rem 0.4rem',
                    textAlign: 'center',
                    borderRadius: 'var(--radius-sm)',
                  }}
                  title={`Insert ${item.char} (${item.name} - ${item.codePoint})`}
                >
                  <span style={{ fontFamily: 'var(--font-meetei)', fontSize: '1.65rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {item.char}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    {item.name}
                  </span>
                  <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                    {item.meaning || item.codePoint}
                  </span>
                  <code style={{ fontSize: '0.62rem', color: 'var(--accent-cyan)', opacity: 0.8 }}>
                    {item.codePoint}
                  </code>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: 8 Lonsum Letters */}
        {activeTab === 'lonsum' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              The 8 Dependent Final Consonants (Lonsum) &bull; U+ABDB to U+ABE2:
            </span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))',
              gap: '0.6rem',
            }}>
              {LONSUM_8.map((item) => (
                <button
                  key={item.codePoint}
                  onClick={() => handleInsert(item.char)}
                  className="btn-secondary"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0.6rem 0.4rem',
                    textAlign: 'center',
                  }}
                  title={`Insert ${item.char} (${item.name} - ${item.codePoint})`}
                >
                  <span style={{ fontFamily: 'var(--font-meetei)', fontSize: '1.65rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {item.char}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    {item.name}
                  </span>
                  {item.ipa && (
                    <span style={{ fontSize: '0.68rem', color: 'var(--accent-amber)', fontFamily: 'monospace' }}>
                      {item.ipa}
                    </span>
                  )}
                  <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                    {item.meaning}
                  </span>
                  <code style={{ fontSize: '0.62rem', color: 'var(--accent-cyan)', opacity: 0.8 }}>
                    {item.codePoint}
                  </code>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: 8 Cheitap & 3 Special Marks */}
        {activeTab === 'cheitap' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                8 Dependent Vowel Diacritics (Cheitap) &bull; U+ABE3 to U+ABEA:
              </span>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '0.6rem',
                marginTop: '0.4rem',
              }}>
                {CHEITAP_8.map((item) => (
                  <button
                    key={item.codePoint}
                    onClick={() => handleInsert(item.char)}
                    className="btn-secondary"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '0.6rem 0.4rem',
                      textAlign: 'center',
                    }}
                    title={`Insert ${item.char} (${item.name} - ${item.codePoint})`}
                  >
                    <span style={{ fontFamily: 'var(--font-meetei)', fontSize: '1.65rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                      {item.char}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                      {item.name}
                    </span>
                    <code style={{ fontSize: '0.62rem', color: 'var(--accent-cyan)', opacity: 0.8 }}>
                      {item.codePoint}
                    </code>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                3 Special Marks &amp; Punctuation &bull; U+ABEB to U+ABED:
              </span>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '0.6rem',
                marginTop: '0.4rem',
              }}>
                {SPECIAL_MARKS_3.map((item) => (
                  <button
                    key={item.codePoint}
                    onClick={() => handleInsert(item.char)}
                    className="btn-secondary"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '0.6rem 0.4rem',
                      textAlign: 'center',
                    }}
                    title={`Insert ${item.char} (${item.name} - ${item.codePoint})`}
                  >
                    <span style={{ fontFamily: 'var(--font-meetei)', fontSize: '1.65rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                      {item.char}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                      {item.name}
                    </span>
                    <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                      {item.meaning}
                    </span>
                    <code style={{ fontSize: '0.62rem', color: 'var(--accent-cyan)', opacity: 0.8 }}>
                      {item.codePoint}
                    </code>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Extensions Block (U+AAE0 to U+AAFF) */}
        {activeTab === 'extensions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Meetei Mayek Extensions Block (U+AAE0 to U+AAFF) from Unicode Chart UAAE0.pdf:
              </span>
              <a
                href="https://unicode.org/charts/PDF/UAAE0.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}
              >
                <span>UAAE0.pdf</span>
                <ExternalLink size={11} />
              </a>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))',
              gap: '0.6rem',
              maxHeight: '380px',
              overflowY: 'auto',
            }}>
              {EXTENSIONS_BLOCK.map((item) => (
                <button
                  key={item.codePoint}
                  onClick={() => handleInsert(item.char)}
                  className="btn-secondary"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0.6rem 0.4rem',
                    textAlign: 'center',
                  }}
                  title={`Insert ${item.char} (${item.name} - ${item.codePoint})`}
                >
                  <span style={{ fontFamily: 'var(--font-meetei)', fontSize: '1.65rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {item.char}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    {item.name}
                  </span>
                  {item.ipa && (
                    <span style={{ fontSize: '0.68rem', color: 'var(--accent-amber)', fontFamily: 'monospace' }}>
                      {item.ipa}
                    </span>
                  )}
                  <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                    {item.meaning}
                  </span>
                  <code style={{ fontSize: '0.62rem', color: 'var(--accent-indigo)', opacity: 0.9 }}>
                    {item.codePoint}
                  </code>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: 10 Digits & Cheishing Thiba Number System */}
        {activeTab === 'numerals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Cheising Eeyek (10 Digits &bull; U+ABF0 to U+ABF9)
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Click to insert digit
                </span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))',
                gap: '0.6rem',
              }}>
                {NUMERALS_10.map((item) => (
                  <button
                    key={item.codePoint}
                    onClick={() => handleInsert(item.char)}
                    className="btn-secondary"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '0.6rem 0.4rem',
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.02)',
                    }}
                    title={`Insert ${item.char} (${item.name} - ${item.codePoint})`}
                  >
                    <span style={{ fontFamily: 'var(--font-meetei)', fontSize: '1.85rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                      {item.char}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                      {item.name}
                    </span>
                    {item.ipa && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--accent-amber)', fontFamily: 'monospace' }}>
                        {item.ipa}
                      </span>
                    )}
                    <code style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)', opacity: 0.8 }}>
                      {item.codePoint}
                    </code>
                  </button>
                ))}
              </div>
            </div>

            {/* Traditional Cheishing Thiba Counting Table */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-meetei)', fontSize: '1.1rem', color: 'var(--accent-cyan)' }}>ꯆꯩꯁꯤꯡ ꯊꯤꯕ</span>
                    <span>(Cheishing - thiba &bull; Traditional Number System)</span>
                  </h4>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Ancient Manipuri numerical scale from units (Ama) up to ten trillions (Puu Ama)
                  </p>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Meetei Word</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Numerals</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Roman Name</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Standard Value</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Scale / Meaning</th>
                      <th style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 600 }}>Insert</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CHEISHING_THIBA.map((row, idx) => (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        <td style={{ padding: '0.5rem', fontFamily: 'var(--font-meetei)', fontSize: '1rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                          {row.meeteiWord}
                        </td>
                        <td style={{ padding: '0.5rem', fontFamily: 'var(--font-meetei)', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          {row.digits}
                        </td>
                        <td style={{ padding: '0.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                          {row.romanName}
                        </td>
                        <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                          {row.value}
                        </td>
                        <td style={{ padding: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          {row.meaning}
                        </td>
                        <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                            <button
                              onClick={() => handleInsert(row.meeteiWord)}
                              className="btn-secondary"
                              style={{ padding: '0.2rem 0.45rem', fontSize: '0.68rem' }}
                              title={`Insert "${row.meeteiWord}"`}
                            >
                              Word
                            </button>
                            <button
                              onClick={() => handleInsert(row.digits)}
                              className="btn-secondary"
                              style={{ padding: '0.2rem 0.45rem', fontSize: '0.68rem' }}
                              title={`Insert "${row.digits}"`}
                            >
                              Digits
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
