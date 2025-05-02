
export interface Flashcard {
  id: string;
  front_content: string;
  back_content: string;
  document_id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  type: 'multiple-choice' | 'short-answer' | 'true-false';
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  document_id?: string;
  user_id?: string;
  created_at?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface StudySession {
  id: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  user_id: string;
  document_id?: string;
  quiz_id?: string;
  flashcard_set_id?: string;
  completed: boolean;
  score?: number;
}

export interface FlashcardSet {
  id: string;
  title: string;
  description?: string;
  flashcards: Flashcard[];
  document_id?: string;
  user_id?: string;
  created_at?: string;
  card_count: number;
}
