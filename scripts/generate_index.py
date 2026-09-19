#!/usr/bin/env python3
"""
Blog Index Generator for Git-based Headless CMS
=================================================
Scans the `posts/` directory for Markdown (.md) files, validates their YAML
frontmatter, computes reading time, resolves relative asset paths into absolute
URLs (GitHub Raw / GitHub Pages / CDN), and generates a sorted `posts.json` index.

Supports:
- python-frontmatter & PyYAML if installed.
- Zero-dependency fallback YAML parser if PyYAML is not installed.
"""

import os
import sys
import re
import json
import math
import argparse
import subprocess
from datetime import datetime
from pathlib import Path

# Optional imports with graceful fallback
try:
    import yaml
    HAS_YAML = True
except ImportError:
    HAS_YAML = False

try:
    import frontmatter
    HAS_FRONTMATTER = True
except ImportError:
    HAS_FRONTMATTER = False


REQUIRED_FIELDS = [
    "id",
    "title",
    "summary",
    "date",
    "author",
    "category",
    "thumbnail",
    "language",
]


def parse_frontmatter_fallback(content: str):
    """
    Zero-dependency frontmatter parser for basic YAML frontmatter.
    Extracts metadata between leading --- and ---.
    """
    pattern = re.compile(r"^---\s*\n(.*?)\n---\s*\n(.*)$", re.DOTALL)
    match = pattern.match(content)
    if not match:
        return {}, content

    yaml_block = match.group(1)
    body = match.group(2)
    metadata = {}

    for line in yaml_block.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if ":" in line:
            key, val = line.split(":", 1)
            key = key.strip()
            val = val.strip()

            # Strip matching quotes
            if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                val = val[1:-1]
            elif val.lower() == "true":
                val = True
            elif val.lower() == "false":
                val = False
            elif re.match(r"^\d+$", val):
                val = int(val)
            metadata[key] = val

    return metadata, body


def parse_post(file_path: Path):
    """
    Parses a single markdown file into metadata dict and body string.
    """
    with open(file_path, "r", encoding="utf-8") as f:
        raw_text = f.read()

    if HAS_FRONTMATTER:
        post = frontmatter.loads(raw_text)
        metadata = dict(post.metadata)
        body = post.content
    elif HAS_YAML:
        pattern = re.compile(r"^---\s*\n(.*?)\n---\s*\n(.*)$", re.DOTALL)
        match = pattern.match(raw_text)
        if match:
            metadata = yaml.safe_load(match.group(1)) or {}
            body = match.group(2)
        else:
            metadata, body = {}, raw_text
    else:
        metadata, body = parse_frontmatter_fallback(raw_text)

    return metadata, body


def calculate_reading_time(content: str) -> int:
    """
    Calculates estimated reading time in minutes based on word count.
    Standard average reading speed is ~200 words per minute.
    Supports English words and Unicode / Meetei Mayek script clusters.
    """
    # Strip markdown headers, code blocks, and links for word count
    clean_text = re.sub(r"```[\s\S]*?```", "", content)
    clean_text = re.sub(r"!\[.*?\]\(.*?\)", "", clean_text)
    clean_text = re.sub(r"\[.*?\]\(.*?\)", "", clean_text)
    clean_text = re.sub(r"[#*`_>~]", " ", clean_text)

    # Match whitespace-separated tokens or unicode clusters
    words = clean_text.split()
    word_count = len(words)

    # Minimum reading time is 1 minute
    return max(1, math.ceil(word_count / 200))


def detect_repo_slug() -> str:
    """
    Detects the github owner/repo slug from git remotes or GITHUB_REPOSITORY env var.
    """
    if os.getenv("GITHUB_REPOSITORY"):
        return os.getenv("GITHUB_REPOSITORY")

    try:
        remote_url = subprocess.check_output(
            ["git", "config", "--get", "remote.origin.url"],
            stderr=subprocess.DEVNULL,
            text=True
        ).strip()
        # Handle https://github.com/owner/repo.git or git@github.com:owner/repo.git
        match = re.search(r"github\.com[:/]([^/]+)/([^/\.]+)(?:\.git)?$", remote_url)
        if match:
            return f"{match.group(1)}/{match.group(2)}"
    except Exception:
        pass

    return "Arnold-cd/blog-cms"


def resolve_url(path_or_url: str, base_url: str) -> str:
    """
    Resolves a relative path to an absolute URL using base_url.
    Leaves absolute URLs untouched.
    """
    if not path_or_url:
        return ""
    if path_or_url.startswith("http://") or path_or_url.startswith("https://"):
        return path_or_url
    
    clean_path = path_or_url.lstrip("/")
    return f"{base_url.rstrip('/')}/{clean_path}"


