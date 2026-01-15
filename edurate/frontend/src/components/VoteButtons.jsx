/**
 * VoteButtons.jsx
 * 
 * Yik Yak-style upvote/downvote buttons for reviews.
 * Displays vertical thumbs up/down with vote score in between.
 * Uses localStorage to track user votes and prevent duplicates.
 */

import { useState, useEffect } from 'react';

function VoteButtons({ reviewId, courseId, initialUpvotes = 0, initialDownvotes = 0, onVote }) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState(null); // 'up', 'down', or null

  // Load user's vote from localStorage on mount
  useEffect(() => {
    const savedVote = localStorage.getItem(`vote_${reviewId}`);
    if (savedVote) {
      setUserVote(savedVote);
    }
  }, [reviewId]);

  // Calculate net score (upvotes - downvotes)
  const score = upvotes - downvotes;

  const handleUpvote = async () => {
    if (userVote === 'up') {
      // Already upvoted - do nothing
      return;
    }

    if (userVote === 'down') {
      // Switching from downvote to upvote
      setDownvotes(downvotes - 1);
      setUpvotes(upvotes + 1);
      setUserVote('up');
      localStorage.setItem(`vote_${reviewId}`, 'up');
      await onVote('up');
    } else {
      // New upvote
      setUpvotes(upvotes + 1);
      setUserVote('up');
      localStorage.setItem(`vote_${reviewId}`, 'up');
      await onVote('up');
    }
  };

  const handleDownvote = async () => {
    if (userVote === 'down') {
      // Already downvoted - do nothing
      return;
    }

    if (userVote === 'up') {
      // Switching from upvote to downvote
      setUpvotes(upvotes - 1);
      setDownvotes(downvotes + 1);
      setUserVote('down');
      localStorage.setItem(`vote_${reviewId}`, 'down');
      await onVote('down');
    } else {
      // New downvote
      setDownvotes(downvotes + 1);
      setUserVote('down');
      localStorage.setItem(`vote_${reviewId}`, 'down');
      await onVote('down');
    }
  };

  return (
    <div className="flex flex-col items-center gap-1 mr-4">
      {/* Thumbs Up Button */}
      <button
        onClick={handleUpvote}
        className={`transition-colors ${
          userVote === 'up'
            ? 'text-green-600'
            : 'text-gray-400 hover:text-green-600'
        }`}
        aria-label="Thumbs up"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
        </svg>
      </button>

      {/* Score */}
      <span
        className={`text-sm font-semibold ${
          score > 0
            ? 'text-green-600'
            : score < 0
            ? 'text-red-600'
            : 'text-gray-600'
        }`}
      >
        {score}
      </span>

      {/* Thumbs Down Button */}
      <button
        onClick={handleDownvote}
        className={`transition-colors ${
          userVote === 'down'
            ? 'text-red-600'
            : 'text-gray-400 hover:text-red-600'
        }`}
        aria-label="Thumbs down"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
        </svg>
      </button>
    </div>
  );
}

export default VoteButtons;