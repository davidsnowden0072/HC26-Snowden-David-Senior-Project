/**
 * courses.js
 * 
 * Routes for course and review operations.
 * Handles:
 * - GET /api/courses/:id - Get single course with average rating
 * - GET /api/courses/:id/reviews - Get all reviews for a course
 * - POST /api/courses/:id/reviews - Submit a new review
 */

import express from 'express';
import { supabase } from '../config/supabase.js';
import { MIN_RATING, MAX_RATING, HTTP_STATUS } from '../constants.js';

const router = express.Router();

/**
 * GET /api/courses/:id
 * Fetch a single course with its average rating and review count
 */
router.get('/:id', async (req, res) => {
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
      return res.status(HTTP_STATUS.NOT_FOUND).json({ 
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
    console.error("💥 Error in GET /api/courses/:id:", err.message);
    res.status(HTTP_STATUS.SERVER_ERROR).json({ 
      success: false, 
      error: err.message || "Internal server error"
    });
  }
});

/**
 * GET /api/courses/:id/reviews
 * Fetch all reviews for a specific course
 */
router.get('/:id/reviews', async (req, res) => {
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
    console.error("💥 Error in GET /api/courses/:id/reviews:", err.message);
    res.status(HTTP_STATUS.SERVER_ERROR).json({ 
      success: false, 
      error: err.message 
    });
  }
});

/**
 * POST /api/courses/:id/reviews
 * Submit a new review for a course
 */
router.post('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, student_name } = req.body;

    console.log("📍 Submitting review for course ID:", id);

    // ----------------------------
    // 🔥 FIXED VALIDATION LOGIC
    // ----------------------------

    // Rating must exist (0 is NOT treated as missing)
    if (rating === undefined || rating === null) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Rating and comment are required"
      });
    }

    // Rating must be between MIN_RATING and MAX_RATING
    if (typeof rating !== "number" || rating < MIN_RATING || rating > MAX_RATING) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: `Rating must be between ${MIN_RATING} and ${MAX_RATING}`
      });
    }

    // Comment must exist and not be empty
    if (!comment || comment.trim() === "") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Rating and comment are required"
      });
    }

    // ----------------------------
    // Insert review
    // ----------------------------
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

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Review submitted successfully",
      data: data[0]
    });

  } catch (err) {
    console.error("💥 Error in POST /api/courses/:id/reviews:", err.message);
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: err.message
    });
  }
});

export default router;
