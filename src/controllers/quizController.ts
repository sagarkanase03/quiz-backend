import { Request, Response } from "express";
import {
  createQuiz,
  getQuiz,
  submitAnswer,
  getResults,
} from "../services/quizService";
import { v4 as uuidv4 } from "uuid";
import { Answer } from "../models/Answer";

// API - CREATE Quiz
export const createQuizHandler = (req: Request, res: Response): any => {
  try {
    const { title, questions } = req.body;

    // Validate inputs
    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Invalid quiz data." });
    }

    // Validate each question
    for (const question of questions) {
      if (
        !question.text ||
        !Array.isArray(question.options) ||
        question.options.length !== 4 ||
        typeof question.correct_option !== "number"
      ) {
        return res.status(400).json({ error: "Invalid question format." });
      }
    }

    // Create quiz
    const quiz = {
      id: uuidv4(),
      title,
      questions: questions.map((q, index) => ({
        id: `q${index + 1}`,
        ...q,
      })),
    };

    createQuiz(quiz);

    res
      .status(201)
      .send({ id: quiz.id, message: "Quiz created successfully." });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create quiz." });
  }
};

// API - GET Quiz
export const getQuizHandler = (req: Request, res: Response): any => {
  try {
    // Get quiz
    const { id } = req.params;
    const quiz = getQuiz(id);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found." });
    }

    // Formate response
    const response = {
      id: quiz.id,
      title: quiz.title,
      questions: quiz.questions.map(({ correct_option, ...q }: any) => q),
    };

    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch quiz." });
  }
};

// API - POST Submit answer
export const submitAnswerHandler = (req: Request, res: Response): any => {
  try {
    const { quizId, questionId, userId } = req.params;
    const { selected_option } = req.body;

    if (typeof selected_option !== "number") {
      return res.status(400).json({ error: "Invalid answer format." });
    }

    // Get quiz
    const quiz = getQuiz(quizId);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found." });
    }

    // Get question
    const question = quiz.questions.find((q: any) => q.id === questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found." });
    }

    // Submit answer
    const answer: Answer = { question_id: questionId, ...req.body };
    const result = submitAnswer(quizId, userId, answer);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: "Failed to submit answer." });
  }
};

// API - GET Results
export const getResultsHandler = (req: Request, res: Response): any => {
  try {
    const { quizId } = req.params;

    // Get quiz
    const quiz = getQuiz(quizId);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found." });
    }

    // Get results
    const results = getResults(req.params.quizId, req.params.userId);

    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch quiz results." });
  }
};
