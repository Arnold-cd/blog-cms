import React from 'react';
import { BookOpen, PenLine, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  activeTab: 'feed' | 'editor';
  onSelectTab: (tab: 'feed' | 'editor') => void;
  postCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  postCount,
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
        </nav>

        {/* Actions: Theme Toggle & GitHub Link */}
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

          <a
            href="https://github.com/Arnold-cd/blog-cms"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-github-link"
            id="btn-github-repo"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </header>
    </div>
  );
};
