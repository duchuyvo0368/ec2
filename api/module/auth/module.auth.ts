import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../user/user.model'; 
import { KeyTokenModule } from '../token/keyToken.module';
import { UserModule } from 'module/user/user.module';
import { AuthGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { AppGateway } from './utils/auth.gateway';

@Module({
    imports: [
        forwardRef(() => UserModule),
        MongooseModule.forFeature(
            [{ name: User.name, schema: UserSchema }],
            'MONGODB_CONNECTION',
        ),
        JwtModule.register({}),
        KeyTokenModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthGuard, RefreshTokenGuard, AppGateway],
    exports: [
        AuthGuard,
        RefreshTokenGuard,
        AuthService,
        MongooseModule,
    ],
})
export class AuthModule { }
