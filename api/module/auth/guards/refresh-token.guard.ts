import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthRequest } from '../interfaces/auth-request.interface';
import { logger } from 'utils/logger';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<AuthRequest>();
        const refreshToken = request.headers['x-refresh-token'] as string;

        if (!refreshToken) {
            throw new UnauthorizedException('No refresh token provided');
        }

        logger.info('JWT_REFRESH_SECRET:', refreshToken)

        try {
            const refreshSecret = process.env.JWT_REFRESH_SECRET || 'default_refresh';
            const decoded = jwt.verify(refreshToken, refreshSecret);
            request.user = decoded as any;
            request.refreshToken = refreshToken;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }
}
