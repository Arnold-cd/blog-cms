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
