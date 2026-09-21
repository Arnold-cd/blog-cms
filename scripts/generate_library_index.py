#!/usr/bin/env python3
"""
PDF Library Index Generator for Git-based Headless CMS
======================================================
Validates the PDF Library documents, resolves relative asset paths
(PDF files in library/pdfs/ and cover images in library/covers/) to
production CDN URLs, computes actual file sizes, and writes the
canonical `library.json` manifest.
"""

import os
import sys
import json
import argparse
from datetime import datetime
from pathlib import Path

REQUIRED_FIELDS = [
    "id",
    "title",
    "category",
    "file_name",
]

def format_file_size(size_bytes: int) -> str:
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    elif size_bytes < 1024 * 1024 * 1024:
        return f"{size_bytes / (1024 * 1024):.1f} MB"
    else:
        return f"{size_bytes / (1024 * 1024 * 1024):.1f} GB"

def get_git_repo_slug() -> str:
    env_repo = os.getenv("GITHUB_REPOSITORY")
    if env_repo:
        return env_repo
    return "Arnold-cd/blog-cms"

def build_library_index(
    workspace_root: Path,
    base_url: str,
    output_file: Path,
    dry_run: bool = False
) -> int:
    library_dir = workspace_root / "library"
    pdfs_dir = library_dir / "pdfs"
    covers_dir = library_dir / "covers"
    manifest_path = workspace_root / "library.json"

    pdfs_dir.mkdir(parents=True, exist_ok=True)
    covers_dir.mkdir(parents=True, exist_ok=True)

    items = []
    if manifest_path.exists():
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                items = json.load(f)
                if not isinstance(items, list):
                    items = []
        except Exception as e:
            print(f"⚠️ Warning: Could not parse existing library.json: {e}")
            items = []

    # Auto-discover any new PDFs uploaded directly to library/pdfs/
    import re
    indexed_files = {item.get("file_name") for item in items if item.get("file_name")}
    for pdf_path in sorted(pdfs_dir.glob("*.pdf")):
        if pdf_path.name not in indexed_files:
            stem = pdf_path.stem
            doc_id = re.sub(r'[^a-zA-Z0-9_-]', '-', stem.lower()).strip('-')
            clean_title = stem.replace("_", " ").replace("-", " ")
            print(f"🆕 Auto-discovered new PDF document: {pdf_path.name}")
            items.append({
                "id": doc_id,
                "title": clean_title,
                "category": "General",
                "file_name": pdf_path.name,
                "description": "",
                "author": "SLLK",
                "language": "mni",
                "published_date": datetime.now().strftime("%Y-%m-%d"),
                "featured": False,
                "tags": ["Manuscript"]
            })

    validated_items = []
    for item in items:
        missing = [f for f in REQUIRED_FIELDS if not item.get(f)]
        if missing:
            print(f"❌ Skipping item '{item.get('id', 'unknown')}': missing fields {missing}")
            continue

        doc_id = item["id"]
        file_name = item["file_name"]
        pdf_file = pdfs_dir / file_name

        # Calculate or verify file size
        if pdf_file.exists():
            actual_size = pdf_file.stat().st_size
            item["file_size_bytes"] = actual_size
            item["file_size_formatted"] = format_file_size(actual_size)
        else:
            item.setdefault("file_size_bytes", 0)
            item.setdefault("file_size_formatted", "0 KB")

        # Resolve URLs
        clean_base = base_url.rstrip("/")
        item["pdf_url"] = f"{clean_base}/library/pdfs/{file_name}"

        # Match actual cover image from candidates
        actual_cover = None
        candidates = [
            item.get("cover_name"),
            f"{doc_id}-cover.png",
            f"{doc_id}.png",
            f"{doc_id}-cover.jpg",
            f"{doc_id}.jpg",
        ]
        if item.get("cover_url"):
            existing_name = item["cover_url"].split("/")[-1]
            candidates.insert(0, existing_name)

        for cand in candidates:
            if cand and (covers_dir / cand).exists():
                actual_cover = cand
                break

        if actual_cover:
            item["cover_name"] = actual_cover
            item["cover_url"] = f"{clean_base}/library/covers/{actual_cover}"
        elif item.get("cover_url"):
            pass
        else:
            item["cover_url"] = ""

        item.setdefault("description", "")
        item.setdefault("author", "Unknown Author")
        item.setdefault("language", "en")
        item.setdefault("published_date", datetime.now().strftime("%Y-%m-%d"))
        item.setdefault("page_count", 1)
        item.setdefault("featured", False)
        item.setdefault("tags", [])

        validated_items.append(item)

    # Sort featured first, then published_date descending
    validated_items.sort(
        key=lambda x: (
            not x.get("featured", False),
            x.get("published_date", "")
        ),
        reverse=True
    )

    print(f"📚 Validated {len(validated_items)} PDF documents.")

    if not dry_run:
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(validated_items, f, indent=2, ensure_ascii=False)
        print(f"✅ Generated library manifest at: {output_file}")

    return 0

def main():
    parser = argparse.ArgumentParser(description="PDF Library Index Manifest Generator")
    parser.add_argument("--root", default=".", help="Root directory of the repository")
    parser.add_argument("--base-url", default=None, help="Base CDN / Raw GitHub URL")
    parser.add_argument("--output", default="library.json", help="Output JSON path")
    parser.add_argument("--check", action="store_true", help="Dry run verification only")

    args = parser.parse_args()
    workspace_root = Path(args.root).resolve()
    repo_slug = get_git_repo_slug()
    default_base_url = os.getenv("CMS_BASE_URL") or f"https://raw.githubusercontent.com/{repo_slug}/main"
    base_url = args.base_url or default_base_url
    output_path = workspace_root / args.output

    return build_library_index(
        workspace_root=workspace_root,
        base_url=base_url,
        output_file=output_path,
        dry_run=args.check
    )

if __name__ == "__main__":
    sys.exit(main())
