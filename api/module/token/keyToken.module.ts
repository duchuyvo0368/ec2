
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KeyTokenService } from './keyToken.service';
import { KeyToken, TokenSchema } from './keyToken.model';

@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: KeyToken.name, schema: TokenSchema }],
            'MONGODB_CONNECTION',
        ),
    ],
    providers: [KeyTokenService],
    exports: [KeyTokenService],
})
export class KeyTokenModule { }