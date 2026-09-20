import { useEffect, useState } from 'react';
import type { BlogPost } from './types';
import { fetchPosts } from './services/cmsService';
import { Navbar } from './components/Navbar';
import { PostList } from './components/PostList';
import { ArticleView } from './components/ArticleView';
import { CmsEditor } from './components/CmsEditor';
import { RefreshCw, BookOpen } from 'lucide-react';

export function App() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeTab, setActiveTab] = useState<'feed' | 'editor'>('feed');

  // Light / Dark Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('blog_cms_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('blog_cms_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load posts manifest');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToFeed = () => {
    setSelectedPost(null);
  };

  const handlePreviewInFeed = (draftPost: BlogPost) => {
    // Set draft as selected post and switch view directly to article reader
    setSelectedPost(draftPost);
    setActiveTab('feed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditDraft = () => {
    setSelectedPost(null);
    setActiveTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedPost(null);
        }}
        postCount={posts.length}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="main-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
            <RefreshCw size={32} style={{ marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
            <h3>Connecting to Git Headless CMS...</h3>
            <p style={{ marginTop: '0.5rem' }}>Fetching latest posts.json manifest</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'rgba(244, 63, 94, 0.08)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--accent-rose)' }}>
            <h3 style={{ color: 'var(--accent-rose)' }}>Unable to connect to CMS manifest</h3>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{error}</p>
            <button onClick={loadPosts} className="btn-primary" style={{ marginTop: '1.5rem' }}>
              Retry Connection
            </button>
          </div>
        ) : (
          <>
            {/* Always keep CmsEditor mounted so in-memory state, uploaded assets, and cursor are preserved */}
            <div style={{ display: activeTab === 'editor' && !selectedPost ? 'block' : 'none' }}>
              <CmsEditor onPreviewInFeed={handlePreviewInFeed} />
            </div>

            {selectedPost ? (
              <ArticleView
                post={selectedPost}
                onBack={handleBackToFeed}
                onEditDraft={handleEditDraft}
              />
            ) : activeTab === 'feed' ? (
              <PostList
                posts={posts}
                onSelectPost={handleSelectPost}
                onOpenEditor={() => {
                  setSelectedPost(null);
                  setActiveTab('editor');
                }}
              />
            ) : null}
          </>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={16} color="var(--accent-cyan)" />
            <span><strong>Blog CMS</strong> &bull; Serverless Git Headless Architecture</span>
          </div>
          <div>
            <span>Push markdown to <code>posts/</code> &bull; Auto-deployed via GitHub Actions</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
