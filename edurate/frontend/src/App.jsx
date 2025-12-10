/**
 * App.jsx
 * 
 * Root application component that configures routing for the EduRate application.
 * Uses React Router to handle navigation between the homepage and course details pages.
 * 
 * Routes:
 * - / : Homepage with course listing, search, and filters
 * - /course/:id : Individual course details page with reviews
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CourseDetails from './pages/CourseDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/course/:id" element={<CourseDetails />} />
      </Routes>
    </Router>
  );
}

export default App;