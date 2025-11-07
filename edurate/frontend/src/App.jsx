import { useEffect, useState } from "react";
import { fetchCourses } from "./api";

function App() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug: Log current state on every render
  console.log('📊 RENDER - courses:', courses);
  console.log('📊 RENDER - courses.length:', courses.length);
  console.log('📊 RENDER - loading:', loading);
  console.log('📊 RENDER - error:', error);

  useEffect(() => {
    async function loadCourses() {
      try {
        const result = await fetchCourses();
        console.log('🔍 Full API response:', result);
        console.log('🔍 result.data:', result.data);
        console.log('🔍 Type of result.data:', typeof result.data);
        console.log('🔍 Is result.data an array?:', Array.isArray(result.data));
        console.log('🔍 result.status:', result.status);
        
        // Check if response has the expected structure
        if (result.status === 'success' && result.data) {
          console.log('✅ Success! Courses:', result.data);
          console.log('✅ Number of courses:', result.data.length);
          setCourses(result.data);
          console.log('✅ setCourses called with:', result.data);
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
        console.log('✅ Loading set to false');
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
          
          {/* Debug Section - Shows raw data */}
          <div style={{ 
            backgroundColor: "#f0f0f0", 
            padding: "1rem", 
            margin: "1rem auto",
            maxWidth: "600px",
            textAlign: "left"
          }}>
            <h3>Debug Info:</h3>
            <p><strong>courses.length:</strong> {courses.length}</p>
            <p><strong>Type:</strong> {typeof courses}</p>
            <p><strong>Is Array:</strong> {Array.isArray(courses).toString()}</p>
            <p><strong>Raw Data:</strong></p>
            <pre style={{ 
              backgroundColor: "white", 
              padding: "0.5rem",
              overflow: "auto",
              textAlign: "left"
            }}>
              {JSON.stringify(courses, null, 2)}
            </pre>
          </div>

          {/* Actual Course List */}
          {courses.length > 0 ? (
            <div>
              <p style={{ color: "green" }}>✅ Found {courses.length} course(s)</p>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {courses.map((course, index) => {
                  console.log(`Rendering course ${index}:`, course);
                  return (
                    <li 
                      key={course.id} 
                      style={{ 
                        margin: "1rem 0",
                        padding: "1rem",
                        backgroundColor: "#e8f4f8",
                        borderRadius: "8px"
                      }}
                    >
                      <strong>Name: {course.name || 'NO NAME'}</strong>
                      <br />
                      {course.professor && <span>Professor: {course.professor}</span>}
                      <br />
                      {course.department && <span>Department: {course.department}</span>}
                      <br />
                      <small>ID: {course.id}</small>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <p style={{ color: "red" }}>
              ❌ No courses found. (Array length: {courses.length})
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;