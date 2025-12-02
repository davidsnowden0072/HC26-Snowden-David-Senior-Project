import { getRatingColor } from '../utils/helpers';

function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      {/* Card Header - Course Info and Rating */}
      <div className="flex justify-between items-start mb-4">
        {/* Course Details */}
        <div className="flex-1">
          {/* Course Name */}
          <h4 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
            {course.Course_name}
          </h4>
          
          {/* Department */}
          <p className="text-gray-600 text-sm mb-1">
            <strong>Department:</strong> {course.Department}
          </p>
          
          {/* Course ID */}
          <p className="text-gray-600 text-sm">
            <strong>Course ID:</strong> {course.Course_ID}
          </p>
        </div>

        {/* Rating Badge */}
        <div className={`${getRatingColor(course.rating)} text-white w-16 h-16 rounded-lg flex flex-col items-center justify-center flex-shrink-0 ml-4`}>
          {/* Rating Number */}
          <div className="text-2xl font-bold leading-none">
            {course.rating === 0 ? 'N/A' : course.rating.toFixed(1)}
          </div>
          {/* Rating Scale */}
          {course.rating > 0 && (
            <div className="text-[10px] mt-0.5">
              / 5.0
            </div>
          )}
        </div>
      </div>

      {/* Card Footer - Reviews Count and Action Link */}
      <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
        {/* Reviews Count */}
        <span className="text-gray-600 text-sm">
          {course.numReviews === 0 ? 'No reviews yet' : `${course.numReviews} reviews`}
        </span>
        
        {/* View Details Link */}
        <span className="text-blue-900 text-sm font-semibold hover:text-blue-700 transition-colors">
          View Details →
        </span>
      </div>
    </div>
  );
}

export default CourseCard;