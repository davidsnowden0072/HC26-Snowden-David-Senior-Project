/**
 * ReviewsList.jsx
 * 
 * Container component that displays all reviews for a course.
 * Shows a heading with review count and renders individual ReviewCard components.
 * Handles empty state when no reviews exist, encouraging first review submission.
 * 
 * Props:
 * - reviews: Array of review objects to display
 * - courseId: ID of the course (passed to ReviewCard for voting functionality)
 */

import ReviewCard from './ReviewCard';

function ReviewsList({ reviews, courseId }) {
  return (
    <div>
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
            <ReviewCard 
              key={review.id} 
              review={review} 
              courseId={courseId} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsList;