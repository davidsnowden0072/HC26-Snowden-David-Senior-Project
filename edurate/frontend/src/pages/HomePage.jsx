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
        if (result.status === 'success' && result.data) {
          const coursesWithRatings = result.data.map(course => ({
            ...course,
            rating: 0.0,
            numReviews: 0
          }));
          setCourses(coursesWithRatings);
        } else if (result.status === 'failed') {
          throw new Error(result.message || 'Failed to fetch courses');
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