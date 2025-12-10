/**
 * Review.js
 * 
 * Data model for Review objects.
 */
export class Review {
  constructor(data) {
    this.id = data.id;
    this.courseId = data.course_id;
    this.rating = data.rating;
    this.comment = data.comment;
    this.studentName = data.student_name || 'Anonymous';
    this.createdAt = new Date(data.created_at);
  }

  getFormattedDate() {
    return this.createdAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  isAnonymous() {
    return this.studentName === 'Anonymous';
  }
}