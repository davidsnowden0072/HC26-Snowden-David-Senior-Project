/**
 * ReviewCard.jsx
 * 
 * Individual review display component for course reviews.
 * Shows student name (or Anonymous), submission date, star rating, and review text.
 * Presents information in a clean card layout with visual star rating display.
 * 
 * Props:
 * - review: Object containing review data (student_name, created_at, rating, comment)
 */

function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Review Header - Name, Date, Rating */}
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
        
        {/* Star Rating Display */}
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
  );
}

export default ReviewCard;