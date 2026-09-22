import React, { useState, useMemo } from 'react';
import type { BlogPost } from '../types';
import { Search, Clock, Sparkles, Plus } from 'lucide-react';

interface PostListProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  onOpenEditor: () => void;
}

export const PostList: React.FC<PostListProps> = ({ posts, onSelectPost, onOpenEditor }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [posts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [posts, searchQuery, selectedCategory]);

  // Featured hero post
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
    <div>
      {/* Editorial Header */}
      <div className="feed-header">
        <div className="feed-title-bar">
          <div>
            <h1>The Publication</h1>
            <p>Thoughtful essays, technical deep-dives, and serverless architectures.</p>
          </div>
          <button onClick={onOpenEditor} className="btn-primary" id="btn-create-post-top">
            <Plus size={16} />
            <span>Write Article</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="feed-filter-bar">
          <div className="feed-category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                id={`filter-cat-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="feed-search-wrap">
            <Search size={15} className="feed-search-icon" />
            <input
              type="text"
              className="feed-search-input"
              placeholder="Search publication..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="input-article-search"
            />
          </div>
        </div>
      </div>

      {/* Featured Hero Article */}
      {featuredPost && selectedCategory === 'All' && !searchQuery && (
        <section
          className="featured-hero"
          onClick={() => onSelectPost(featuredPost)}
          id={`hero-card-${featuredPost.id}`}
        >
          <div className="featured-content">
            <div className="featured-meta-row">
              <span className="featured-badge">
                <Sparkles size={11} />
                Featured
              </span>
              <span>&bull;</span>
              <span>{featuredPost.category}</span>
              <span>&bull;</span>
              <span>{featuredPost.reading_time_min} min read</span>
            </div>

            <h2 className="featured-title">{featuredPost.title}</h2>
            <p className="featured-summary">{featuredPost.summary}</p>

            <div className="featured-author-row">
              <div className="author-avatar-fallback" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                {featuredPost.author.charAt(0)}
              </div>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{featuredPost.author}</span>
              <span>&bull;</span>
              <span>{formatDate(featuredPost.date)}</span>
            </div>
          </div>

          {featuredPost.thumbnail_url && (
            <div className="featured-banner-wrap">
              <img
                src={featuredPost.thumbnail_url}
                alt={featuredPost.title}
                className="featured-banner-img"
                loading="eager"
                onError={(e) => {
                  const target = e.currentTarget;
                  const parent = target.parentElement;
                  if (parent) parent.style.display = 'none';
                }}
              />
            </div>
          )}
        </section>
      )}

      {/* Grid of Articles */}
      {filteredPosts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 600 }}>No stories found</h3>
          <p style={{ marginTop: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try refining your search query or clear the selected filters.</p>
          <button onClick={onOpenEditor} className="btn-primary" style={{ marginTop: '1.5rem' }}>
            <Plus size={16} />
            <span>Compose Article</span>
          </button>
        </div>
      ) : (
        <div className="posts-grid">
          {(selectedCategory === 'All' && !searchQuery ? nonFeaturedPosts : filteredPosts).map((post) => (
            <article
              key={post.id}
              className="post-card"
              onClick={() => onSelectPost(post)}
              id={`card-post-${post.id}`}
            >
              {post.thumbnail_url ? (
                <div className="card-banner-wrap">
                  <img
                    src={post.thumbnail_url}
                    alt={post.title}
                    className="card-banner-img"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const parent = target.parentElement;
                      if (parent) parent.style.display = 'none';
                    }}
                  />
                  <span className="card-lang-pill" style={{ fontFamily: post.language === "mni" ? "var(--font-meetei)" : undefined }}>{post.language === "mni" ? "ꯃꯤꯇꯩ ꯃꯌꯦꯛ" : post.language.toUpperCase()}</span>
                </div>
              ) : null}

              <div className="card-body">
                <div className="card-meta-row">
                  <span className="card-category-tag">{post.category}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={12} />
                    {post.reading_time_min}m
                  </span>
                </div>

                <h3 className="card-title">{post.title}</h3>
                <p className="card-summary">{post.summary}</p>

                <div className="card-footer-row">
                  <span>{post.author}</span>
                  <span>{formatDate(post.date)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
