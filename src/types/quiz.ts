export interface QuizView {
  count: number;
  questions: string;
}

export interface QuizQuestion {
  q: string;
  o: string[];
  a: number;
  x?: string;
  h?: string;
}

export interface SavedScore {
  score: number;
  total: number;
}
