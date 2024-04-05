const Joi = require('joi');

const reportQuerySchema = Joi.object({
  reportType: Joi.string().valid('totalMilesDriven').required(),
  frequency: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').required(),
  startDate: Joi.date().iso().required().custom((value, helpers) => {
    // Check if the date format is incorrect
    if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) {
      return helpers.message('Invalid date format for startDate. Use DD-MM-YYYY format.');
    }
    // Convert the date format to YYYY-MM-DD for ISO compatibility
    const [day, month, year] = value.split('-');
    const isoDate = `${year}-${month}-${day}`;
    return isoDate;
  }),
  endDate: Joi.date().iso().required().custom((value, helpers) => {
    // Check if the date format is incorrect
    if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) {
      return helpers.message('Invalid date format for endDate. Use DD-MM-YYYY format.');
    }
    // Convert the date format to YYYY-MM-DD for ISO compatibility
    const [day, month, year] = value.split('-');
    const isoDate = `${year}-${month}-${day}`;
    return isoDate;
  }),
  type: Joi.string().optional(),
  make: Joi.string().optional()
});

const validateRequest = (req, res, next) => {
  const { error } = reportQuerySchema.validate(req.query);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = { validateRequest };
