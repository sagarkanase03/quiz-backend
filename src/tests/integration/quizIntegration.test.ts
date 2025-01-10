import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import {
  createQuizHandler,
  getQuizHandler,
  submitAnswerHandler,
  getResultsHandler,
} from "../../controllers/quizController";

const app = express();
app.use(bodyParser.json());

// Mock routes
app.post("/api/quizzes", createQuizHandler);
app.get("/api/quizzes/:id", getQuizHandler);
app.post(
  "/api/quizzes/:userId/:quizId/questions/:questionId/answer",
  submitAnswerHandler
);
app.get("/api/quizzes/:userId/:quizId/results", getResultsHandler);

// Mock data
const mockQuizzes: any = {};
const mockResults: any = {};

// Mock services
jest.mock("../../services/quizService", () => ({
  createQuiz: jest.fn((quiz) => {
    mockQuizzes[quiz.id] = quiz;
  }),
  getQuiz: jest.fn((id) => mockQuizzes[id]),
  submitAnswer: jest.fn((quizId, userId, answer) => {
    const quiz = mockQuizzes[quizId];
    const question = quiz.questions.find(
      (q: any) => q.id === answer.question_id
    );
    const isCorrect = question.correct_option === answer.selected_option;

    if (!mockResults[quizId]) mockResults[quizId] = {};
    if (!mockResults[quizId][userId]) mockResults[quizId][userId] = [];

    mockResults[quizId][userId].push({
      questionId: answer.question_id,
      is_correct: isCorrect,
      correct_option: question.correct_option,
    });

    return { is_correct: isCorrect };
  }),
  getResults: jest.fn((quizId, userId) => {
    const userResults = mockResults[quizId]?.[userId] || [];
    const score = userResults.filter((r: any) => r.is_correct).length;
    return { quiz_id: quizId, score, answers: userResults };
  }),
}));

describe("Quiz API Integration Tests", () => {
  beforeEach(() => {
    Object.keys(mockQuizzes).forEach((key) => delete mockQuizzes[key]);
    Object.keys(mockResults).forEach((key) => delete mockResults[key]);
  });

  it("should create a new quiz", async () => {
    const newQuiz = {
      title: "Sample Quiz",
      questions: [
        {
          text: "What is the capital of India?",
          options: ["Mumbai", "Pune", "Delhi", "Jaipur"],
          correct_option: 2,
        },
      ],
    };

    const response = await request(app)
      .post("/api/quizzes")
      .send(newQuiz)
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body.message).toBe("Quiz created successfully.");
  });

  it("should return 400 for invalid quiz data", async () => {
    const invalidQuiz = { title: "Invalid Quiz", questions: [] };

    const response = await request(app)
      .post("/api/quizzes")
      .send(invalidQuiz)
      .expect(400);

    expect(response.body.error).toBe("Invalid quiz data.");
  });

  it("should fetch a quiz by ID without revealing correct answers", async () => {
    const quizId = "quiz1";
    mockQuizzes[quizId] = {
      id: quizId,
      title: "Sample Quiz",
      questions: [
        {
          id: "q1",
          text: "What is the capital of India?",
          options: ["Mumbai", "Pune", "Delhi", "Jaipur"],
          correct_option: 2,
        },
      ],
    };

    const response = await request(app)
      .get(`/api/quizzes/${quizId}`)
      .expect(200);

    expect(response.body.id).toBe(quizId);
    expect(response.body.questions[0]).not.toHaveProperty("correct_option");
  });

  it("should return 404 for a non-existent quiz", async () => {
    const response = await request(app)
      .get("/api/quizzes/invalid_id")
      .expect(404);

    expect(response.body.error).toBe("Quiz not found.");
  });

  it("should submit an answer and provide feedback", async () => {
    const userId = "abc123";
    const quizId = "quiz1";
    const questionId = "q1";

    mockQuizzes[quizId] = {
      id: quizId,
      title: "Sample Quiz",
      questions: [
        {
          id: questionId,
          text: "What is the capital of India?",
          options: ["Mumbai", "Pune", "Delhi", "Jaipur"],
          correct_option: 2,
        },
      ],
    };

    const response = await request(app)
      .post(`/api/quizzes/${userId}/${quizId}/questions/${questionId}/answer`)
      .send({ selected_option: 2 })
      .expect(200);

    expect(response.body.is_correct).toBe(true);
  });

  it("should return quiz results for a user", async () => {
    const userId = "abc123";
    const quizId = "quiz1";

    mockQuizzes[quizId] = {
      id: quizId,
      title: "Sample Quiz",
      questions: [
        {
          id: "q1",
          text: "What is the capital of India?",
          options: ["Mumbai", "Pune", "Delhi", "Jaipur"],
          correct_option: 2,
        },
      ],
    };

    await request(app)
      .post(`/api/quizzes/${userId}/${quizId}/questions/q1/answer`)
      .send({ selected_option: 2 });

    const response = await request(app)
      .get(`/api/quizzes/${userId}/${quizId}/results`)
      .expect(200);

    expect(response.body.quiz_id).toBe(quizId);
    expect(response.body.score).toBe(1);
  });
});
