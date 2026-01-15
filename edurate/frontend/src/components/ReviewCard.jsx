/**
 * ReviewCard.jsx
 * 
 * Individual review display component for course reviews.
 * Shows student name (or Anonymous), submission date, star rating, review text,
 * and Yik Yak-style upvote/downvote buttons.
 * 
 * Props:
 * - review: Object containing review data (student_name, created_at, rating, comment, upvotes, downvotes)
 * - courseId: ID of the course (needed for vote API calls)
 */

import { upvoteReview, downvoteReview } from '../api';
import VoteButtons from './VoteButtons';

function ReviewCard({ review, courseId }) {
  const handleVote = async (voteType) => {
    try {
      if (voteType === 'up') {
        await upvoteReview(courseId, review.id);
      } else {
        await downvoteReview(courseId, review.id);
      }
      console.log(`✅ ${voteType === 'up' ? 'Upvoted' : 'Downvoted'} review`);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex">
        {/* Vote Buttons - Left Side */}
        <VoteButtons
          reviewId={review.id}
          courseId={courseId}
          initialUpvotes={review.upvotes || 0}
          initialDownvotes={review.downvotes || 0}
          onVote={handleVote}
        />

        {/* Review Content - Right Side */}
        <div className="flex-1">
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
      </div>
    </div>
  );
}

export default ReviewCard;