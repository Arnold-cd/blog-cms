import React, { useState, useMemo } from 'react';
import type { BlogPost } from '../types';
import { Search, Clock, Calendar, User, Sparkles, Filter, Globe } from 'lucide-react';

interface PostListProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  onOpenEditor: () => void;
}

export const PostList: React.FC<PostListProps> = ({ posts, onSelectPost, onOpenEditor }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  // Compute unique categories and languages
  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [posts]);

  const languages = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.language) set.add(p.language);
    });
    return ['All', ...Array.from(set)];
  }, [posts]);

  // Filter posts based on search, category, language
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesLang = selectedLanguage === 'All' || post.language === selectedLanguage;

      return matchesSearch && matchesCat && matchesLang;
    });
  }, [posts, searchQuery, selectedCategory, selectedLanguage]);

  // Determine featured post
  const featuredPost = useMemo(() => {
    return posts.find((p) => p.featured) || (posts.length > 0 ? posts[0] : null);
  }, [posts]);

  const nonFeaturedPosts = useMemo(() => {
    if (!featuredPost) return filteredPosts;
    return filteredPosts.filter((p) => p.id !== featuredPost.id);
  }, [filteredPosts, featuredPost]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="post-list-container">
      {/* Featured Hero Article */}
      {featuredPost && selectedCategory === 'All' && selectedLanguage === 'All' && !searchQuery && (
        <div
          className="featured-hero-card"
          onClick={() => onSelectPost(featuredPost)}
          id={`hero-card-${featuredPost.id}`}
        >
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-tag-row">
                <span className="badge-featured">
                  <Sparkles size={13} />
                  Featured
                </span>
                <span className="badge-category">{featuredPost.category}</span>
                <span className="card-lang-badge" style={{ position: 'static' }}>
                  {featuredPost.language.toUpperCase()}
                </span>
              </div>
              <h1 className="hero-title">{featuredPost.title}</h1>
              <p className="hero-summary">{featuredPost.summary}</p>
              <div className="hero-meta-row">
                <span className="hero-meta-item">
                  <User size={15} />
                  {featuredPost.author}
                </span>
                <span className="hero-meta-item">
                  <Calendar size={15} />
                  {formatDate(featuredPost.date)}
                </span>
                <span className="hero-meta-item">
                  <Clock size={15} />
                  {featuredPost.reading_time_min} min read
                </span>
              </div>
            </div>
            <div className="hero-banner-wrap">
              <img
                src={featuredPost.thumbnail_url}
                alt={featuredPost.title}
                className="hero-banner-img"
                loading="eager"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = 'images/banner-philosophy.svg';
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Feed Filter & Search Controls */}
      <div className="feed-controls">
        <div className="search-bar-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search articles by title, keywords, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="input-article-search"
          />
        </div>

        <div className="filter-row">
          <div className="filter-pills-group">
            <Filter size={15} style={{ color: 'var(--accent-cyan)' }} />
            <span className="filter-label">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                id={`filter-cat-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="filter-pills-group">
            <Globe size={15} style={{ color: 'var(--accent-indigo)' }} />
            <span className="filter-label">Language:</span>
            {languages.map((lang) => (
              <button
                key={lang}
                className={`pill-btn ${selectedLanguage === lang ? 'active' : ''}`}
                onClick={() => setSelectedLanguage(lang)}
                id={`filter-lang-${lang.toLowerCase()}`}
              >
                {lang === 'en' ? 'English (en)' : lang === 'mni' ? 'Meetei Mayek (mni)' : lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {filteredPosts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <h3>No articles found matching your criteria</h3>
          <p style={{ marginTop: '0.5rem' }}>Try clearing filters or search query, or compose a new post.</p>
          <button
            onClick={onOpenEditor}
            className="btn-primary"
            style={{ marginTop: '1.5rem' }}
          >
            Create New Article in Studio
          </button>
        </div>
      ) : (
        <div className="post-grid">
          {(selectedCategory === 'All' && selectedLanguage === 'All' && !searchQuery
            ? nonFeaturedPosts
            : filteredPosts
          ).map((post) => (
            <article
              key={post.id}
              className="post-card"
              onClick={() => onSelectPost(post)}
              id={`card-post-${post.id}`}
            >
              <div className="card-banner">
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = 'images/banner-philosophy.svg';
                  }}
                />
                <span className="card-lang-badge">{post.language.toUpperCase()}</span>
              </div>
              <div className="card-body">
                <span className="card-category">{post.category}</span>
                <h2 className="card-title">{post.title}</h2>
                <p className="card-summary">{post.summary}</p>
                <div className="card-footer">
                  <span>{post.author}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span>{formatDate(post.date)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-cyan)' }}>
                      <Clock size={13} />
                      {post.reading_time_min}m
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
