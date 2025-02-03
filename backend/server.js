import express from "express";
import cors from "cors";
import routes from "./routes.js"; // Ensure correct path

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Use routes
app.use("/", routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
