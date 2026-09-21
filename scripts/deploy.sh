#!/usr/bin/env bash
# =============================================================================
# SLLK Local Build & Deploy Script
# Builds index manifests, compiles the web portal, and deploys to GitHub Pages
# =============================================================================

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "🚀 [1/5] Generating article & library indexes..."
python3 scripts/generate_index.py
python3 scripts/generate_library_index.py

echo "🔄 [2/5] Syncing assets to web/public..."
mkdir -p web/public/images web/public/posts web/public/library
cp posts.json web/public/
cp library.json web/public/
if [ -d images ]; then cp -r images/* web/public/images/ 2>/dev/null || true; fi
if [ -d posts ]; then cp -r posts/* web/public/posts/ 2>/dev/null || true; fi
if [ -d library ]; then cp -R library/. web/public/library/ 2>/dev/null || true; fi

echo "🔨 [3/5] Building Web Studio bundle with Vite & TypeScript..."
cd web
npm run build
cd "$REPO_ROOT"

echo "📦 [4/5] Preparing root GitHub Pages bundle..."
touch .nojekyll
cp web/dist/index.html ./index.html
rm -rf assets
cp -r web/dist/assets ./assets
if [ -f web/public/privacy.html ]; then cp web/public/privacy.html ./privacy.html; fi

git add posts.json library.json index.html assets/ .nojekyll privacy.html web/public/ web/package.json scripts/

if git diff --staged --quiet; then
  echo "✨ Already up-to-date! No new changes to commit."
else
  COMMIT_MSG="${1:-chore: build and deploy to GitHub Pages from terminal}"
  git commit -m "$COMMIT_MSG"
  git push origin main
  echo "🎉 Successfully deployed! Your changes are now live on GitHub Pages."
fi
