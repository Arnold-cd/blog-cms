import React from 'react';
import { BookOpen, PenLine, Sun, Moon, Library } from 'lucide-react';

interface NavbarProps {
  activeTab: 'feed' | 'editor' | 'library';
  onSelectTab: (tab: 'feed' | 'editor' | 'library') => void;
  postCount: number;
  pdfCount?: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  postCount,
  pdfCount = 0,
  theme,
  onToggleTheme,
}) => {
  return (
    <div className="navbar-wrap">
      <header className="navbar">
        {/* Brand */}
        <div className="nav-brand" onClick={() => onSelectTab('feed')}>
          <div className="nav-brand-logo">
            <BookOpen size={15} />
          </div>
          <span className="nav-brand-title">Blog CMS</span>
          <span className="nav-brand-pill">Git Headless</span>
        </div>

        {/* Centered Segmented Tabs */}
        <nav className="nav-segmented-tabs">
          <button
            className={`nav-tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => onSelectTab('feed')}
            id="tab-articles"
          >
            <BookOpen size={14} />
            <span>Articles</span>
            {postCount > 0 && <span className="nav-tab-count">{postCount}</span>}
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => onSelectTab('editor')}
            id="tab-cms-studio"
          >
            <PenLine size={14} />
            <span>CMS Studio</span>
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'library' ? 'active' : ''}`}
            onClick={() => onSelectTab('library')}
            id="tab-pdf-library"
          >
            <Library size={14} />
            <span>PDF Library</span>
            {pdfCount > 0 && <span className="nav-tab-count" style={{ background: 'rgba(217, 119, 6, 0.25)', color: '#d97706' }}>{pdfCount}</span>}
          </button>
        </nav>

        {/* Actions: Theme Toggle */}
        <div className="nav-actions">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            id="btn-theme-toggle"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle light/dark theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun size={14} />
                <span className="theme-toggle-label">Light</span>
              </>
            ) : (
              <>
                <Moon size={14} />
                <span className="theme-toggle-label">Dark</span>
              </>
            )}
          </button>
        </div>
      </header>
    </div>
  );
};
