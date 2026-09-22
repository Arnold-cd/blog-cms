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
import { Languages, Copy, Check, Plus, ExternalLink, X, Download, Sparkles } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'translate' | 'vowels' | 'puya18' | 'main27' | 'lonsum' | 'cheitap' | 'extensions' | 'numerals'>('vowels');
  const [sampleConsonant, setSampleConsonant] = useState<string>('ꯀ');
  const [showFullMatrix, setShowFullMatrix] = useState<boolean>(false);
  const [matrixFilter, setMatrixFilter] = useState<'all' | 'main' | 'lonsum'>('all');

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
    <div className="meetei-modal-overlay" style={{
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
      <div className="card" style={{
        width: '100%',
        maxWidth: '960px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        overflow: 'hidden',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem', padding: '1.25rem 1.25rem 0 1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Languages size={20} style={{ color: 'var(--accent-cyan)' }} />
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Meetei Mayek Linguistic Studio &amp; Reference
              </h3>
            </div>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Complete Unicode Standard (
              <a
                href="https://unicode.org/charts/PDF/UABC0.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}
              >
                U+ABC0..U+ABFF
              </a>
              ,{' '}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a
              href="fonts/Meetei-Mayek-Fonts.zip"
              download="Meetei-Mayek-Fonts.zip"
              className="btn-secondary"
              style={{
                textDecoration: 'none',
                fontSize: '0.78rem',
                padding: '0.35rem 0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
              title="Download Meetei Mayek TrueType Fonts (.ttf) Package with Regular, Bold, & Install Guide"
              id="btn-download-ttf-suite"
            >
              <Download size={13} />
              <span>Download TTF (.zip)</span>
            </a>

            <a
              href="fonts/PukokEeyek.otf"
              download="PukokEeyek.otf"
              className="btn-secondary"
              style={{
                textDecoration: 'none',
                fontSize: '0.78rem',
                padding: '0.35rem 0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
              title="Download Authentic Wakoklon Puya Pukok Eeyek Font (.otf) by Kanglei Eempham"
              id="btn-download-pukok-suite"
            >
              <Download size={13} />
              <span>Pukok OTF</span>
            </a>

            <button onClick={onClose} className="btn-ghost" style={{ padding: '0.35rem' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="meetei-modal-tabs" style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', flexWrap: 'wrap', padding: '0 1.25rem' }}>
          <button
            className={`category-chip ${activeTab === 'vowels' ? 'active' : ''}`}
            onClick={() => setActiveTab('vowels')}
            id="tab-vowels-suite"
          >
            Vowels (7 Independent &amp; 8 Diacritics)
          </button>
          <button
            className={`category-chip ${activeTab === 'translate' ? 'active' : ''}`}
            onClick={() => setActiveTab('translate')}
          >
            Translate / Transliterate
          </button>
          <button
            className={`category-chip ${activeTab === 'puya18' ? 'active' : ''}`}
            onClick={() => setActiveTab('puya18')}
            style={{
              borderColor: activeTab === 'puya18' ? 'var(--accent-amber)' : undefined,
              color: activeTab === 'puya18' ? 'var(--accent-amber)' : undefined,
            }}
          >
            <Sparkles size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
            Wakoklon Puya (18 vs 27) &amp; Key Layout
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
                    <span className="form-label" style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: 0 }}>
                      <Sparkles size={13} />
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
                    color: 'var(--accent-amber)',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '550px', overflowY: 'auto' }}>
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
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', minWidth: '75px', fontWeight: 600 }}>8 Lonsum:</span>
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
                        color: sampleConsonant === l.char ? 'var(--accent-amber)' : 'var(--accent-amber)',
                        background: sampleConsonant === l.char ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.05)',
                        border: sampleConsonant === l.char ? '1px solid var(--accent-amber)' : '1px solid var(--border-subtle)',
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
                            <td style={{ padding: '0.35rem 0.5rem', textAlign: 'left', color: letter.category === 'lonsum' ? 'var(--accent-amber)' : 'var(--text-primary)', fontWeight: 600 }}>
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
                                      color: letter.category === 'lonsum' ? 'var(--accent-amber)' : 'var(--accent-cyan)',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '580px', overflowY: 'auto', paddingRight: '0.4rem' }}>
            {/* Header & Source Charter Info */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.03) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1.2rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} style={{ color: 'var(--accent-amber)' }} />
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Wakoklon Heelel Thilel Salai Ama-Ilon Pukok Puya (18 vs 27 Scripts)
                  </h4>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a
                    href="fonts/PukokEeyek.otf"
                    download="PukokEeyek.otf"
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', color: 'var(--accent-amber)' }}
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
                  <span style={{ color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.9rem' }}>꯱ &bull; The Sacred Eelik (Blood Drop)</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  In the original Puya (Singthalon Cheising Eeyek Ama), the numeral <strong>1</strong> is written as <strong>$*</strong> with an <strong>Eelik</strong> (dot <code style={{ color: 'var(--accent-amber)' }}>.</code>), representing the sacred blood drop of the Universal Father God Creator, <em>Eapung Loinapa Apakpa</em>.
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
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-amber)', display: 'block', marginBottom: '0.4rem' }}>
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
                        <span style={{ fontFamily: 'var(--font-pukok)', fontSize: '1.45rem', color: 'var(--accent-amber)', lineHeight: 1 }}>
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
