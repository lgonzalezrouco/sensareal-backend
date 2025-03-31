const AuthService = require('../services/authService');
const logger = require('../../config/logger');

const authController = {
  async register(req, res) {
    try {
      const { email, password, name } = req.body;
      const result = await AuthService.register(email, password, name);
      res.status(201).json(result);
    } catch (error) {
      logger.error(`Registration error: ${error.message}`);
      res.status(error.message === 'User already exists' ? 400 : 500)
        .json({ message: error.message || 'An error occurred during registration' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      res.status(error.message.includes('Invalid credentials') ? 401 : 500)
        .json({ message: error.message || 'An error occurred during login' });
    }
  },

  async verifyEmail(req, res) {
    try {
      const { token } = req.body;
      const result = await AuthService.verifyEmail(token);
      res.json(result);
    } catch (error) {
      logger.error(`Email verification error: ${error.message}`);
      res.status(error.message.includes('Invalid') ? 400 : 500)
        .json({ message: error.message || 'An error occurred during email verification' });
    }
  },

  async resendVerificationEmail(req, res) {
    try {
      const { email } = req.body;
      const result = await AuthService.resendVerificationEmail(email);
      res.json(result);
    } catch (error) {
      logger.error(`Resend verification email error: ${error.message}`);
      res.status(error.message === 'User not found' ? 404 : 500)
        .json({ message: error.message || 'An error occurred while resending verification email' });
    }
  }
};

module.exports = authController; 