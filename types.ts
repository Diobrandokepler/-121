
export interface Paper {
  id: string;
  title: string;
  authors: string;
  abstract: string;
  category: string;
  tags: string[];
  url: string;
  dateAdded: string;
  aiSummary?: string;
  status: 'pending' | 'analyzed';
}

export interface CategoryStats {
  name: string;
  count: number;
}

export enum ViewMode {
  LIBRARY = 'LIBRARY',
  ANALYTICS = 'ANALYTICS',
  SETTINGS = 'SETTINGS'
}
