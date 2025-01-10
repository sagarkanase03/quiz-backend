import { Router } from "express";
import {
  createQuizHandler,
  getQuizHandler,
  submitAnswerHandler,
  getResultsHandler,
} from "../controllers/quizController";

const router = Router();

router.post("/", createQuizHandler);
router.get("/:id", getQuizHandler);
router.post(
  "/:userId/:quizId/questions/:questionId/answer",
  submitAnswerHandler
);
router.get("/:userId/:quizId/results", getResultsHandler);

export default router;
