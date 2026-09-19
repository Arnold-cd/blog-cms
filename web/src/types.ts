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
}

export interface PostDraft {
  id: string;
  title: string;
  summary: string;
  date: string;
  author: string;
  category: string;
  thumbnail: string;
  language: string;
  featured: boolean;
  content: string;
}
