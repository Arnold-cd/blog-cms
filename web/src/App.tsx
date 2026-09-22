import { useEffect, useState } from 'react';
import type { BlogPost, PdfDocument, PostDraft } from './types';
import { fetchPosts } from './services/cmsService';
import { deleteFromGitHub } from './services/exportService';
import { fetchLibraryDocuments } from './services/libraryService';
import { Navbar } from './components/Navbar';
import { PostList } from './components/PostList';
import { ArticleView } from './components/ArticleView';
import { CmsEditor } from './components/CmsEditor';
import { PdfLibraryView } from './components/PdfLibraryView';
import { RefreshCw, BookOpen, Download } from 'lucide-react';

export function App() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pdfDocuments, setPdfDocuments] = useState<PdfDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingLibrary, setLoadingLibrary] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [postToEdit, setPostToEdit] = useState<PostDraft | null>(null);
  const [activeTab, setActiveTab] = useState<'feed' | 'editor' | 'library'>('feed');

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

  const loadLibrary = async () => {
    setLoadingLibrary(true);
    try {
      const docs = await fetchLibraryDocuments();
      setPdfDocuments(docs);
    } catch (err) {
      console.warn('Could not load PDF library:', err);
    } finally {
      setLoadingLibrary(false);
    }
  };

  useEffect(() => {
    loadPosts();
    loadLibrary();
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

  const handlePostPublished = (publishedPost: BlogPost) => {
    setPosts((prev) => {
      const exists = prev.some((p) => p.id === publishedPost.id);
      if (exists) {
        return prev.map((p) => (p.id === publishedPost.id ? publishedPost : p));
      }
      return [publishedPost, ...prev];
    });
  };

  const handleDeletePost = async (postToDelete: BlogPost, token: string) => {
    const repo = "Arnold-cd/blog-cms";
    await deleteFromGitHub(token, repo, postToDelete.id);
    setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
    setSelectedPost(null);
    setActiveTab("feed");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditDraft = () => {
    setSelectedPost(null);
    setActiveTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditArticle = (draftToLoad: PostDraft) => {
    localStorage.setItem('blog_cms_current_draft', JSON.stringify(draftToLoad));
    setPostToEdit(draftToLoad);
    setSelectedPost(null);
    setActiveTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePdfAdded = (newDoc: PdfDocument) => {
    setPdfDocuments((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);
  };

  const handlePdfDeleted = (deletedId: string) => {
    setPdfDocuments((prev) => prev.filter((d) => d.id !== deletedId));
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
        pdfCount={pdfDocuments.length}
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
              <CmsEditor
                onPreviewInFeed={handlePreviewInFeed}
                onPostPublished={handlePostPublished}
                postToEdit={postToEdit}
                onDraftLoaded={() => setPostToEdit(null)}
              />
            </div>

            {selectedPost ? (
              <ArticleView
                post={selectedPost}
                onBack={handleBackToFeed}
                onEditDraft={handleEditDraft}
                onEditArticle={handleEditArticle}
                onDeletePost={handleDeletePost}
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
            ) : activeTab === 'library' ? (
              <PdfLibraryView
                documents={pdfDocuments}
                loading={loadingLibrary}
                onRefresh={loadLibrary}
                onDocumentAdded={handlePdfAdded}
                onDocumentDeleted={handlePdfDeleted}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="fonts/NotoSansMeeteiMayek-Regular.ttf"
              download="NotoSansMeeteiMayek-Regular.ttf"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.78rem' }}
              title="Download official Meetei Mayek TrueType Font (.ttf) for offline typing and translation"
            >
              <Download size={12} />
              <span>Meetei Mayek Font (.ttf)</span>
            </a>
            <span>Push markdown to <code>posts/</code> &bull; Auto-deployed via GitHub Actions</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
