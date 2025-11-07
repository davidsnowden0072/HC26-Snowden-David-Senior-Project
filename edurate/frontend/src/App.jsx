import { useEffect, useState } from "react";
import { fetchCourses } from "./api";

function App() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        const result = await fetchCourses();
        console.log('🔍 Full API response:', result);
        console.log('🔍 result.data:', result.data);
        console.log('🔍 Type of result.data:', typeof result.data);
        console.log('🔍 result.status:', result.status);
        
        // Check if response has the expected structure
        if (result.status === 'success' && result.data) {
          console.log('✅ Success! Courses:', result.data);
          console.log('✅ Number of courses:', result.data.length);
          setCourses(result.data);
        } else if (result.status === 'failed') {
          throw new Error(result.message || 'Failed to fetch courses');
        } else {
          console.log('⚠️ Unexpected response structure:', result);
          setCourses([]);
        }
      } catch (err) {
        console.error('❌ Error:', err);
        setError("Failed to fetch courses from backend.");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "10%" }}>
      <h1>Hello EduRate!</h1>
      <p>My course review platform is taking shape 🎓</p>

      {loading && <p>Loading courses...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Available Courses</h2>
          {courses.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {courses.map((course) => (
                <li key={course.id} style={{ margin: "0.5rem 0" }}>
                  <strong>{course.name}</strong>
                  {course.professor && ` - ${course.professor}`}
                  {course.department && ` (${course.department})`}
                </li>
              ))}
            </ul>
          ) : (
            <p>No courses found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;