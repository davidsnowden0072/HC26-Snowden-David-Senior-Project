import CourseCard from './CourseCard';

function CourseList({ courses, loading, error }) {
  // Loading State
  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 text-lg">Loading courses...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  // Empty State
  if (courses.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
        <p className="text-gray-600 text-lg mb-2">
          No courses found matching your search.
        </p>
        <p className="text-gray-400 text-sm">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  // Course Cards Grid
  return (
    <>
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          Available Courses
        </h3>
        <p className="text-gray-600 text-sm">
          {courses.length} course{courses.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Grid of Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </>
  );
}

export default CourseList;