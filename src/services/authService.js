const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const db = require('../../models');

const { User, Token } = db;
const EmailService = require('../utils/emailService');

class AuthService {
  static generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
  }

  static async generateVerificationToken(userId) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await Token.create({
      userId,
      type: 'email_verification',
      token,
      expiresAt,
    });

    return token;
  }

  static async register(email, password, name) {
    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name,
    });

    const verificationToken = await this.generateVerificationToken(user.id);
    await EmailService.sendVerificationEmail(user.email, verificationToken);

    return { message: 'Registration successful. Please check your email to verify your account.' };
  }

  static async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new Error('Please verify your email before logging in');
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  static async verifyEmail(token) {
    const verificationToken = await Token.findOne({
      where: {
        token,
        type: 'email_verification',
        used: false,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!verificationToken) {
      throw new Error('Invalid or expired verification token');
    }

    await Promise.all([
      User.update(
        { isEmailVerified: true },
        { where: { id: verificationToken.userId } },
      ),
      verificationToken.update({ used: true }),
    ]);

    return { message: 'Email verified successfully' };
  }

  static async resendVerificationEmail(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    if (user.isEmailVerified) {
      throw new Error('Email is already verified');
    }

    const previousToken = await Token.findOne({
      where: {
        userId: user.id,
        type: 'email_verification',
        used: false,
      },
    });

    if (previousToken) {
      await previousToken.destroy();
    }

    const verificationToken = await this.generateVerificationToken(user.id);
    await EmailService.sendVerificationEmail(user.email, verificationToken);

    return { message: 'Verification email sent successfully' };
  }

  static async logout(token) {
    await Token.destroy({ where: { token } });
    return { message: 'Logged out successfully' };
  }
}

module.exports = AuthService;
