/**
 * courses.js
 * 
 * Routes for course and review operations.
 * Handles:
 * - GET /api/courses - Get all courses with average ratings (OPTIMIZED)
 * - GET /api/courses/:id - Get single course with average rating
 * - GET /api/courses/:id/reviews - Get all reviews for a course
 * - POST /api/courses/:id/reviews - Submit a new review with profanity filtering
 * - POST /api/courses/:courseId/reviews/:reviewId/upvote - Upvote a review 
 * - POST /api/courses/:courseId/reviews/:reviewId/downvote - Downvote a review 
 */

import express from 'express';
import { supabase } from '../config/supabase.js';
import { MIN_RATING, MAX_RATING, HTTP_STATUS } from '../constants.js';
import * as filter from 'leo-profanity';

const router = express.Router();

/**
 * GET /api/courses
 * Fetch all courses with their average ratings and review counts
 * OPTIMIZED: Uses database JOIN instead of fetching all reviews separately
 */
router.get('/', async (req, res) => {
  try {
    console.log("📍 Fetching all courses with ratings");
    
    // Use a single query with Supabase's JOIN
    const { data: courses, error } = await supabase
      .from("courses")
      .select(`
        *,
        reviews (
          rating
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    // Calculate ratings from the joined data
    const coursesWithRatings = courses.map(course => {
      const reviews = course.reviews || [];
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
      
      return {
        id: course.id,
        created_at: course.created_at,
        Department: course.Department,
        Course_ID: course.Course_ID,
        Course_name: course.Course_name,
        rating: avgRating,
        numReviews: reviews.length
      };
    });
    
    console.log("✅ Returning", coursesWithRatings.length, "courses with ratings");
    
    res.json({
      success: true,
      data: coursesWithRatings
    });
  } catch (err) {
    console.error("💥 Error in GET /api/courses:", err.message);
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      error: err.message
    });
  }
});

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
 * Submit a new review for a course with profanity filtering
 */
router.post('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, student_name } = req.body;

    console.log("📍 Submitting review for course ID:", id);

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

    // Check for inappropriate language using leo-profanity
    const foundInComment = filter.check(comment);
    const foundInName = student_name ? filter.check(student_name) : [];

    if (foundInComment.length > 0 || foundInName.length > 0) {
      console.log("⚠️ Review rejected due to inappropriate language");
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Review contains inappropriate language. Please keep feedback professional."
      });
    }

    // Insert review
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

/**
 * POST /api/courses/:courseId/reviews/:reviewId/upvote
 * Increment upvote count for a review
 */
router.post('/:courseId/reviews/:reviewId/upvote', async (req, res) => {
  try {
    const { reviewId } = req.params;
    console.log("📍 Upvoting review ID:", reviewId);
    
    // Get current vote counts
    const { data: review, error: fetchError } = await supabase
      .from("reviews")
      .select("upvotes")
      .eq("id", reviewId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Increment upvote
    const { data, error } = await supabase
      .from("reviews")
      .update({ upvotes: review.upvotes + 1 })
      .eq("id", reviewId)
      .select();
    
    if (error) throw error;
    
    console.log("✅ Review upvoted");
    
    res.json({
      success: true,
      data: data[0]
    });
  } catch (err) {
    console.error("💥 Error upvoting:", err.message);
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * POST /api/courses/:courseId/reviews/:reviewId/downvote
 * Increment downvote count for a review
 */
router.post('/:courseId/reviews/:reviewId/downvote', async (req, res) => {
  try {
    const { reviewId } = req.params;
    console.log("📍 Downvoting review ID:", reviewId);
    
    // Get current vote counts
    const { data: review, error: fetchError } = await supabase
      .from("reviews")
      .select("downvotes")
      .eq("id", reviewId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Increment downvote
    const { data, error } = await supabase
      .from("reviews")
      .update({ downvotes: review.downvotes + 1 })
      .eq("id", reviewId)
      .select();
    
    if (error) throw error;
    
    console.log("✅ Review downvoted");
    
    res.json({
      success: true,
      data: data[0]
    });
  } catch (err) {
    console.error("💥 Error downvoting:", err.message);
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      error: err.message
    });
  }
});

export default router;