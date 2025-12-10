/**
 * ReviewForm.jsx
 * 
 * Form component for submitting course reviews.
 * Allows users to:
 * - Select a star rating (1-5)
 * - Write a text review (minimum 10 characters)
 * - Optionally provide their name
 * 
 * Validates input and displays success/error messages.
 */

import { useState } from 'react';
import { submitReview } from '../api';
import { MIN_RATING, MAX_RATING, MIN_COMMENT_LENGTH, SUCCESS_MESSAGE_DURATION } from '../constants';

function ReviewForm({ courseId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [studentName, setStudentName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (rating < MIN_RATING || rating > MAX_RATING) {
      setError(`Rating must be between ${MIN_RATING} and ${MAX_RATING}`);
      return;
    }
    
    if (comment.trim().length < MIN_COMMENT_LENGTH) {
      setError(`Comment must be at least ${MIN_COMMENT_LENGTH} characters`);
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const result = await submitReview(courseId, {
        rating,
        comment: comment.trim(),
        student_name: studentName.trim() || 'Anonymous'
      });
      
      if (result.success) {
        setSuccess(true);
        setRating(0);
        setComment('');
        setStudentName('');
        
        // Notify parent to reload data
        onReviewSubmitted();
        
        // Hide success message after configured duration
        setTimeout(() => setSuccess(false), SUCCESS_MESSAGE_DURATION);
      } else {
        setError(result.error || 'Failed to submit review');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate array of star ratings based on constants
  const ratingOptions = Array.from(
    { length: MAX_RATING }, 
    (_, i) => i + MIN_RATING
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Star Rating Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating *
          </label>
          <div className="flex gap-2">
            {ratingOptions.map((star) => (
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
              You rated: {rating} out of {MAX_RATING}
            </p>
          )}
        </div>

        {/* Comment Text Area */}
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
          <p className="text-xs text-gray-500 mt-1">
            {comment.length} characters (minimum {MIN_COMMENT_LENGTH})
          </p>
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
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
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
  );
}

export default ReviewForm;