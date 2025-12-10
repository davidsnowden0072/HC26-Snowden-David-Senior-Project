/**
 * errorHandler.js
 * 
 * Global error handling middleware for catching unhandled errors.
 */

import { HTTP_STATUS } from '../constants.js';

export const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error("💥 Unhandled error:", err);
  
  res.status(err.status || HTTP_STATUS.SERVER_ERROR).json({
    success: false,
    error: err.message || "Internal server error"
  });
};