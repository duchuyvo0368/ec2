import { SuccessResponse } from './../../utils/success.response';

import {
     Injectable,
     BadRequestException,
     NotFoundException,
     ForbiddenException,
     ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
     BadRequestError,
     FORBIDDEN,
     NotFoundError,
} from '../../utils/error.response';
import { convertToObject, getInfoData } from '../../utils/index';
import { logger } from '../../utils/logger';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { filter } from 'lodash';
import { from } from 'rxjs';
import { FriendRepository } from './friend.repository';
import { NotificationsService } from 'module/notification/notification.service';
import { UserService } from 'module/user/user.service';
import { FirebaseAdminService } from 'module/fcm/firebase-admin.service';
@Injectable()
export class FriendService {
     constructor(
          private readonly friendRepository: FriendRepository,
          private readonly notificationService: NotificationsService,
          private readonly firebaseAdminService: FirebaseAdminService,
           private readonly userService:UserService
     ) { }

     async friendRequest(fromUser: string, toUser: string) {
          if (fromUser === toUser) {
               throw new BadRequestException(
                    'You cannot send a friend request to yourself',
               );
          }

          const existing = await this.friendRepository.findOutgoingFriendRequest(
               fromUser,
               toUser,
          );

          if (existing?.type === 'pending') {
               throw new BadRequestException('Friend request already sent');
          }

          if (existing?.type === 'accepted') {
               throw new BadRequestException('You are already friends');
          }
          if (existing?.type === 'follow') {
               throw new BadRequestException('You are already friends');
          }

          // Get user information first
          // const [sender, receiver] = await Promise.all([
          //   this.userService.findUserById(fromUser),
          //   this.userService.findUserById(toUser),
          // ]);

          // if (!sender || !receiver) {
          //   throw new NotFoundException('One or both users not found');
          // }

          const created = await this.friendRepository.createRelation(
               fromUser,
               toUser,
          );
          logger.info(`Created request: ${JSON.stringify(created)}`);

          const fcmInfo = await this.firebaseAdminService.getUserFcmInfo(toUser);
          console.log("fcmInfo", fcmInfo);
          //find user avavtar name 
          const fromUserInfo = await this.userService.findUserById(fromUser);
          console.log("fromUserInfo", fromUserInfo);
          //Send notification
          await this.notificationService.pushNotification(
               fromUser,
               toUser,
               'friend_request',
               {
                    senderName: fromUserInfo?.name || "",
                    fcmToken: fcmInfo?.fcm_token || "",
                    image: fromUserInfo?.avatar || "",
               },
          );
          return {
               message: 'Friend request sent',
               data: created,
          };
     }

     async acceptRequest(fromUser: string, toUser: string) {
          const request = await this.friendRepository.findIncomingPendingRequest(
               fromUser,
               toUser,
          );

          if (!request) {
               throw new BadRequestException('Friend request not found');
          }

          if (request.type !== 'pending') {
               throw new BadRequestException('Cannot accept non-pending request');
          }

          if (fromUser !== request.toUser.toString()) {
               throw new ForbiddenException('Not authorized to accept this request');
          }

          const updated = await this.friendRepository.updateRequestToAccepted(
               request.id,
          );
          logger.info(`Updated request: ${JSON.stringify(updated)}`);
          const fcmInfo = await this.firebaseAdminService.getUserFcmInfo(toUser);
          console.log("fcmInfo", fcmInfo);
          const fromUserInfo = await this.userService.findUserById(fromUser);
          console.log("fromUserInfo", fromUserInfo);
          await this.notificationService.pushNotification(
               fromUser,
               toUser,
               'friend_accept',
                    {
                         senderName: fromUserInfo?.name || "",
                         fcmToken: fcmInfo?.fcm_token || "",
                         image: fromUserInfo?.avatar|| "",
                    },
          );
          return {
               message: 'Friend request accepted',
               data: {
                    fromUser,
                    toUser,
                    type: 'accepted',
               },
          };
     }

     async rejectRequest(fromUser: string, toUser: string) {
          const request = await this.friendRepository.findIncomingPendingRequest(
               fromUser,
               toUser,
          );

          if (!request) {
               throw new NotFoundException(
                    'Friend request not found or already processed',
               );
          }

          if (fromUser !== request.toUser.toString()) {
               throw new ForbiddenException('Not authorized to reject this request');
          }

          await this.friendRepository.deleteRequestById(request.id);

          return {
               message: 'Friend request rejected',
               data: { fromUser, toUser: fromUser, type: 'rejected' },
          };
     }

