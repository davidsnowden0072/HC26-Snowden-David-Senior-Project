import { describe, it, expect, beforeEach } from 'vitest';
import { Course } from './models/Course';
import { Review } from './models/Review';

describe('Course Model', () => {
  let course;

  beforeEach(() => {
    course = new Course({
      id: 1,
      Course_name: 'Test Course',
      Department: 'CS',
      Course_ID: 101,
      rating: 4.5,
      numReviews: 10
    });
  });

  it('should create a course with correct properties', () => {
    expect(course.id).toBe(1);
    expect(course.name).toBe('Test Course');
    expect(course.rating).toBe(4.5);
  });

  it('should correctly identify if course has reviews', () => {
    expect(course.hasReviews()).toBe(true);
    
    const newCourse = new Course({ id: 2, numReviews: 0 });
    expect(newCourse.hasReviews()).toBe(false);
  });

  it('should display rating correctly', () => {
    expect(course.getRatingDisplay()).toBe('4.5');
    
    const newCourse = new Course({ id: 2, rating: 0 });
    expect(newCourse.getRatingDisplay()).toBe('N/A');
  });
});

describe('Review Model', () => {
  let review;

  beforeEach(() => {
    review = new Review({
      id: 1,
      course_id: 1,
      rating: 5,
      comment: 'Great course!',
      student_name: 'John Doe',
      created_at: '2024-01-01T00:00:00Z'
    });
  });

  it('should create a review with correct properties', () => {
    expect(review.id).toBe(1);
    expect(review.rating).toBe(5);
    expect(review.comment).toBe('Great course!');
  });

  it('should detect anonymous reviews', () => {
    expect(review.isAnonymous()).toBe(false);
    
    const anonReview = new Review({
      id: 2,
      course_id: 1,
      rating: 4,
      comment: 'Good',
      created_at: '2024-01-01'
    });
    expect(anonReview.isAnonymous()).toBe(true);
  });
});