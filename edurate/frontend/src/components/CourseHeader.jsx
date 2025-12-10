/**
 * CourseHeader.jsx
 * 
 * Header component for the course details page.
 * Displays course information including name, department, course ID, and overall rating.
 * Provides navigation back to the main course listing page.
 * 
 * Features:
 * - Back button to return to homepage
 * - Course title and metadata display
 * - Color-coded rating badge showing average rating and review count
 */

import { useNavigate } from 'react-router-dom';
import { getRatingColor } from '../utils/helpers';

function CourseHeader({ course }) {
  const navigate = useNavigate();

  return (
    <div className="bg-blue-900 text-white py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="text-white hover:text-gray-200 mb-4 flex items-center"
        >
          ← Back to Courses
        </button>
        
        {/* Course Info and Rating Badge */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{course.Course_name}</h1>
            <p className="text-blue-200">
              {course.Department} • Course ID: {course.Course_ID}
            </p>
          </div>
          
          {/* Overall Rating Badge */}
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
  );
}

export default CourseHeader;