import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: {
        message:
            "Too many login attempts from this IP, please try again after a 60 second pause",
    },
    handler: (req, res, next, options) => {
        res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false,
});
