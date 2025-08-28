import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import morgan from 'morgan';

export function securityMiddleware() {
    return [
        //  Helmet - bảo vệ các HTTP headers
        helmet(),
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                objectSrc: ["'none'"],
                imgSrc: ["'self'", 'data:'],
                styleSrc: ["'self'", "'unsafe-inline'"],
                fontSrc: ["'self'", 'https:', 'data:'],
                baseUri: ["'self'"],
                formAction: ["'self'"],
                frameAncestors: ["'self'"],
                scriptSrcAttr: ["'none'"],
                upgradeInsecureRequests: [],
            },
        }),

        // Xóa các header nhạy cảm
        (req: Request, res: Response, next: NextFunction) => {
            res.removeHeader('X-Powered-By');
            res.setHeader('ETag', '');
            next();
        },

        // Rate limit - giới hạn 100 request mỗi 15 phút/IP
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 1000,
            message: 'Too many requests from this IP. Please try again later!',
            standardHeaders: true,
            legacyHeaders: false,
        }),

        // Slow down - delay sau 50 request
        slowDown({
            windowMs: 15 * 60 * 1000,
            delayAfter: 1000,
            delayMs: 500,
            validate: {
                delayMs: false, 
            },
        }),

        //  Log IP và HTTP method
        morgan(':remote-addr :method :url :status - :response-time ms'),

        // Middleware xử lý lỗi
        (err: any, req: Request, res: Response, next: NextFunction) => {
            console.error('Internal Error:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        },
    ];
}
