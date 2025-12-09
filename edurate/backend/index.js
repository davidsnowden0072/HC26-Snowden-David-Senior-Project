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

// Start of course review endpoints!!!!!!!

// GET course with average rating - MOVED BEFORE /reviews endpoint
app.get("/api/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📍 Fetching course with ID:", id);
    
    // Get course details
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();

    console.log("📊 Course query result:", { 
      found: !!course, 
      error: courseError?.message || 'none' 
    });

    if (courseError) {
      console.error("❌ Course error:", courseError);
      throw courseError;
    }
    
    if (!course) {
      console.log("⚠️ No course found for ID:", id);
      return res.status(404).json({ 
        success: false, 
        error: "Course not found" 
      });
    }
    
    console.log("✅ Course found:", course.Course_name);
    
    // Get reviews for this course
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("rating")
      .eq("course_id", id);

    console.log("📊 Reviews query result:", { 
      count: reviews?.length || 0,
      error: reviewsError?.message || 'none' 
    });

    if (reviewsError) {
      console.error("❌ Reviews error:", reviewsError);
      throw reviewsError;
    }
    
    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    
    console.log("✅ Returning course with rating:", avgRating);
    
    res.json({ 
      success: true, 
      data: {
        ...course,
        rating: avgRating,
        numReviews: reviews.length
      }
    });
  } catch (err) {
    console.error("💥 Error in /api/courses/:id:", err.message);
    res.status(500).json({ 
      success: false, 
      error: err.message || "Internal server error"
    });
  }
});

// GET reviews for a specific course
app.get("/api/courses/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📍 Fetching reviews for course ID:", id);
    
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("course_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Reviews fetch error:", error);
      throw error;
    }
    
    console.log("✅ Found", data.length, "reviews");
    
    res.json({ 
      success: true, 
      data: data 
    });
  } catch (err) {
    console.error("💥 Error in /api/courses/:id/reviews:", err.message);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// POST new review
app.post("/api/courses/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, student_name } = req.body;
    
    console.log("📍 Submitting review for course ID:", id);
    
    // Validation
    if (!rating || !comment) {
      return res.status(400).json({ 
        success: false, 
        error: "Rating and comment are required" 
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        error: "Rating must be between 1 and 5" 
      });
    }
    
    const { data, error } = await supabase
      .from("reviews")
      .insert([{ 
        course_id: parseInt(id),
        rating: parseInt(rating),
        comment,
        student_name: student_name || "Anonymous"
      }])
      .select();

    if (error) {
      console.error("❌ Review insert error:", error);
      throw error;
    }
    
    console.log("✅ Review submitted successfully");
    
    res.status(201).json({ 
      success: true, 
      message: "Review submitted successfully",
      data: data[0]
    });
  } catch (err) {
    console.error("💥 Error in POST /api/courses/:id/reviews:", err.message);
    res.status(400).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// End of course review endpoints !!!!!!!!!!

// 7. Start server at the end
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});