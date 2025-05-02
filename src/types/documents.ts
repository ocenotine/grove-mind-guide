
export interface Document {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  file_path?: string;
  file_type?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Annotation {
  id: string;
  content: string;
  page_number?: number;
  position?: {
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
  document_id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentFilter {
  searchTerm?: string;
  fileType?: string[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  sortBy?: 'title' | 'date' | 'type';
  sortOrder?: 'asc' | 'desc';
}
