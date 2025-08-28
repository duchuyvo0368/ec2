import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../user/user.model";
import { Model } from "mongoose";
import { AuthFailureError, BadRequestError, FORBIDDEN } from "../../utils/error.response";
import { logger } from "../../utils/logger";
import * as bcrypt from 'bcrypt';
import { createTokenPair } from "./utils/auth.utils";
import { getInfoData } from "../../utils/index";
import { Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { KeyTokenService } from '../token/keyToken.service';

@Injectable()
export class AuthService {
     constructor(
          @InjectModel(User.name, 'MONGODB_CONNECTION') private readonly userModel: Model<UserDocument>,
          private readonly keyTokenService: KeyTokenService
     ) { }
     findByEmail = async ({ email, select = {
          email: 1,
          password: 1,
          name: 1,
          bio: 1,
          avatar: 1
     } }: { email: string; select?: any } = { email: '', select: {} }): Promise<any | null> => {
          const user = await this.userModel.findOne({ email }).select(select).lean();
          return user;
     };

     register = async (body: RegisterDto) => {
          const { name, email, password } = body;
          console.log(`${password}`);

          const existingUser = await this.findByEmail({ email });
          if (existingUser) {
               throw new BadRequestError('Error: User already exists!');
          }

          const passwordHash = await bcrypt.hash(password, 10);
          const newUser = await this.userModel.create({
               name,
               email,
               password: passwordHash,
               avatar: 'https://hoseiki.vn/wp-content/uploads/2025/03/avatar-mac-dinh-3.jpg', // Default avatar URL
               bio: null,
               createdAt: new Date(),
               updatedAt: new Date()
          });
          if (newUser) {
               const userId = newUser._id as string;
               const tokens = await createTokenPair({ userId, email });
               const keyStore = await this.keyTokenService.createKeyToken(userId, tokens.refreshToken);
               logger.info(`Created Token Success:: ${JSON.stringify(tokens)}`);
               logger.info(`Created KeyStore Success::${keyStore}`);
               if (!keyStore) {
                    throw new BadRequestError('Error: Shop already exists !');
               }

               return {
                    user: getInfoData({
                         fields: ['_id', 'name', 'email'],
                         objects: newUser,
                    }),
                    tokens,

               };
          }
          return {
               code: '200',
               metadata: null,
          };

     }
     loginUser = async ({ email, password }: { email: string; password: string }) => {
          const user = await this.findByEmail({ email });
          if (!user) {
               throw new BadRequestError('Incorrect email or password !');
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
               throw new AuthFailureError('Invalid password!');
          }

          const userId = user._id as string;
          const tokens = await createTokenPair({ userId, email });
          logger.info(`login_tokens::${JSON.stringify(tokens)}`);
          await this.keyTokenService.createKeyToken(userId, tokens.refreshToken);
          return {
               user: getInfoData({
                    fields: ['_id', 'name', 'email', 'avatar'],
                    objects: user,
               }),
               tokens,
          };
     }

     logout = async (userId: string): Promise<{ message: string; metadata: any }> => {
          const result = await this.keyTokenService.removeByUserId(userId);
          if (!result) {
               throw new AuthFailureError('Logout failed');
          }
          return {
               message: 'Logout successful',
               metadata: result,
          };
     }


     handlerRefreshToken = async (refreshToken: string, userId: string, email: string) => {

          const stored = await this.keyTokenService.findOneRefreshToken(refreshToken);
          if (!stored) {
               throw new AuthFailureError('Refresh token has been revoked');
          }
          logger.info(`stored.refreshToken ${stored.refreshToken} refreshToken:${refreshToken}`)
          if (stored.refreshToken !== refreshToken) {
               throw new FORBIDDEN('Invalid refresh token');
          }
          const tokens = await createTokenPair({ userId, email });
          logger.info(`token ${JSON.stringify(tokens)}`)
          const result = await this.keyTokenService.updateToken(
               userId,
               tokens.refreshToken,
          );
          logger.info(`token ${JSON.stringify(result)}`)
          const user = await this.userModel.findById(userId).select('name email avatar').lean();
          if (!user) {
               throw new BadRequestError('User not found');
          }
          return {
               result: { _id: userId, email, name: user.name, avatar: user.avatar },
               tokens,
          };

     };

}