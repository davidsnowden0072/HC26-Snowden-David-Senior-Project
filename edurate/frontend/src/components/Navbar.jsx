/**
 * Navbar.jsx
 * 
 * Top navigation bar component for the application.
 * Displays the EduRate branding and navigation links for main sections.
 * Features a navy blue background consistent with the application theme.
 * 
 * Currently includes:
 * - EduRate logo/brand name
 * - Courses navigation button (active)
 * - Professors navigation button (inactive/placeholder)
 */

function Navbar() {
  return (
    <nav className="bg-blue-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <h1 className="text-white text-2xl font-bold">
            EduRate
          </h1>
          
          {/* Navigation Links */}
          <div className="flex gap-4">
            <button className="text-white hover:text-gray-200 px-4 py-2 font-medium transition-colors">
              Courses
            </button>
            <button className="text-white hover:text-gray-200 px-4 py-2 font-medium opacity-50 transition-colors">
              Professors
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;