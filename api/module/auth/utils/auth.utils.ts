import JWT from 'jsonwebtoken';
import { logger } from '../../../utils/logger';
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id',
};
import * as jwt from 'jsonwebtoken';




export async function createTokenPair(payload: { userId: string; email: string }) {
    const JWT_SECRET = process.env.JWT_SECRET || 'default';
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default_refresh';
    logger.info(`Creating token pair for userId: ${payload.userId}, email: ${payload.email}`);
    logger.info(`JWT_SECRET: ${JWT_SECRET}`);
    try {
        const accessToken = jwt.sign(payload, JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: '1d',
        });

        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
            algorithm: 'HS256',
            expiresIn: '7d',
        });

       
        try {
            const decoded = jwt.verify(accessToken, JWT_SECRET); // sẽ throw nếu hết hạn
            console.log("Token verify:", decoded);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                logger.info("Token đã hết hạn");
            } else {
                logger.info("Token error:", err);
            }
        }


        return {
            accessToken,
            refreshToken,
        };
    } catch (err) {
        console.error('JWT Error:', err);
        throw err;
    }
}






