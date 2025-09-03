const { z } = require('zod');

exports.validateSearch = (req, res, next) => {
  const schema = z.object({
    origin: z.string().min(3),
    destination: z.string().min(3),
    departDate: z.string(),
    returnDate: z.string().optional(),
    passengers: z.number().int().min(1),
  });

  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  next();
};