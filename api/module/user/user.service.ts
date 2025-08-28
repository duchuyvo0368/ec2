import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.model';
import { getInfoData } from '../../utils/index';
import * as bcrypt from 'bcrypt';
import { BadRequestError } from '../../utils/error.response';
import { InjectModel } from '@nestjs/mongoose';
import { logger } from '../../utils/logger';
import { UserDto } from './user.dto';
import { FriendService } from '../firends/friends.service';
import { UploadService } from 'module/upload/upload.service';
import { SuccessResponse } from 'utils/success.response';
import { FriendRelation, FriendRelationDocument } from 'module/firends/friend.model';
import { UserRepository } from './user.repository';

const meFields = ['_id', 'name', 'email', 'bio', 'avatar', 'phone', 'birthday'];
const friendFields = ['_id', 'name', 'email', 'bio', 'avatar'];
const strangerFields = ['_id', 'name', 'avatar'];

@Injectable()
export class UserService {
     constructor(
          @InjectModel(User.name, 'MONGODB_CONNECTION')
          private readonly userModel: Model<UserDocument>,
          @Inject(forwardRef(() => FriendService))
          private readonly friendService: FriendService,
          @Inject(forwardRef(() => UploadService))
          private readonly uploadService: UploadService,
          @InjectModel(FriendRelation.name, 'MONGODB_CONNECTION')
          private readonly friendRelationModel: Model<FriendRelationDocument>,
          private readonly userRepository: UserRepository,
     ) { }

     findByEmail = async (
          {
               email,
               select = {
                    email: 1,
                    password: 1,
                    name: 1,
                    bio: 1,
                    avatar: 1,
               },
          }: { email: string; select?: any } = { email: '', select: {} },
     ): Promise<any | null> => {
          const user = await this.userModel.findOne({ email }).select(select).lean();
          return user;
     };

     findUserById = async (userId: string): Promise<any | null> => {
          return this.userModel.findById(userId).select('name avatar').lean();
     };
     async findByIds(ids: string[]) {
          return this.userModel
               .find({ _id: { $in: ids } })
               .select('_id name avatar')
               .lean();
     }

     createUser = async (body: UserDto) => {
          const { name, email, password, avatar, bio } = body;

          if (!name || !email || !password || !avatar) {
               throw new BadRequestError('Missing required fields');
          }

          const existingUser = await this.findByEmail({ email });
          if (existingUser) {
               throw new BadRequestError('Error: User already exists!');
          }

          const passwordHash = await bcrypt.hash(password, 10);
          const newUser = await this.userModel.create({
               name,
               email,
               password: passwordHash,
               avatar,
               bio,
               createdAt: new Date(),
               updatedAt: new Date(),
          });

          if (newUser) {
               return {
                    data: {
                         shop: getInfoData({
                              fields: ['_id', 'name', 'email'],
                              objects: newUser,
                         }),
                    },
               };
          }

          return {
               code: '200',
               metadata: null,
          };
     };

     updateUser = async (id: string, userData: UserDto): Promise<any | null> => {
          return this.userModel
               .findByIdAndUpdate(
                    id,
                    { ...userData, updatedAt: new Date() },
                    { new: true, runValidators: true },
               )
               .lean();
     };

     deleteUser = async (id: string): Promise<boolean> => {
          const result = await this.userModel.findByIdAndDelete(id);
          return !!result;
     };

     async buildResponse(relation: string, id: string, userId: string, user: any) {
          const [countFriends, followersCount, followingCount, isFollowing] = await Promise.all([
               this.friendService.countFriends(id),
               this.friendService.countFollowers(id),
               this.friendService.countFollowing(id),
               this.friendService.isFollowing(userId, id),
          ]);

          const { password, email, ...filteredUser } = user;

          return {
               user: filteredUser,
               relation,
               countFriends,
               followersCount,
               followingCount,
               isFollowing,
          };
     };


