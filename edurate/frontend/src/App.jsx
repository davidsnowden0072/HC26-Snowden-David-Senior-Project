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
        
        if (result.status === 'success' && result.data) {
          setCourses(result.data);
        } else if (result.status === 'failed') {
          throw new Error(result.message || 'Failed to fetch courses');
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
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
            <ul style={{ 
              listStyle: "none", 
              padding: 0,
              maxWidth: "600px",
              margin: "0 auto"
            }}>
              {courses.map((course) => (
                <li 
                  key={course.id} 
                  style={{ 
                    margin: "1rem 0",
                    padding: "1.5rem",
                    backgroundColor: "#f0f8ff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    textAlign: "left"
                  }}
                >
                  <h3 style={{ margin: "0 0 0.5rem 0", color: "#2c3e50" }}>
                    {course.Course_name}
                  </h3>
                  <p style={{ margin: "0.25rem 0", color: "#555" }}>
                    <strong>Department:</strong> {course.Department}
                  </p>
                  <p style={{ margin: "0.25rem 0", color: "#555" }}>
                    <strong>Course ID:</strong> {course.Course_ID}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No courses available yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;