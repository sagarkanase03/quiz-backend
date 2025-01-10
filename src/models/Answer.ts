export interface Answer {
  question_id: string;
  selected_option: number;
  is_correct: boolean;
}

export interface UserAnswers {
  quiz_id: string;
  user_id: string;
  answers: Answer[];
  score: number;
}
