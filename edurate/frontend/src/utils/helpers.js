/**
 * helpers.js
 * 
 * Utility functions for course filtering, searching, and rating display.
 * Uses constants from constants.js for consistent values across the app.
 */

import { RATING_GREAT, RATING_GOOD, COLORS } from '../constants';

/**
 * Determine rating badge color based on score
 * @param {number} rating - Course rating (0-5)
 * @returns {string} Tailwind CSS color class
 */
export const getRatingColor = (rating) => {
  if (rating >= RATING_GREAT) return COLORS.GREAT;
  if (rating >= RATING_GOOD) return COLORS.GOOD;
  if (rating > 0) return COLORS.OKAY;
  return COLORS.NONE;
};

/**
 * Filter courses based on search term and department
 * @param {Array} courses - Array of course objects
 * @param {string} searchTerm - Search query for course name or ID
 * @param {string} selectedDepartment - Department filter ('All' or department name)
 * @returns {Array} Filtered array of courses
 */
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

/**
 * Extract unique departments from courses array
 * @param {Array} courses - Array of course objects
 * @returns {Array} Array of unique department names with 'All' prepended
 */
export const getUniqueDepartments = (courses) => {
  return ['All', ...new Set(courses.map(c => c.Department))];
};