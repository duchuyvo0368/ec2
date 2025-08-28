import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { AuthService } from '../auth.service';

@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private readonly authService: AuthService) { }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
        if (client.data.expireTimer) clearTimeout(client.data.expireTimer);
    }

    @SubscribeMessage('authenticate')
    handleAuth(@ConnectedSocket() client: Socket, payload: { token: string }) {
        try {
            const decoded: any = jwt.verify(payload.token, process.env.JWT_SECRET!);
            client.data.userId = decoded.userId;
            this.setupTokenExpiryTimer(client, payload.token);
            client.emit('authenticated', { userId: decoded.userId });
        } catch {
            client.emit('token_invalid');
        }
    }

    @SubscribeMessage('refresh_token')
    async handleRefresh(@ConnectedSocket() client: Socket, payload: { refreshToken: string }) {
        try {
            if (!payload || !payload.refreshToken) {
                client.emit('refresh_failed', { message: 'Missing refresh token' });
                return;
            }

            const decoded: any = jwt.verify(payload.refreshToken, process.env.JWT_REFRESH_SECRET!);
            const userId: string = decoded.userId;
            const email: string = decoded.email;

            const result = await this.authService.handlerRefreshToken(payload.refreshToken, userId, email);

            const newAccessToken = result.tokens.accessToken;
            const newRefreshToken = result.tokens.refreshToken;

            client.data.userId = userId;
            this.setupTokenExpiryTimer(client, newAccessToken);

            client.emit('token_refreshed', {
                tokens: {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                },
                user: result.result,
            });

            client.emit('authenticated', { userId });
        } catch (err) {
            client.emit('refresh_failed', { message: 'Refresh token invalid or expired' });
        }
    }

    private setupTokenExpiryTimer(client: Socket, token: string) {
        if (client.data.expireTimer) clearTimeout(client.data.expireTimer);

        try {
            const decoded: any = jwt.decode(token);
            if (!decoded || !decoded.exp) {
                client.emit('token_invalid');
                return;
            }

            const timeLeft = decoded.exp * 1000 - Date.now();

            if (timeLeft > 0) {
                client.data.expireTimer = setTimeout(() => {
                    client.emit('token_expired');
                }, timeLeft);
            } else {
                client.emit('token_expired');
            }
        } catch {
            client.emit('token_invalid');
        }
    }
}
