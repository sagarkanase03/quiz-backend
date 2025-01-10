export interface Question {
  id: string;
  text: string;
  options: string[];
  correct_option?: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}
