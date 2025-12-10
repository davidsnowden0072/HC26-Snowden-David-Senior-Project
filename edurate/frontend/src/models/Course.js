/**
 * Course.js
 * 
 * Data model for Course objects.
 */
export class Course {
  constructor(data) {
    this.id = data.id;
    this.name = data.Course_name;
    this.department = data.Department;
    this.courseId = data.Course_ID;
    this.rating = data.rating || 0;
    this.numReviews = data.numReviews || 0;
    this.createdAt = data.created_at;
  }

  hasReviews() {
    return this.numReviews > 0;
  }

  getRatingDisplay() {
    return this.rating === 0 ? 'N/A' : this.rating.toFixed(1);
  }
}