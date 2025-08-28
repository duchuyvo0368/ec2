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
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthRequest>();
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No access token provided');
        }

        const token = authHeader.split(' ')[1];


        try {
            const secret = process.env.JWT_SECRET || 'default';
            const decoded: any = jwt.verify(token, secret);
            request.user = decoded;
            logger.info(`Decoded access token: ${JSON.stringify(decoded)}`);
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired access token');
        }
    }
}

