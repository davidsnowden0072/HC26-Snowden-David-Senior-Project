function Hero({ searchTerm, setSearchTerm, selectedDepartment, setSelectedDepartment, departments }) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Title */}
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-2">
          Find Your Perfect Course
        </h2>
        
        {/* Hero Subtitle */}
        <p className="text-gray-600 text-center mb-8">
          Search courses and read reviews from real students
        </p>

        {/* Search Bar and Filters */}
        <div className="flex flex-wrap gap-4 max-w-4xl mx-auto">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by course name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[300px] px-4 py-3 text-base border-2 border-gray-200 rounded-lg outline-none focus:border-blue-900 transition-colors"
          />
          
          {/* Department Dropdown Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-3 text-base border-2 border-gray-200 rounded-lg bg-white cursor-pointer outline-none focus:border-blue-900 min-w-[150px] transition-colors"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default Hero;