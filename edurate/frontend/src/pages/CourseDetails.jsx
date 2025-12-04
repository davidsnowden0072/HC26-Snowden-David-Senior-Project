import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCourse, fetchReviews, submitReview } from '../api';
import { getRatingColor } from '../utils/helpers';

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [studentName, setStudentName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch course and reviews
  useEffect(() => {
    async function loadCourseData() {
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
    }

    loadCourseData();
  }, [id]);

  // Handle review submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setSubmitError('Please select a rating');
      return;
    }
    
    if (comment.trim().length < 10) {
      setSubmitError('Comment must be at least 10 characters');
      return;
    }
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const result = await submitReview(id, {
        rating,
        comment: comment.trim(),
        student_name: studentName.trim() || 'Anonymous'
      });
      
      if (result.success) {
        setSubmitSuccess(true);
        setRating(0);
        setComment('');
        setStudentName('');
        
        // Reload reviews
        const reviewsResult = await fetchReviews(id);
        if (reviewsResult.success) {
          setReviews(reviewsResult.data);
        }
        
        // Reload course to update average rating
        const courseResult = await fetchCourse(id);
        if (courseResult.success) {
          setCourse(courseResult.data);
        }
        
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        setSubmitError(result.error || 'Failed to submit review');
      }
    } catch (err) {
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading course details...</p>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="text-white hover:text-gray-200 mb-4 flex items-center"
          >
            ← Back to Courses
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{course.Course_name}</h1>
              <p className="text-blue-200">
                {course.Department} • Course ID: {course.Course_ID}
              </p>
            </div>
            
            {/* Overall Rating */}
            <div className={`${getRatingColor(course.rating)} text-white px-6 py-4 rounded-lg text-center`}>
              <div className="text-4xl font-bold">
                {course.rating === 0 ? 'N/A' : course.rating.toFixed(1)}
              </div>
              <div className="text-sm mt-1">
                {course.numReviews} {course.numReviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Review Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h2>
              
              <form onSubmit={handleSubmit}>
                {/* Star Rating */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-3xl transition-colors ${
                          star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        } hover:text-yellow-400`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      You rated: {rating} out of 5
                    </p>
                  )}
                </div>

                {/* Comment */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this course..."
                    rows="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Student Name (Optional) */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Anonymous"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  />
                </div>

                {/* Error Message */}
                {submitError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{submitError}</p>
                  </div>
                )}

                {/* Success Message */}
                {submitSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-600 text-sm">Review submitted successfully!</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Student Reviews ({reviews.length})
            </h2>

            {reviews.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-600">
                  No reviews yet. Be the first to review this course!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  >
                    {/* Review Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {review.student_name || 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      
                      {/* Star Rating */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-lg ${
                              star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="ml-2 text-gray-600 font-semibold">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>

                    {/* Review Comment */}
                    <p className="text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;