def validate_metadata(metadata: dict, file_name: str, strict: bool = False) -> list:
    """
    Validates that required frontmatter fields exist and are well-formed.
    Returns a list of validation error messages.
    """
    errors = []
    for field in REQUIRED_FIELDS:
        if field not in metadata or metadata[field] is None or str(metadata[field]).strip() == "":
            errors.append(f"Missing required field '{field}'")

    if "date" in metadata:
        date_str = str(metadata["date"]).strip()
        # Accept YYYY-MM-DD or datetime object
        if isinstance(metadata["date"], (datetime,)):
            metadata["date"] = metadata["date"].strftime("%Y-%m-%d")
        else:
            try:
                datetime.strptime(date_str, "%Y-%m-%d")
                metadata["date"] = date_str
            except ValueError:
                errors.append(f"Invalid date format '{date_str}', expected 'YYYY-MM-DD'")

    if "language" in metadata:
        lang = str(metadata["language"]).strip().lower()
        if lang not in ["en", "mni", "es", "fr", "hi"]:
            print(f"  [Notice] Non-standard language code: '{lang}' in {file_name}")

    return errors


def generate_index(
    posts_dir: Path,
    output_file: Path,
    base_url: str,
    strict: bool = False,
    validate_only: bool = False
) -> bool:
    """
    Main pipeline:
    1. Reads posts/*.md
    2. Validates frontmatter
    3. Builds sorted index
    4. Writes posts.json
    """
    print(f"\n=======================================================")
    print(f"🚀 Blog Index Generator (Git Headless CMS)")
    print(f"=======================================================")
    print(f"📁 Posts Directory : {posts_dir.resolve()}")
    print(f"🌐 Base Content URL: {base_url}")
    print(f"📄 Target Index    : {output_file.resolve()}")
    print(f"⚙️  Parser Mode     : {'python-frontmatter' if HAS_FRONTMATTER else ('PyYAML' if HAS_YAML else 'Built-in Fallback')}")
    print(f"-------------------------------------------------------\n")

    if not posts_dir.exists() or not posts_dir.is_dir():
        print(f"❌ Error: Posts directory '{posts_dir}' does not exist!")
        return False

    md_files = sorted(posts_dir.glob("*.md"))
    if not md_files:
        print(f"⚠️ Warning: No Markdown (.md) files found in '{posts_dir}'!")
        if not validate_only:
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump([], f, indent=2)
        return True

    posts_list = []
    has_errors = False

    for file_path in md_files:
        rel_path = file_path.name
        print(f"🔍 Processing: {rel_path}...", end=" ")

        try:
            metadata, body = parse_post(file_path)
        except Exception as e:
            print(f"FAILED (Parse error: {e})")
            has_errors = True
            continue

        errors = validate_metadata(metadata, rel_path, strict=strict)
        if errors:
            print(f"INVALID")
            for err in errors:
                print(f"   ❌ {err}")
            has_errors = True
            if strict:
                continue

        # Compute reading time
        reading_time = calculate_reading_time(body)

        # Resolve asset URLs
        thumb_raw = str(metadata.get("thumbnail", ""))
        thumbnail_url = resolve_url(thumb_raw, base_url)
        content_url = resolve_url(f"posts/{rel_path}", base_url)

        # Build post dictionary
        post_data = {
            "id": str(metadata.get("id", file_path.stem)),
            "title": str(metadata.get("title", "")),
            "summary": str(metadata.get("summary", "")),
            "date": str(metadata.get("date", "")),
            "author": str(metadata.get("author", "")),
            "category": str(metadata.get("category", "")),
            "thumbnail_url": thumbnail_url,
            "content_url": content_url,
            "reading_time_min": reading_time,
            "language": str(metadata.get("language", "en")),
            "featured": bool(metadata.get("featured", False)),
        }

        posts_list.append(post_data)
        print(f"OK ({reading_time} min read, date: {post_data['date']})")

    if has_errors and strict:
        print(f"\n❌ Execution stopped due to validation errors in strict mode.")
        return False

    # Sort posts by date descending (newest to oldest)
    # If dates match, sort alphabetically by title
    posts_list.sort(key=lambda p: (p.get("date", ""), p.get("title", "")), reverse=True)

    if validate_only:
        print(f"\n✅ Validation complete. Processed {len(posts_list)} posts successfully.")
        return True

    # Write formatted posts.json
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(posts_list, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"\n🎉 Successfully indexed {len(posts_list)} posts into '{output_file.name}'!")
    return True


def main():
    repo_slug = detect_repo_slug()
    default_base_url = os.getenv("CMS_BASE_URL") or f"https://raw.githubusercontent.com/{repo_slug}/main"

    parser = argparse.ArgumentParser(description="Git Headless CMS: Markdown Blog Post Indexer")
    parser.add_argument("--posts-dir", default="posts", help="Path to markdown posts folder (default: 'posts')")
    parser.add_argument("--output", default="posts.json", help="Path to output JSON file (default: 'posts.json')")
    parser.add_argument("--base-url", default=default_base_url, help=f"Base URL for resolving assets and content (default: '{default_base_url}')")
    parser.add_argument("--strict", action="store_true", help="Fail build if any post has validation errors")
    parser.add_argument("--validate-only", action="store_true", help="Validate posts without writing posts.json")

    args = parser.parse_args()

    posts_dir = Path(args.posts_dir)
    output_file = Path(args.output)

    success = generate_index(
        posts_dir=posts_dir,
        output_file=output_file,
        base_url=args.base_url,
        strict=args.strict,
        validate_only=args.validate_only
    )

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