     async deleteFriendRequest(fromUser: string, toUser: string) {
          logger.info(`Deleting friend request from ${fromUser} to ${toUser}`);
          const request = await this.friendRepository.findOutgoingFriendRequest(
               fromUser,
               toUser,
          );
          logger.info(`Found request: ${JSON.stringify(request)}`);
          if (!request) {
               throw new NotFoundException('Friend request not found');
          }

          await this.friendRepository.deleteRequestById(request.id);

          return { message: 'Friend request deleted (no follow)' };
     }

     async follow(fromUser: string, toUser: string) {
          if (fromUser === toUser) {
               throw new BadRequestException('Cannot follow yourself');
          }

          const existing = await this.friendRepository.findIncomingFollowRequest(
               toUser,
               fromUser,
          );
          logger.info(`Found follow request: ${JSON.stringify(existing)}`);

          if (existing) {
               throw new BadRequestException('You are already following this person');
          }

          await this.friendRepository.createFollow(fromUser, toUser);
          return { message: 'Followed successfully' };
     }

     async unfollow(fromUser: string, toUser: string) {
          logger.info(`Data unfollow: ${fromUser} -> ${toUser}`);

          const relation = await this.friendRepository.findIncomingFollowRequest(
               toUser,
               fromUser,
          );
          if (!relation) {
               throw new BadRequestException('You are not following this person');
          }

          await this.friendRepository.deleteRequestById(relation.id);
          return { message: 'Unfollowed successfully' };
     }

     async getPendingFriendRequests(userId: string, limit: number, page: number) {
          const pendingRequests =
               await this.friendRepository.findPendingFriendRequests(
                    userId,
                    limit,
                    page,
               );

          const result = await Promise.all(
               pendingRequests.map(async (request) => {
                    const requester = request.fromUser;
                    const requesterId = requester._id.toString();
                    const followingCount = await this.countFollowing(requesterId);

                    return {
                         ...request,
                         fromUser: {
                              ...requester,
                              followingCount,
                         },
                    };
               }),
          );

          return result;
          // pagination: {
          //      totalItems,
          //           currentPage: page,
          //                totalPages: Math.ceil(totalItems / limit),
          //                     limit,
          //      },
     }

     async unFriend(fromUserId: string, toUserId: string) {
          if (fromUserId === toUserId)
               throw new BadRequestException('Cannot unfriend yourself');
          if (!fromUserId || !toUserId)
               throw new BadRequestException('Invalid user IDs');
          const unFriend = await this.friendRepository.unFriendUsers(
               fromUserId,
               toUserId,
          );
          if (!unFriend) {
               throw new NotFoundError('Friend relation not found or already removed');
          }

          logger.info(`User ${fromUserId} unfriended user ${toUserId}`);
          return unFriend;
     }

     async getSentFriendRequest(userId: string, limit: number, page: number) {
          const pendingFriends = await this.friendRepository.findPendingSentRequests(
               userId,
               limit,
               page,
          );

          const result = await Promise.all(
               pendingFriends.map(async (friend) => {
                    const friendId = friend.toUser._id.toString();
                    const followingCount = await this.countFollowing(friendId);
                    const countFollowers = await this.countFollowers(friendId);
                    return {
                         ...friend,
                         toUser: {
                              ...friend.toUser,
                              followingCount,
                              countFollowers,
                         },
                    };
               }),
          );

          return result;
          // pagination: {
          //      totalItems,
          //           currentPage: page,
          //                totalPages: Math.ceil(totalItems / limit),
          //                     limit,
          //      },
     }

     async getFriends(userId: string, limit: number, page: number) {
          const skip = (page - 1) * limit;

          const totalItems = await this.friendRepository.countAcceptedFriends(userId);
          const relations = await this.friendRepository.findAcceptedFriends(
               userId,
               limit,
               page,
          );
          const friends = await Promise.all(
               relations.map(async (relation) => {
                    const friend =
                         relation.fromUser._id.toString() === userId
                              ? relation.toUser
                              : relation.fromUser;

                    const followingCount = await this.countFollowing(friend._id.toString());
                    const countFollowers = await this.countFollowers(friend._id.toString());

                    return {
                         ...friend,
                         followingCount,
                         countFollowers,
                    };
               }),
          );
          return {
               data: friends,
               pagination: {
                    totalItems,
                    currentPage: page,
                    totalPages: Math.ceil(totalItems / limit),
                    limit,
               },
          };
     }

