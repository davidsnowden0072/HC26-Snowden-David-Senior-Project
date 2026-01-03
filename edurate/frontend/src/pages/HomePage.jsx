/**
 * HomePage.jsx
 * 
 * Main landing page component for the EduRate application.
 * Displays the course catalog with search and filter functionality.
 * Fetches all courses from the API and provides interactive controls for browsing.
 * 
 * Features:
 * - Navigation bar with branding
 * - Hero section with search and department filter
 * - Responsive grid of course cards
 * - Real-time filtering based on search term and department
 * - Loading and error state handling
 * route: /
 */

import { useState, useEffect } from 'react';
import { fetchCourses } from '../api';
import { filterCourses, getUniqueDepartments } from '../utils/helpers';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CourseList from '../components/CourseList';

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  async function loadCourses() {
    try {
      const result = await fetchCourses();
      if (result.success && result.data) {
        setCourses(result.data); // ← Just this, no hardcoding!
      } else {
        throw new Error(result.error || 'Failed to fetch courses');
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  loadCourses();
}, []);

  const filteredCourses = filterCourses(courses, searchTerm, selectedDepartment);
  const departments = getUniqueDepartments(courses);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        departments={departments}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CourseList
          courses={filteredCourses}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}

export default HomePage;