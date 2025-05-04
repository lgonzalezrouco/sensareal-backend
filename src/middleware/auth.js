const jwt = require('jsonwebtoken');
const db = require('../../models');
const express = require('express');

const { User } = db;
const logger = require('../../config/logger');

/**
 * @function auth
 * @description Middleware to authenticate user using JWT token
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next middleware function
 * @returns {void}
 * @throws {Error} If authentication fails
 */
// eslint-disable-next-line consistent-return
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      logger.error('No token provided in request');
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      logger.error('User not found for token:', { id: decoded.id });
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    logger.error('Authentication error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    res.status(401).json({ message: 'Please authenticate' });
  }
};

/**
 * @function isAdmin
 * @description Checks if the user has admin role
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next middleware function
 * @return {void}
 */
// eslint-disable-next-line consistent-return
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

module.exports = { auth, isAdmin };
