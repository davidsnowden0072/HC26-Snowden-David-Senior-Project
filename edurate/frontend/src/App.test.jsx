/**
 * App.test.jsx
 * 
 * Tests for the HomePage component to ensure core functionality works.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';

// Mock the API
vi.mock('./api', () => ({
  fetchCourses: vi.fn(() => 
    Promise.resolve({
      status: 'success',
      data: [
        {
          id: 1,
          Course_name: 'Test Course',
          Department: 'CS',
          Course_ID: 101,
          rating: 4.5,
          numReviews: 10
        }
      ]
    })
  )
}));

describe('HomePage Component', () => {
  it('renders EduRate branding', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Check that the EduRate brand name appears
    expect(screen.getByText('EduRate')).toBeInTheDocument();
  });

  it('renders hero section with search functionality', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Check that main hero text appears
    expect(screen.getByText('Find Your Perfect Course')).toBeInTheDocument();
    
    // Check that search input exists
    expect(screen.getByPlaceholderText(/Search by course name or ID/i)).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Check navigation buttons exist
    expect(screen.getByText('Courses')).toBeInTheDocument();
    expect(screen.getByText('Professors')).toBeInTheDocument();
  });
});