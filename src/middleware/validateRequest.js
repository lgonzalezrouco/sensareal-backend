const { validationResult } = require('express-validator');

// eslint-disable-next-line consistent-return
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
    }));

    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  next();
};

module.exports = validateRequest;
