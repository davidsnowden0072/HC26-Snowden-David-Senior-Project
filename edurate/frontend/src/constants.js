/**
 * constants.js
 * 
 * Application-wide constants and configuration values.
 */

// Rating scale
export const MIN_RATING = 1;
export const MAX_RATING = 5;

// Review validation
export const MIN_COMMENT_LENGTH = 10; // Minimum characters for a review comment

// UI timing
export const SUCCESS_MESSAGE_DURATION = 3000; // 3 seconds in milliseconds

// Rating color thresholds
export const RATING_GREAT = 4.0;
export const RATING_GOOD = 3.0;

// Rating colors (Tailwind classes)
export const COLORS = {
  GREAT: 'bg-red-600',
  GOOD: 'bg-orange-500',
  OKAY: 'bg-gray-600',
  NONE: 'bg-gray-400'
};