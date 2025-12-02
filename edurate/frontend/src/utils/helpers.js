// Helper function to determine rating badge color based on score
export const getRatingColor = (rating) => {
  if (rating >= 4.0) return 'bg-red-600';      // Red for great ratings
  if (rating >= 3.0) return 'bg-orange-500';   // Orange for good ratings
  if (rating > 0) return 'bg-gray-600';        // Gray for okay ratings
  return 'bg-gray-400';                        // Light gray for no rating
};

// Filter courses based on search term and department
export const filterCourses = (courses, searchTerm, selectedDepartment) => {
  return courses.filter(course => {
    const matchesSearch = 
      course.Course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.Course_ID.toString().includes(searchTerm);
    
    const matchesDepartment = 
      selectedDepartment === 'All' || 
      course.Department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });
};

// Extract unique departments from courses
export const getUniqueDepartments = (courses) => {
  return ['All', ...new Set(courses.map(c => c.Department))];
};