// 1. Import dotenv FIRST
import dotenv from "dotenv";
dotenv.config();

// 2. Import other packages
import express from "express";
import cors from "cors";
import { createClient } from '@supabase/supabase-js';

// 3. Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// 4. Middleware
app.use(cors());
app.use(express.json());

// 5. Initialize Supabase client HERE
const supabaseUrl = 'https://uchwzvymdthndlumpqab.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Optional: Add validation
if (!supabaseKey) {
  console.error("❌ Missing SUPABASE_KEY environment variable");
  process.exit(1);
}

console.log("✅ Supabase client initialized");

// 6. THEN define your routes below
app.get("/", (req, res) => {
  res.send("Hello from EduRate backend!");
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

// 7. Start server at the end
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});