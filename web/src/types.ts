export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  date: string;
  author: string;
  category: string;
  thumbnail_url: string;
  content_url: string;
  reading_time_min: number;
  language: string;
  featured: boolean;
  content?: string; // Optional embedded content for CMS Studio drafts & offline cache
  isDraft?: boolean;
}

export interface UploadedAsset {
  name: string;
  size: number;
  type: 'image' | 'pdf';
  file: File;
  previewUrl: string;
  cmsPath: string; // e.g. "images/filename.png"
}

export interface PostDraft {
  id: string;
  title: string;
  summary: string;
  date: string;
  author: string;
  category: string;
  thumbnail: string;
  thumbnailPreviewUrl?: string;
  language: string;
  featured: boolean;
  content: string;
  assets: UploadedAsset[];
}

export interface PdfDocument {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  language: string;
  published_date: string;
  file_name: string;
  pdf_url: string;
  cover_url: string;
  page_count: number;
  file_size_bytes: number;
  file_size_formatted: string;
  featured: boolean;
  tags: string[];
  source_type?: 'local' | 'archive' | 'gdrive';
}

export interface PdfUploadPayload {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  language: string;
  published_date: string;
  pdfFile: File;
  coverFile: File;
  coverPreviewUrl: string;
  page_count: number;
  file_size_bytes: number;
  file_size_formatted: string;
  featured: boolean;
  tags: string[];
}

export interface ExternalPdfPayload {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  language: string;
  published_date: string;
  file_name: string;
  pdf_url: string;
  cover_url: string;
  page_count: number;
  file_size_bytes: number;
  file_size_formatted: string;
  featured: boolean;
  tags: string[];
  source_type?: 'local' | 'archive' | 'gdrive';
}
