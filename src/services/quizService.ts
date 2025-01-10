import { Quiz } from "../models/Quiz";
import { Answer, UserAnswers } from "../models/Answer";

const quizzes = new Map<string, Quiz>();
const userAnswers = new Map<string, UserAnswers>();

export const createQuiz = (quiz: Quiz): any => {
  quizzes.set(quiz.id, quiz);
};

export const getQuiz = (id: string): any => {
  const quiz = quizzes.get(id);
  if (!quiz) return undefined;

  return {
    ...quiz,
    questions: quiz.questions.map(({ correct_option, ...q }) => q),
  };
};

export const submitAnswer = (
  quizId: string,
  userId: string,
  answer: Answer
): any => {
  const quiz = quizzes.get(quizId);
  if (!quiz) return undefined;

  const question = quiz.questions.find((q) => q.id === answer.question_id);
  if (!question) return undefined;

  const isCorrect = question.correct_option === answer.selected_option;

  const userKey = `${userId}-${quizId}`;

  const userQuizAnswers = userAnswers.get(userKey) || {
    quiz_id: quizId,
    user_id: userId,
    answers: [],
    score: 0,
  };

  userQuizAnswers.answers.push({ ...answer, is_correct: isCorrect });
  if (isCorrect) userQuizAnswers.score += 1;

  userAnswers.set(userKey, userQuizAnswers);
  return { ...answer, is_correct: isCorrect };
};

export const getResults = (quizId: string, userId: string): any => {
  return userAnswers.get(`${userId}-${quizId}`);
};