     async getRelatedUserIds(userId: string): Promise<string[]> {
          const relations = await this.friendRepository.findRelationsByUserAndTypes(
               userId,
               ['accepted', 'pending'],
          );

          const relatedIds = new Set<string>();

          for (const rel of relations) {
               const fromUserId = rel.fromUser?._id?.toString?.();
               const toUserId = rel.toUser?._id?.toString?.();

               if (!fromUserId || !toUserId) continue;

               const otherId = fromUserId === userId ? toUserId : fromUserId;

               if (Types.ObjectId.isValid(otherId)) {
                    relatedIds.add(otherId);
               }
          }

          if (Types.ObjectId.isValid(userId)) {
               relatedIds.add(userId);
          }

          return Array.from(relatedIds);
     }

     async findAnyRelationBetweenUsers(
          userId: string,
          id: string,
     ): Promise<any | null> {
          const friend = await this.friendRepository.findRelationBetweenUsers(
               userId,
               id,
          );
          return friend;
     }

     async isFollowing(userId: string, targetId: string): Promise<boolean> {
          const exists = await this.friendRepository.isUserFollowingTarget(
               userId,
               targetId,
          );
          return !!exists;
     }
     async getFriendUserIds(userId: string): Promise<string[]> {
          const relations =
               await this.friendRepository.findAcceptedRelationsByUserId(userId);
          if (!relations || relations.length === 0) {
               logger.info('No friend relations found for user:', userId);
               return [];
          }

          logger.info(`relations friend: ${JSON.stringify(relations)}`);
          return relations.map((rel) => {
               const fromUserId = rel.fromUser._id.toString();
               const toUserId = rel.toUser._id.toString();
               return fromUserId === userId ? toUserId : fromUserId;
          });
     }

     async getFollowingUserIds(userId: string): Promise<string[]> {
          const followRelations =
               await this.friendRepository.findFollowingsByUserId(userId);
          logger.info(`relations follow: ${JSON.stringify(followRelations)}`);

          return followRelations.map((rel) => rel.toUser.toString());
     }

     async handleFriendRequestAction(
          fromUser: string,
          toUser: string,
          type:
               | 'send'
               | 'deleted'
               | 'accept'
               | 'reject'
               | 'unfriend'
               | 'follow'
               | 'unfollow',
     ) {
          switch (type) {
               case 'send':
                    await this.friendRequest(fromUser, toUser);
                    return { message: 'Friend request sent successfully' };

               case 'deleted':
                    await this.deleteFriendRequest(fromUser, toUser);
                    return { message: 'Friend request cancelled successfully' };
               case 'accept':
                    await this.acceptRequest(fromUser, toUser);
                    return { message: 'Friend request accepted successfully' };
               case 'reject':
                    await this.rejectRequest(fromUser, toUser);
                    return { message: 'Friend request rejected successfully' };
               case 'unfriend':
                    await this.unFriend(fromUser, toUser);

                    return { message: 'Unfriended successfully' };
               case 'follow':
                    await this.follow(fromUser, toUser);
                    return { message: 'Followed successfully' };
               case 'unfollow':
                    await this.unfollow(fromUser, toUser);
                    return { message: 'Unfollowed successfully' };

               default:
                    throw new BadRequestException(`Unsupported action: ${status}`);
          }
     }

     async countFollowing(userId: string): Promise<number> {
          return await this.friendRepository.countFollowingByUserId(userId);
     }

     async countFollowers(userId: string): Promise<number> {
          logger.info(`followersId:${userId}`);

          return await this.friendRepository.countFollowersByUserId(userId);
     }

     async countFriends(userId: string): Promise<number> {
          return this.friendRepository.countAcceptedFriendsByUserId(userId);
     }

     async getFriendListByType(
          userId: string,
          type: 'all' | 'sent' | 'pending' | 'follow',
          limit: number,
     ) {
          let message = '';
          let result: any;

          switch (type) {
               case 'all':
                    message = 'Friend list fetched successfully';
                    result = await this.getFriends(userId, limit, 1);
                    break;
               case 'sent':
                    message = 'Sent friend requests fetched successfully';
                    result = await this.getSentFriendRequest(userId, limit, 1);
                    break;
               case 'pending':
                    message = 'Pending friend requests fetched successfully';
                    result = await this.getPendingFriendRequests(userId, limit, 1);
                    break;
               case 'follow':
                    message = 'Follow list fetched successfully';
                    result = await this.getFollowingRelations(userId, limit);
                    break;
               default:
                    throw new BadRequestException('Invalid type');
          }

          return { message, result };
     }

     async getFollowingRelations(userId: string, limit: number) {
          return this.friendRepository.findFollowingsUserId(userId, limit);
     }

     async isFriend(userA: string, userB: string): Promise<boolean> {
          return await this.friendRepository.isFriend(userA, userB);
     }
}
