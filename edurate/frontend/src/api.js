/**
 * api.js
 * 
 * Central API service for communicating with the Express backend.
 * Handles all HTTP requests for courses and reviews.
 * 
 * Base URL is configured via environment variable VITE_API_URL.
 */
const API_URL = import.meta.env.VITE_API_URL; // this will be set in Vercel
console.log("API_URL:", API_URL);
export async function fetchCourses() {
  const response = await fetch(`${API_URL}/ping-supabase`);
  const data = await response.json();
  return data;
}

//*******Start of fetching functions for reviews**********

// Fetch single course with reviews
export async function fetchCourse(id) {
  const response = await fetch(`${API_URL}/api/courses/${id}`);
  const data = await response.json();
  return data;
}

// Fetch reviews for a course
export async function fetchReviews(courseId) {
  const response = await fetch(`${API_URL}/api/courses/${courseId}/reviews`);
  const data = await response.json();
  return data;
}

// Submit a new review
export async function submitReview(courseId, reviewData) {
  const response = await fetch(`${API_URL}/api/courses/${courseId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });
  const data = await response.json();
  return data;
} 
//*******End of fetching functions for reviews**********