import express from "express";
import quizRoutes from "./routes/quizRoutes";

const app = express();

app.use(express.json());
app.use("/quizzes", quizRoutes);

export default app;
