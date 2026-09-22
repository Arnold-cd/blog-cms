import React, { useState } from 'react';
import {
  ALL_27_MAIN_LETTERS,
  LONSUM_8,
  ALL_LETTERS_MAIN_AND_LONSUM,
  CHEITAP_8,
  INDEPENDENT_VOWELS_7,
  SPECIAL_MARKS_3,
  NUMERALS_10,
  CHEISHING_THIBA,
  EXTENSIONS_BLOCK,
  translateToMeeteiMayekWithVocab,
  convertUnicodeToPukokFont,
} from '../services/meeteiMayekService';
import { Languages, Copy, Check, Plus, ExternalLink, X, Download, Sparkles, Search } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'translate' | 'vowels' | 'puya18' | 'main27' | 'lonsum' | 'cheitap' | 'extensions' | 'numerals'>('numerals');
  const [sampleConsonant, setSampleConsonant] = useState<string>('ꯀ');
  const [showFullMatrix, setShowFullMatrix] = useState<boolean>(false);
  const [matrixFilter, setMatrixFilter] = useState<'all' | 'main' | 'lonsum'>('all');
  const [cheishingFilter, setCheishingFilter] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1800);
  };

  const handleTranslate = () => {
    const result = translateToMeeteiMayekWithVocab(inputText);
    setConvertedText(result);
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast(`Copied: ${text.length > 20 ? text.slice(0, 20) + '...' : text}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = (text: string) => {
    if (!text) return;
    onInsertText(text);
    showToast(`Inserted: ${text}`);
  };

  return (
    <div
      className="meetei-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="meetei-modal-dialog">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'absolute',
            top: '1.2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            background: 'var(--accent-cyan)',
            color: '#000',
            fontWeight: 700,
            fontSize: '0.78rem',
            padding: '0.4rem 1.1rem',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            animation: 'fadeIn 0.15s ease',
          }}>
            <Check size={14} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="meetei-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)',
              flexShrink: 0,
            }}>
              <Languages size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                Meetei Mayek Linguistic Studio &amp; Reference
              </h3>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Complete Unicode Standard (
                <a
                  href="https://unicode.org/charts/PDF/UABC0.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 500 }}
                >
                  U+ABC0..U+ABFF
                </a>
                ,{' '}
                <a
                  href="https://unicode.org/charts/PDF/UAAE0.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 500 }}
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
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <a
              href="fonts/Meetei-Mayek-Fonts.zip"
              download="Meetei-Mayek-Fonts.zip"
              className="btn-secondary"
              style={{
                textDecoration: 'none',
                fontSize: '0.76rem',
                padding: '0.35rem 0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                borderRadius: 'var(--radius-full)',
              }}
              title="Download Meetei Mayek TrueType Fonts (.ttf) Package"
              id="btn-download-ttf-suite"
            >
              <Download size={13} />
              <span>TTF (.zip)</span>
            </a>

            <a
              href="fonts/PukokEeyek.otf"
              download="PukokEeyek.otf"
              className="btn-secondary"
              style={{
                textDecoration: 'none',
                fontSize: '0.76rem',
                padding: '0.35rem 0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                borderRadius: 'var(--radius-full)',
                borderColor: 'rgba(99, 102, 241, 0.3)',
                color: 'var(--accent-indigo)',
              }}
              title="Download Authentic Wakoklon Puya Pukok Eeyek Font (.otf)"
              id="btn-download-pukok-suite"
            >
              <Download size={13} />
              <span>Pukok OTF</span>
            </a>

            <button
              onClick={onClose}
              className="btn-ghost"
              style={{ padding: '0.4rem', borderRadius: 'var(--radius-full)' }}
              title="Close Reference Studio"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Sleek Tab Navigation Strip */}
        <div className="meetei-modal-tabs">
          <button
            className={`meetei-tab-pill ${activeTab === 'numerals' ? 'active' : ''}`}
            onClick={() => setActiveTab('numerals')}
          >
            <span>꯰-꯹ 10 Digits &amp; Cheishing</span>
          </button>
          <button
            className={`meetei-tab-pill ${activeTab === 'vowels' ? 'active' : ''}`}
            onClick={() => setActiveTab('vowels')}
            id="tab-vowels-suite"
          >
            <span>🔤 Vowels &amp; Matrix</span>
          </button>
          <button
            className={`meetei-tab-pill ${activeTab === 'translate' ? 'active' : ''}`}
            onClick={() => setActiveTab('translate')}
          >
            <span>✍️ Transliterate</span>
          </button>
          <button
            className={`meetei-tab-pill ${activeTab === 'puya18' ? 'active' : ''}`}
            onClick={() => setActiveTab('puya18')}
          >
            <Sparkles size={12} style={{ color: 'var(--accent-indigo)' }} />
            <span>Wakoklon Puya (18 vs 27)</span>
          </button>
          <button
            className={`meetei-tab-pill ${activeTab === 'main27' ? 'active' : ''}`}
            onClick={() => setActiveTab('main27')}
          >
            <span>ꯀ 27 Main Letters</span>
          </button>
          <button
            className={`meetei-tab-pill ${activeTab === 'lonsum' ? 'active' : ''}`}
            onClick={() => setActiveTab('lonsum')}
          >
            <span>ꯛ 8 Lonsum</span>
          </button>
          <button
            className={`meetei-tab-pill ${activeTab === 'cheitap' ? 'active' : ''}`}
            onClick={() => setActiveTab('cheitap')}
          >
            <span>ꯣ 8 Cheitap &amp; Marks</span>
          </button>
          <button
            className={`meetei-tab-pill ${activeTab === 'extensions' ? 'active' : ''}`}
            onClick={() => setActiveTab('extensions')}
          >
            <span>ꫠ Extensions (U+AAE0)</span>
          </button>
        </div>

        {/* Scrollable Modal Body Container */}
        <div className="meetei-modal-body">
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
                    fontSize: '1.4rem',
                    fontFamily: 'var(--font-meetei)',
                    lineHeight: 1.8,
                    color: '#fff',
                    userSelect: 'all',
                  }}>
                    {convertedText}
                  </div>

                  {/* Authentic Wakoklon Pukok Eeyek Puya Font Rendering */}
                  <div style={{
                    marginTop: '1rem',
                    paddingTop: '0.85rem',
                    borderTop: '1px dashed var(--border-subtle)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span className="form-label" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: 0 }}>
                        <Sparkles size={13} style={{ color: 'var(--accent-indigo)' }} />
                        <span>Authentic Wakoklon Pukok Eeyek (Puya Manuscript Calligraphy)</span>
                      </span>
                      <button
                        onClick={() => handleCopy(convertUnicodeToPukokFont(convertedText))}
                        className="btn-ghost"
                        style={{ padding: '0.15rem 0.45rem', fontSize: '0.72rem' }}
                        title="Copy Pukok Eeyek mapped character string"
                      >
                        <Copy size={11} />
                        <span>Copy Pukok Font Keys</span>
                      </button>
                    </div>
                    <div style={{
                      fontSize: '1.65rem',
                      fontFamily: 'var(--font-pukok)',
                      lineHeight: 1.8,
                      color: 'var(--text-primary)',
                      letterSpacing: '0.04em',
                      userSelect: 'all',
                    }}>
                      {convertUnicodeToPukokFont(convertedText)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Seven Independent Vowels & Vowel Diacritics (Cheitap Eeyek) */}
          {activeTab === 'vowels' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Section 1: Seven Independent Vowels */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Seven Independent Vowels (ꯃꯌꯦꯛ ꯑꯃꯥꯡꯁꯤꯡ)
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', background: 'rgba(56, 189, 248, 0.1)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                  〈ꯑ〉 is the default vowel carrier
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.9rem', lineHeight: 1.5 }}>
                Used only when a word starts with a vowel or in vowel hiatus (e.g. <code>ꯑꯣꯏꯅ</code> oina, <code>ꯑꯣꯖꯥ</code> oja). Otherwise, vowels attach as diacritics to consonants.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                gap: '0.65rem',
              }}>
                {INDEPENDENT_VOWELS_7.map((v) => (
                  <div
                    key={v.char}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem 0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      position: 'relative',
                    }}
                  >
                    <div style={{
                      fontFamily: 'var(--font-meetei)',
                      fontSize: '2.1rem',
                      color: 'var(--accent-rose)',
                      lineHeight: 1.2,
                      marginBottom: '0.2rem',
                    }}>
                      {v.char}
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      IPA: {v.ipa}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                      {v.name}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '0.25rem', background: 'var(--bg-subtle)', padding: '0.1rem 0.35rem', borderRadius: 'var(--radius-xs)' }}>
                      {v.example}
                    </span>
                    <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => handleCopy(v.char)}
                        className="btn-ghost"
                        style={{ padding: '0.2rem 0.35rem', fontSize: '0.7rem' }}
                        title="Copy vowel"
                      >
                        <Copy size={11} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsert(v.char)}
                        className="btn-primary"
                        style={{ padding: '0.2rem 0.45rem', fontSize: '0.7rem' }}
                        title="Insert at cursor"
                      >
                        <Plus size={11} />
                        <span>Insert</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Examples Bar */}
              <div style={{
                marginTop: '0.8rem',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.6rem 0.85rem',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Examples:</span>
                <span>
                  <strong style={{ fontFamily: 'var(--font-meetei)', fontSize: '1.05rem', color: 'var(--accent-cyan)' }}>ꯑꯣꯏꯅ</strong> (oina) &ndash; 'like / left'
                </span>
                <span>
                  <strong style={{ fontFamily: 'var(--font-meetei)', fontSize: '1.05rem', color: 'var(--accent-cyan)' }}>ꯑꯣꯖꯥ</strong> (oja) &ndash; 'teacher'
                </span>
                <span>
                  <strong style={{ fontFamily: 'var(--font-meetei)', fontSize: '1.05rem', color: 'var(--accent-cyan)' }}>ꯑꯩꯈꯣꯏ</strong> (eikhoi) &ndash; 'we / us'
                </span>
              </div>
            </div>

            {/* Section 2: Vowel Diacritics (Cheitap Eeyek) applied to ALL 27 Main & 8 Lonsum */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Vowel Diacritics (Cheitap Eeyek &bull; ꯆꯩꯇꯥꯞ)
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Every Cheitap diacritic applies to <strong>all 27 Main Letters</strong> and <strong>all 8 Lonsum Letters</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setShowFullMatrix(!showFullMatrix)}
                    className={`btn-secondary ${showFullMatrix ? 'active' : ''}`}
                    style={{ fontSize: '0.76rem', padding: '0.25rem 0.65rem' }}
                    id="btn-toggle-full-matrix"
                  >
                    <span>{showFullMatrix ? "Hide 35-Letter Matrix" : "View Full 35-Letter Matrix"}</span>
                  </button>

                  <select
                    value={sampleConsonant}
                    onChange={(e) => setSampleConsonant(e.target.value)}
                    className="form-select"
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.82rem', width: 'auto', fontFamily: 'var(--font-meetei)' }}
                    id="select-cheitap-base"
                  >
                    <optgroup label="27 Main Letters (ꯀ-ꯚ)">
                      {ALL_27_MAIN_LETTERS.map((l) => (
                        <option key={l.char} value={l.char}>{l.char} ({l.name})</option>
                      ))}
                    </optgroup>
                    <optgroup label="8 Lonsum Letters (ꯛ-ꯢ)">
                      {LONSUM_8.map((l) => (
                        <option key={l.char} value={l.char}>{l.char} ({l.name})</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Quick Select Buttons: Main Letters & Lonsum Letters */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', minWidth: '75px' }}>27 Main:</span>
                  {ALL_27_MAIN_LETTERS.map((l) => (
                    <button
                      key={l.char}
                      type="button"
                      onClick={() => setSampleConsonant(l.char)}
                      className="btn-ghost"
                      style={{
                        padding: '0.15rem 0.35rem',
                        fontSize: '0.9rem',
                        fontFamily: 'var(--font-meetei)',
                        color: sampleConsonant === l.char ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                        background: sampleConsonant === l.char ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                        border: sampleConsonant === l.char ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                        borderRadius: 'var(--radius-xs)',
                        lineHeight: 1,
                      }}
                      title={`${l.char} (${l.name})`}
                    >
                      {l.char}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', minWidth: '75px', fontWeight: 600 }}>8 Lonsum:</span>
                  {LONSUM_8.map((l) => (
                    <button
                      key={l.char}
                      type="button"
                      onClick={() => setSampleConsonant(l.char)}
                      className="btn-ghost"
                      style={{
                        padding: '0.15rem 0.35rem',
                        fontSize: '0.9rem',
                        fontFamily: 'var(--font-meetei)',
                        color: sampleConsonant === l.char ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                        background: sampleConsonant === l.char ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: sampleConsonant === l.char ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xs)',
                        lineHeight: 1,
                      }}
                      title={`Lonsum ${l.char} (${l.name})`}
                    >
                      {l.char}
                    </button>
                  ))}
                </div>
              </div>

              {/* Single Consonant Interactive Table (Active Selection) */}
              <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  textAlign: 'center',
                }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-active)' }}>
                      <th style={{ padding: '0.6rem 0.5rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Row</th>
                      {CHEITAP_8.map((c) => (
                        <th key={c.name} style={{ padding: '0.6rem 0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          <div>{c.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>{c.ipa}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Diacritic only */}
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.65rem 0.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500 }}>diacritic</td>
                      {CHEITAP_8.map((c) => (
                        <td key={c.name} style={{ padding: '0.65rem 0.5rem' }}>
                          <span style={{
                            fontFamily: 'var(--font-meetei)',
                            fontSize: '1.6rem',
                            color: 'var(--accent-rose)',
                            lineHeight: 1,
                          }}>
                            {c.char}
                          </span>
                        </td>
                      ))}
                    </tr>
                    {/* Consonant/Lonsum plus diacritic */}
                    <tr>
                      <td style={{ padding: '0.65rem 0.5rem', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 600 }}>
                        <span style={{ fontFamily: 'var(--font-meetei)', fontSize: '1.2rem', color: 'var(--accent-cyan)' }}>{sampleConsonant}</span> + diacritic
                      </td>
                      {CHEITAP_8.map((c) => {
                        const combo = `${sampleConsonant}${c.char}`;
                        return (
                          <td key={c.name} style={{ padding: '0.65rem 0.5rem' }}>
                            <button
                              type="button"
                              onClick={() => handleInsert(combo)}
                              className="btn-ghost"
                              style={{
                                fontFamily: 'var(--font-meetei)',
                                fontSize: '1.65rem',
                                color: 'var(--accent-cyan)',
                                padding: '0.2rem 0.4rem',
                                borderRadius: 'var(--radius-xs)',
                                width: '100%',
                              }}
                              title={`Click to insert ${combo}`}
                            >
                              {combo}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Full 35-Letter Matrix (Collapsible Table) */}
              {showFullMatrix && (
                <div style={{ marginTop: '1rem', border: '1px solid var(--border-active)', borderRadius: 'var(--radius-sm)', padding: '1rem', background: 'var(--bg-elevated)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h5 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Full Cheitap Matrix &mdash; All 35 Letters (27 Main + 8 Lonsum) &times; 8 Diacritics
                    </h5>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        type="button"
                        className={`category-chip ${matrixFilter === 'all' ? 'active' : ''}`}
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                        onClick={() => setMatrixFilter('all')}
                      >
                        All (35)
                      </button>
                      <button
                        type="button"
                        className={`category-chip ${matrixFilter === 'main' ? 'active' : ''}`}
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                        onClick={() => setMatrixFilter('main')}
                      >
                        27 Main Only
                      </button>
                      <button
                        type="button"
                        className={`category-chip ${matrixFilter === 'lonsum' ? 'active' : ''}`}
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                        onClick={() => setMatrixFilter('lonsum')}
                      >
                        8 Lonsum Only
                      </button>
                    </div>
                  </div>

                  <div style={{ overflowX: 'auto', maxHeight: '350px', overflowY: 'auto' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      background: 'var(--bg-card)',
                      fontSize: '0.82rem',
                      textAlign: 'center',
                    }}>
                      <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-elevated)', zIndex: 2 }}>
                        <tr style={{ borderBottom: '2px solid var(--border-active)' }}>
                          <th style={{ padding: '0.4rem 0.5rem', textAlign: 'left' }}>Base Letter</th>
                          {CHEITAP_8.map((c) => (
                            <th key={c.name} style={{ padding: '0.4rem 0.4rem', color: 'var(--text-primary)' }}>
                              {c.name} ({c.char})
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(matrixFilter === 'all' ? ALL_LETTERS_MAIN_AND_LONSUM : matrixFilter === 'main' ? ALL_27_MAIN_LETTERS : LONSUM_8).map((letter) => (
                          <tr key={letter.char} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '0.35rem 0.5rem', textAlign: 'left', color: letter.category === 'lonsum' ? 'var(--accent-cyan)' : 'var(--text-primary)', fontWeight: 600 }}>
                              <span style={{ fontFamily: 'var(--font-meetei)', fontSize: '1.15rem', marginRight: '0.3rem' }}>{letter.char}</span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{letter.name}</span>
                            </td>
                            {CHEITAP_8.map((c) => {
                              const combo = `${letter.char}${c.char}`;
                              return (
                                <td key={c.name} style={{ padding: '0.2rem 0.3rem' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleInsert(combo)}
                                    className="btn-ghost"
                                    style={{
                                      fontFamily: 'var(--font-meetei)',
                                      fontSize: '1.3rem',
                                      color: letter.category === 'lonsum' ? 'var(--accent-cyan)' : 'var(--accent-cyan)',
                                      padding: '0.15rem 0.3rem',
                                      borderRadius: 'var(--radius-xs)',
                                      width: '100%',
                                    }}
                                    title={`Click to insert ${combo}`}
                                  >
                                    {combo}
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Wakoklon Puya 18 vs 27 & Authentic Pukok Keyboard Layout */}
        {activeTab === 'puya18' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header & Source Charter Info */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(56, 189, 248, 0.04))',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '1.2rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} style={{ color: 'var(--accent-indigo)' }} />
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Wakoklon Heelel Thilel Salai Ama-Ilon Pukok Puya (18 vs 27 Scripts)
                  </h4>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a
                    href="fonts/PukokEeyek.otf"
                    download="PukokEeyek.otf"
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', color: 'var(--text-secondary)' }}
                  >
                    <Download size={12} style={{ marginRight: '0.25rem' }} />
                    Download Pukok Font (.otf)
                  </a>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Based on canonical manuscripts and research from <strong>Wangkhemcha Chingtamlen</strong> (<em>Discovery of Kangleipak</em>) and the official QWERTY type-foundry specification developed by <strong>Wakambam Macha Waanglel</strong> for publishing the sacred <em>Wakoklon Pukok Puya</em>.
              </p>
            </div>

            {/* Core Insights from e1827.pdf */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '0.85rem',
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--accent-indigo)', fontWeight: 700, fontSize: '0.9rem' }}>꯱ &bull; The Sacred Eelik (Blood Drop)</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  In the original Puya (Singthalon Cheising Eeyek Ama), the numeral <strong>1</strong> is written as <strong>$*</strong> with an <strong>Eelik</strong> (dot <code style={{ color: 'var(--accent-indigo)' }}>.</code>), representing the sacred blood drop of the Universal Father God Creator, <em>Eapung Loinapa Apakpa</em>.
                </p>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.9rem' }}>18 Indigenous Anatomical Roots</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  The 18 Ipi Eeyek roots originate directly from human anatomy and the cosmos (Kok = head, Sam = hair, Lai = forehead, Meet = eye, Paa = ear, Naa = nose, Chil = mouth, Til = neck, Khou = throat, etc.).
                </p>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.9rem' }}>Native Lom (Derivation) vs Borrowing</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  In authentic Kanglei grammar, the 9 additional consonant sounds (Gok, Zam, Rai, Ba, Jil, Dil, Ghou, Dhou, Bham) derive naturally from the 18 root letters by adding the <strong>Lom</strong> inflection dot (<code style={{ color: 'var(--accent-emerald)' }}>.</code>), without importing foreign scripts.
                </p>
              </div>
            </div>

            {/* Official QWERTY Pukok-Eeyek Layout Guide */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Pukok-Eeyek QWERTY Keyboard Mapping (Wakambam Macha Waanglel)
                  </h5>
                  <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Type standard keys on any physical QWERTY keyboard with the PukokEeyek font to render sacred calligraphy
                  </p>
                </div>
                <button
                  onClick={() => handleCopy('k s l m p n c t x q z w y h u e f a')}
                  className="btn-ghost"
                  style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                >
                  <Copy size={11} style={{ marginRight: '0.25rem' }} />
                  Copy 18 Root Keys
                </button>
              </div>

              {/* 18 Roots Table */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  18 Ipi Eeyek Roots:
                </span>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(95px, 1fr))',
                  gap: '0.45rem',
                }}>
                  {[
                    { key: 'k', uni: 'ꯀ', name: 'Kok' },
                    { key: 's', uni: 'ꯁ', name: 'Sam' },
                    { key: 'l', uni: 'ꯂ', name: 'Lai' },
                    { key: 'm', uni: 'ꯃ', name: 'Meet' },
                    { key: 'p', uni: 'ꯄ', name: 'Paa' },
                    { key: 'n', uni: 'ꯅ', name: 'Naa' },
                    { key: 'c', uni: 'ꯆ', name: 'Chil' },
                    { key: 't', uni: 'ꯇ', name: 'Til' },
                    { key: 'x', uni: 'ꯈ', name: 'Khou' },
                    { key: 'q', uni: 'ꯉ', name: 'Ngou' },
                    { key: 'z', uni: 'ꯊ', name: 'Thou' },
                    { key: 'w', uni: 'ꯋ', name: 'Wai' },
                    { key: 'y', uni: 'ꯌ', name: 'Yang' },
                    { key: 'h', uni: 'ꯍ', name: 'Huk' },
                    { key: 'u', uni: 'ꯎ', name: 'Oon' },
                    { key: 'e', uni: 'ꯏ', name: 'Ee' },
                    { key: 'f', uni: 'ꯐ', name: 'Pham' },
                    { key: 'a', uni: 'ꯑ', name: 'Atingaa' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleInsert(item.uni)}
                      className="btn-secondary"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '0.45rem 0.3rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                      }}
                      title={`Press '${item.key}' in Pukok font or insert ${item.uni}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                        <span style={{ fontFamily: 'var(--font-pukok)', fontSize: '1.45rem', color: 'var(--text-primary)', lineHeight: 1 }}>
                          {item.key}
                        </span>
                        <span style={{ fontFamily: 'var(--font-meetei)', fontSize: '1rem', color: 'var(--text-muted)' }}>
                          {item.uni}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                        {item.name}
                      </span>
                      <code style={{ fontSize: '0.62rem', color: 'var(--accent-cyan)', background: 'rgba(56, 189, 248, 0.08)', padding: '0.05rem 0.25rem', borderRadius: '3px' }}>
                        key: {item.key}
                      </code>
                    </button>
                  ))}
                </div>
              </div>

              {/* 9 Lom Consonants Table */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-emerald)', display: 'block', marginBottom: '0.4rem' }}>
                  9 Lom Consonants (Chei-eeyek / Lom 9):
                </span>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(95px, 1fr))',
                  gap: '0.45rem',
                }}>
                  {[
                    { key: 'g', uni: 'ꯒ', name: 'Gok' },
                    { key: 'S', uni: 'ꯓ', name: 'Zam' },
                    { key: 'R', uni: 'ꯔ', name: 'Rai' },
                    { key: 'b', uni: 'ꯕ', name: 'Bok' },
                    { key: 'j', uni: 'ꯖ', name: 'Jhil' },
                    { key: 'd', uni: 'ꯗ', name: 'Dil' },
                    { key: 'G', uni: 'ꯘ', name: 'Ghou' },
                    { key: 'D', uni: 'ꯙ', name: 'Dhou' },
                    { key: 'v', uni: 'ꯚ', name: 'Bham' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleInsert(item.uni)}
                      className="btn-secondary"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '0.45rem 0.3rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                      }}
                      title={`Press '${item.key}' in Pukok font or insert ${item.uni}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                        <span style={{ fontFamily: 'var(--font-pukok)', fontSize: '1.45rem', color: 'var(--accent-emerald)', lineHeight: 1 }}>
                          {item.key}
                        </span>
                        <span style={{ fontFamily: 'var(--font-meetei)', fontSize: '1rem', color: 'var(--text-muted)' }}>
                          {item.uni}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                        {item.name}
                      </span>
                      <code style={{ fontSize: '0.62rem', color: 'var(--accent-cyan)', background: 'rgba(56, 189, 248, 0.08)', padding: '0.05rem 0.25rem', borderRadius: '3px' }}>
                        key: {item.key}
                      </code>
                    </button>
                  ))}
                </div>
              </div>

              {/* 10 Lolsum Consonants */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-cyan)', display: 'block', marginBottom: '0.4rem' }}>
                  10 Lolsum Consonants (Eeyek Lonsum 10):
                </span>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(95px, 1fr))',
                  gap: '0.45rem',
                }}>
                  {[
                    { key: 'K', uni: 'ꯛ', name: 'Kok Lonsum' },
                    { key: 'L', uni: 'ꯜ', name: 'Lai Lonsum' },
                    { key: 'M', uni: 'ꯝ', name: 'Meet Lonsum' },
                    { key: 'P', uni: 'ꯞ', name: 'Paa Lonsum' },
                    { key: 'N', uni: 'ꯟ', name: 'Naa Lonsum' },
                    { key: 'T', uni: 'ꯠ', name: 'Til Lonsum' },
                    { key: 'Q', uni: 'ꯡ', name: 'Ngou Lonsum' },
                    { key: 'U', uni: 'ꯎ', name: 'Oon Lonsum' },
                    { key: 'E', uni: 'ꯢ', name: 'Ee Lonsum' },
                    { key: 'A', uni: 'ꯑ', name: 'Yei Lonsum' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleInsert(item.uni)}
                      className="btn-secondary"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '0.45rem 0.3rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                      }}
                      title={`Press '${item.key}' in Pukok font or insert ${item.uni}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                        <span style={{ fontFamily: 'var(--font-pukok)', fontSize: '1.45rem', color: 'var(--accent-cyan)', lineHeight: 1 }}>
                          {item.key}
                        </span>
                        <span style={{ fontFamily: 'var(--font-meetei)', fontSize: '1rem', color: 'var(--text-muted)' }}>
                          {item.uni}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                        {item.name}
                      </span>
                      <code style={{ fontSize: '0.62rem', color: 'var(--accent-indigo)', background: 'rgba(99, 102, 241, 0.08)', padding: '0.05rem 0.25rem', borderRadius: '3px' }}>
                        key: {item.key}
                      </code>
                    </button>
                  ))}
                </div>
              </div>

              {/* 9 Cheitap Vowel Diacritics & Punctuation */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-rose)', display: 'block', marginBottom: '0.4rem' }}>
                  9 Cheitap Diacritics &amp; Puya Punctuation:
                </span>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                  gap: '0.45rem',
                }}>
                  {[
                    { key: 'F', uni: 'ꯥ', name: 'Takchei / Atep (aa)' },
                    { key: 'i', uni: 'ꯤ', name: 'Inap (i)' },
                    { key: 'I', uni: 'ꯤ', name: 'Ee Cheitap (ee)' },
                    { key: 'J', uni: 'ꯨ', name: 'Oon Cheitap (u)' },
                    { key: 'Y', uni: 'ꯦ', name: 'Yenap (e)' },
                    { key: 'o', uni: 'ꯣ', name: 'Otap (o)' },
                    { key: 'O', uni: 'ꯧ', name: 'Sou (ou)' },
                    { key: 'C', uni: 'ꯩ', name: 'Cheinap (ei)' },
                    { key: 'H', uni: 'ꯪ', name: 'Nung (anusvara)' },
                    { key: '#', uni: '꯱', name: 'Sacred 1 (with Eelik)' },
                    { key: '.', uni: '꫰', name: 'Cheikhan (Danda)' },
                    { key: ';', uni: '꫱', name: 'Cheishei (Double)' },
                    { key: ':', uni: '=', name: 'Mannaba (Equals)' },
                    { key: '!', uni: '꯫', name: 'Apakpa (Khutam)' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleInsert(item.uni)}
                      className="btn-secondary"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '0.45rem 0.3rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                      }}
                      title={`Press '${item.key}' in Pukok font or insert ${item.uni}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                        <span style={{ fontFamily: 'var(--font-pukok)', fontSize: '1.45rem', color: 'var(--accent-rose)', lineHeight: 1 }}>
                          {item.key}
                        </span>
                        <span style={{ fontFamily: 'var(--font-meetei)', fontSize: '1rem', color: 'var(--text-muted)' }}>
                          {item.uni}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.66rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                        {item.name}
                      </span>
                      <code style={{ fontSize: '0.62rem', color: 'var(--accent-rose)', background: 'rgba(244, 63, 94, 0.08)', padding: '0.05rem 0.25rem', borderRadius: '3px' }}>
                        key: {item.key}
                      </code>
                    </button>
                  ))}
                </div>
              </div>
            </div>
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
                    <span style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>
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
                    <span style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 10 Digits Grid */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Cheising Eeyek (ꯆꯩꯁꯤꯡ ꯏꯌꯦꯛ)</span>
                    <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--accent-cyan)', background: 'rgba(56, 189, 248, 0.12)', padding: '0.12rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                      10 Digits &bull; U+ABF0 to U+ABF9
                    </span>
                  </h4>
                  <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Meetei base-10 numerical digits with authentic Wakoklon calligraphy and IPA phonetics
                  </p>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Click any digit to insert
                </span>
              </div>

              {/* Clean 10-column layout: perfectly balances 0 to 9 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(84px, 1fr))',
                gap: '0.55rem',
              }}>
                {NUMERALS_10.map((item) => (
                  <div
                    key={item.codePoint}
                    onClick={() => handleInsert(item.char)}
                    className="meetei-char-card"
                    title={`Click to insert ${item.char} (${item.name} - ${item.codePoint})`}
                  >
                    <span style={{ fontFamily: 'var(--font-meetei)', fontSize: '1.85rem', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                      {item.char}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-pukok)',
                        fontSize: '1.25rem',
                        color: 'var(--text-primary)',
                        lineHeight: 1,
                        margin: '0.2rem 0',
                      }}
                      title={`Wakoklon Puya calligraphy glyph (Key: ${convertUnicodeToPukokFont(item.char)})`}
                    >
                      {convertUnicodeToPukokFont(item.char)}
                    </span>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.name}
                    </span>
                    {item.ipa && (
                      <span style={{ fontSize: '0.64rem', color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>
                        {item.ipa}
                      </span>
                    )}
                    <code style={{ fontSize: '0.58rem', color: 'var(--accent-cyan)', opacity: 0.85, marginTop: '0.15rem' }}>
                      {item.codePoint}
                    </code>
                  </div>
                ))}
              </div>
            </div>

            {/* Traditional Cheishing Thiba Counting Table */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <span style={{ fontFamily: 'var(--font-meetei)', fontSize: '1.25rem', color: 'var(--accent-cyan)' }}>ꯆꯩꯁꯤꯡ ꯊꯤꯕ</span>
                    <span>(Cheishing - thiba &bull; Traditional Number System)</span>
                  </h4>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    Ancient Manipuri numerical scale from units (Ama) up to ten trillions (Puu Ama), preserved in sacred Puyas
                  </p>
                </div>

                {/* Search / Filter Bar for Cheishing Table */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.3rem 0.85rem',
                }}>
                  <Search size={14} style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Filter scale (e.g. Lipun, Crore, 1000, Tala)..."
                    value={cheishingFilter}
                    onChange={(e) => setCheishingFilter(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      fontSize: '0.78rem',
                      outline: 'none',
                      width: '190px',
                    }}
                  />
                  {cheishingFilter && (
                    <button
                      onClick={() => setCheishingFilter('')}
                      className="btn-ghost"
                      style={{ padding: 0, color: 'var(--text-muted)' }}
                      title="Clear search"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Table with Sticky Header and Smooth Scroll */}
              <div className="cheishing-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: '65px' }}>Level</th>
                      <th>Meetei Word (ꯄꯨꯌꯥ ꯏꯔꯝ)</th>
                      <th>Numerals (ꯆꯩꯁꯤꯡ)</th>
                      <th>Roman Name</th>
                      <th>Standard Value</th>
                      <th>Scale / Meaning</th>
                      <th style={{ textAlign: 'right', minWidth: '140px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CHEISHING_THIBA.filter((row) => {
                      if (!cheishingFilter.trim()) return true;
                      const q = cheishingFilter.toLowerCase();
                      return (
                        row.romanName.toLowerCase().includes(q) ||
                        row.meaning.toLowerCase().includes(q) ||
                        row.value.includes(q) ||
                        row.meeteiWord.includes(q) ||
                        row.digits.includes(q)
                      );
                    }).map((row, idx) => {
                      const isHighTier = idx >= 7; // Lipun (Crore) and above
                      return (
                        <tr
                          key={idx}
                          style={{
                            background: isHighTier ? 'rgba(99, 102, 241, 0.05)' : undefined,
                          }}
                        >
                          <td>
                            <span style={{
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              color: isHighTier ? 'var(--accent-indigo)' : 'var(--text-muted)',
                              background: isHighTier ? 'rgba(99, 102, 241, 0.14)' : 'rgba(255, 255, 255, 0.04)',
                              padding: '0.15rem 0.5rem',
                              borderRadius: 'var(--radius-full)',
                              display: 'inline-block',
                            }}>
                              #{idx + 1}
                            </span>
                          </td>
                          <td style={{ fontFamily: 'var(--font-meetei)', fontSize: '1.05rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                            {row.meeteiWord}
                          </td>
                          <td style={{ fontFamily: 'var(--font-meetei)', fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                            {row.digits}
                          </td>
                          <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {row.romanName}
                          </td>
                          <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                            {row.value}
                          </td>
                          <td>
                            <span style={{
                              fontSize: '0.75rem',
                              color: isHighTier ? 'var(--accent-indigo)' : 'var(--text-secondary)',
                            }}>
                              {row.meaning}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                              <button
                                onClick={() => handleInsert(row.meeteiWord)}
                                className="btn-secondary"
                                style={{ padding: '0.22rem 0.55rem', fontSize: '0.72rem', borderRadius: 'var(--radius-xs)' }}
                                title={`Insert "${row.meeteiWord}"`}
                              >
                                Word
                              </button>
                              <button
                                onClick={() => handleInsert(row.digits)}
                                className="btn-secondary"
                                style={{ padding: '0.22rem 0.55rem', fontSize: '0.72rem', borderRadius: 'var(--radius-xs)' }}
                                title={`Insert "${row.digits}"`}
                              >
                                Digits
                              </button>
                              <button
                                onClick={() => handleCopy(`${row.meeteiWord} (${row.digits}) = ${row.value}`)}
                                className="btn-ghost"
                                style={{ padding: '0.22rem 0.4rem', fontSize: '0.72rem' }}
                                title="Copy definition"
                              >
                                <Copy size={11} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