     async getProfile(userId: string, id: string) {
          const user = await this.userModel.findById({ _id: id }).lean();
          if (!user) throw new NotFoundException('User not found');

          if (userId === id) {
               return this.buildResponse('me', id, userId, user);
          }

          const friend = await this.friendService.findAnyRelationBetweenUsers(userId, id);

          if (!friend) {
               return this.buildResponse('stranger', id, userId, user);
          }

          if (friend.type === 'accepted') {
               return this.buildResponse('accepted', id, userId, user);
          }

          if (friend.type === 'pending') {
               if (friend.fromUser.toString() === userId) {
                    return this.buildResponse('pending_sent', id, userId, user);
               }
               if (friend.toUser.toString() === userId) {
                    return this.buildResponse('pending_received', id, userId, user);
               }
          }



          return this.buildResponse('stranger', id, userId, user);
     }



     async editProfile(userId: string, body: UserDto): Promise<UserDocument | null> {
          const result = await this.userModel.findByIdAndUpdate(
               userId,
               body,
               { new: true }
          );

          return result;
     }

     async updateAvatar(userId: string, type: string, file: Express.Multer.File) {
          const result = await this.uploadService.handleUpload(file, type);

          const avatarUrl = result?.metadata?.url;

          if (!avatarUrl) {
               throw new Error('Không lấy được URL ảnh từ kết quả upload');
          }

          await this.userModel.findByIdAndUpdate(
               userId,
               { avatar: avatarUrl },
               { new: true }
          );

          return new SuccessResponse({
               message: 'Avatar upload successfully',
               metadata: avatarUrl,
          });
     }


     async getAllUsers(userId: string, limit: number, page: number) {
          const skip = (page - 1) * limit;

          const objectIdList = await this.friendService.getRelatedUserIds(userId);
          const excludedObjectIds = objectIdList.map(id => new Types.ObjectId(id));
          logger.info(`Excluded object IDs: ${JSON.stringify(excludedObjectIds)}`);
          const aggResult = await this.userRepository.aggregateExcludeUsers(excludedObjectIds, limit, page, skip);

          const users = aggResult[0]?.data || [];
          const totalItems = aggResult[0]?.total[0]?.count || 0;
          const totalPages = Math.ceil((totalItems || 1) / limit);

          const followingRelations = await this.friendService.getFollowingRelations(userId, limit * page);
          const followedIds = new Set(
               followingRelations.map((rel) => {
                    if (typeof rel.toUser === 'string') return rel.toUser;
                    if (rel.toUser?._id) return rel.toUser._id.toString();
                    if (rel.toUser?.toString) return rel.toUser.toString();
                    return '';
               }).filter(id => id)
          );

          const usersList = await Promise.all(
               users.map(async (userItem: any) => {
                    const friendId = userItem._id?.toString();
                    if (!friendId) return null;

                    const [followersCount, followingCount] = await Promise.all([
                         this.friendService.countFollowers(friendId),
                         this.friendService.countFollowing(friendId),
                    ]);

                    return {
                         ...userItem,
                         isFollowing: followedIds.has(friendId),
                         followersCount,
                         followingCount,
                    };
               }),
          );


          const filteredUsers = usersList.filter(Boolean);

          return {
               data: filteredUsers,
               pagination: {
                    page,
                    limit,
                    totalItems,
                    totalPages,
               },
          };
     }

     async searchUsers(userId: string, query: string, limit = 10, page = 1) {
          if (!Types.ObjectId.isValid(userId)) {
               throw new BadRequestException('Invalid userId');
          }

          const relations = await this.friendRelationModel
               .find({
                    type: 'accepted',
                    $or: [{ fromUser: userId }, { toUser: userId }],
               })
               .populate('fromUser', 'name avatar email')
               .populate('toUser', 'name avatar email')
               .limit(limit)
               .lean();

          const friends = relations.map(rel => {
               const from = rel.fromUser as any;
               const to = rel.toUser as any;
               if (!from || !to) return null;

               return from._id.toString() === userId ? to : from;
          }).filter(Boolean);

          const lowerQuery = query.toLowerCase();
          const filtered = friends.filter(user => {
               const text = `${user.name} ${user.avatar} ${user.email}`.toLowerCase();
               return text.includes(lowerQuery);
          });

          return filtered.slice(0, 10);
     }



     async updateFcmToken(userId: string, fcmToken: string): Promise<UserDocument | null> {
          if (!fcmToken) {
               throw new BadRequestException('FCM token is required');
          }

          const user = await this.userModel.findByIdAndUpdate(
               userId,
               { fcm_token: fcmToken },
               { new: true, runValidators: true },
          );

          if (!user) {
               throw new NotFoundException('User not found');
          }

          return user;
     }


}
