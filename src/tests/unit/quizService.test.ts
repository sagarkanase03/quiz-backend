import {
  createQuiz,
  getQuiz,
  submitAnswer,
  getResults,
} from "../../services/quizService";
import { Quiz } from "../../models/Quiz";

describe("Quiz Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a quiz", () => {
    const quiz: Quiz = {
      id: "quiz1",
      title: "Sample Quiz",
      questions: [
        {
          id: "q1",
          text: "What is 2 + 2?",
          options: ["1", "2", "3", "4"],
          correct_option: 3,
        },
      ],
    };

    createQuiz(quiz);
    const fetchedQuiz = getQuiz("quiz1");

    expect(fetchedQuiz?.title).toBe("Sample Quiz");
    expect(fetchedQuiz?.questions.length).toBe(1);
  });

  it("should return undefined if quiz is not found", () => {
    const quiz = getQuiz("nonexistent");
    expect(quiz).toBeUndefined();
  });

  it("should return questions without the correct answer", () => {
    const quiz: Quiz = {
      id: "quiz2",
      title: "Sample Quiz 2",
      questions: [
        {
          id: "q2",
          text: "What is the capital of India?",
          options: ["Mumbai", "Pune", "Delhi", "Jaipur"],
          correct_option: 2,
        },
      ],
    };

    createQuiz(quiz);
    const fetchedQuiz = getQuiz("quiz2");

    expect(fetchedQuiz?.questions[0].correct_option).toBeUndefined();
  });

  it("should submit an answer and mark it correct", () => {
    const quiz: Quiz = {
      id: "quiz3",
      title: "Math Quiz",
      questions: [
        {
          id: "q3",
          text: "What is 5 x 5?",
          options: ["20", "25", "30", "35"],
          correct_option: 1,
        },
      ],
    };

    createQuiz(quiz);

    const result = submitAnswer("quiz3", "user1", {
      question_id: "q3",
      selected_option: 1,
      is_correct: false,
    });

    expect(result?.is_correct).toBe(true);
  });

  it("should submit an answer and mark it incorrect", () => {
    const quiz: Quiz = {
      id: "quiz4",
      title: "Geography Quiz",
      questions: [
        {
          id: "q4",
          text: "Which continent is India in?",
          options: ["Asia", "Africa", "Oceania", "Europe"],
          correct_option: 0,
        },
      ],
    };

    createQuiz(quiz);

    const result = submitAnswer("quiz4", "user2", {
      question_id: "q4",
      selected_option: 2,
      is_correct: false,
    });

    expect(result?.is_correct).toBe(false);
  });

  it("should get results for a quiz", () => {
    const quiz: Quiz = {
      id: "quiz5",
      title: "History Quiz",
      questions: [
        {
          id: "q5",
          text: "Who discovered America?",
          options: ["Columbus", "Vasco da Gama", "Magellan", "Cook"],
          correct_option: 0,
        },
      ],
    };

    createQuiz(quiz);

    submitAnswer("quiz5", "user3", {
      question_id: "q5",
      selected_option: 0,
      is_correct: false,
    });

    const results = getResults("quiz5", "user3");

    expect(results?.score).toBe(1);
    expect(results?.answers.length).toBe(1);
  });

  it("should return undefined if results are not found", () => {
    const results = getResults("quiz6", "user4");
    expect(results).toBeUndefined();
  });
});
