/**
 * CourseDetails.jsx
 * 
 * Page component for displaying detailed course information and reviews.
 * Fetches and displays course data, allows users to submit reviews, and shows all existing reviews.
 * Handles loading, error, and success states with appropriate UI feedback.
 * 
 * Features:
 * - Displays course header with rating and metadata
 * - Review submission form (left column)
 * - List of all course reviews (right column)
 * - Automatic data refresh after review submission
 * - Navigation back to homepage on error
 * 
 * Route: /course/:id
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCourse, fetchReviews } from '../api';
import CourseHeader from '../components/CourseHeader';
import ReviewForm from '../components/ReviewForm';
import ReviewsList from '../components/ReviewsList';

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load course data and reviews
  const loadCourseData = async () => {
    try {
      const [courseResult, reviewsResult] = await Promise.all([
        fetchCourse(id),
        fetchReviews(id)
      ]);
      
      if (courseResult.success) {
        setCourse(courseResult.data);
      }
      
      if (reviewsResult.success) {
        setReviews(reviewsResult.data);
      }
    } catch (err) {
      console.error('Error loading course:', err);
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadCourseData();
  }, [id]);

  // Callback when review is submitted
  const handleReviewSubmitted = () => {
    loadCourseData(); // Reload to show new review and updated rating
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading course details...</p>
      </div>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Course not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-900 hover:text-blue-700 font-semibold"
          >
            ← Back to Courses
          </button>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header with Title and Rating */}
      <CourseHeader course={course} />

      {/* Main Content Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Review Form */}
          <div className="lg:col-span-1">
            <ReviewForm 
              courseId={id} 
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>

          {/* Right Column - Reviews List */}
          <div className="lg:col-span-2">
            <ReviewsList reviews={reviews} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;