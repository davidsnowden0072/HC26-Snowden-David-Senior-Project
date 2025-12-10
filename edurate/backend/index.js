/**
 * index.js
 * 
 * Main Express application entry point.
 * Configures middleware, routes, and starts the server.
 */

// 1. Load environment variables
import dotenv from "dotenv";
dotenv.config();

// 2. Import dependencies
import express from "express";
import cors from "cors";

// 3. Import routes and middleware
import courseRoutes from './routes/courses.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { supabase } from './config/supabase.js';

// 4. Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// 5. Configure middleware
app.use(cors());
app.use(express.json());

// 6. Health check routes
app.get("/", (req, res) => {
  res.json({
    message: "EduRate API",
    version: "1.0.0",
    status: "running"
  });
});

app.get("/ping-supabase", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*");
    
    if (error) throw error;

    res.json({
      status: "success",
      data: data
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message
    });
  }
});

// 7. Mount API routes
app.use('/api/courses', courseRoutes);

// 8. Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// 9. Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});