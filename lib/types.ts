export type Category =
  | "User discussion/forums"
  | "Shopping/product pages"
  | "Review/affiliate blogs"
  | "Guide/how-to articles"
  | "Scientific/research articles"
  | "News/editorial pieces"
  | "Guide/how-to articles (unclassified)";

export interface SearchItem {
  title: string;
  url: string;
  description: string;
}

export interface ScoredResult extends SearchItem {
  domain: string;
  category: Category;
  score: 0 | 1;
  needsReview: boolean;
}

export interface ConditionResult {
  results: ScoredResult[];
  authenticityRate: number;
}

export interface AuditResponse {
  vanilla: ConditionResult;
  evasion: ConditionResult;
  query: string;
}

export interface AuditError {
  error: string;
}
