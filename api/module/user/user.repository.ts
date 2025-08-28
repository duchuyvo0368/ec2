import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.model';
import { FriendRelation, FriendRelationDocument } from 'module/firends/friend.model';

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User.name, 'MONGODB_CONNECTION')
        private readonly userModel: Model<UserDocument>,

        @InjectModel(FriendRelation.name, 'MONGODB_CONNECTION')
        private readonly friendRelationModel: Model<FriendRelationDocument>,
    ) { }

    findByEmail(email: string, select: any = { email: 1, password: 1, name: 1, bio: 1, avatar: 1 }) {
        return this.userModel.findOne({ email }).select(select).lean();
    }

    findUserById(userId: string) {
        return this.userModel.findById(userId).select('name fcm_token avatar').lean();
    }

    findByIds(ids: string[]) {
        return this.userModel.find({ _id: { $in: ids } }).select('_id name avatar').lean();
    }

    createUser(data: Partial<UserDocument>) {
        return this.userModel.create(data);
    }

    updateUser(id: string, data: Partial<UserDocument>) {
        return this.userModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    }

    deleteUser(id: string) {
        return this.userModel.findByIdAndDelete(id);
    }

    findAllExcludingIds(excludedIds: Types.ObjectId[], limit: number, skip: number) {
        return this.userModel.aggregate([
            { $match: { _id: { $nin: excludedIds } } },
            {
                $facet: {
                    data: [
                        { $sample: { size: limit * 10 } },
                        { $skip: skip },
                        { $limit: limit },
                        { $project: { password: 0 } },
                    ],
                    total: [{ $count: 'count' }],
                },
            },
        ]);
    }

    searchAcceptedRelations(userId: string, limit: number) {
        return this.friendRelationModel
            .find({
                type: 'accepted',
                $or: [{ fromUser: userId }, { toUser: userId }],
            })
            .populate('fromUser', 'name avatar email')
            .populate('toUser', 'name avatar email')
            .limit(limit)
            .lean();
    }

    updateFcmToken(userId: string, fcmToken: string) {
        return this.userModel.findByIdAndUpdate(
            userId,
            { fcm_token: fcmToken },
            { new: true, runValidators: true },
        );
    }

    findById(id: string) {
        return this.userModel.findById(id).lean();
    }

    // Aggregation helper replicating current service behavior (sample size = limit * page)
    aggregateExcludeUsers(excludedIds: Types.ObjectId[], limit: number, page: number, skip: number) {
        return this.userModel.aggregate([
            { $match: { _id: { $nin: excludedIds } } },
            {
                $facet: {
                    data: [
                        { $sample: { size: limit * page } },
                        { $skip: skip },
                        { $limit: limit },
                        { $project: { password: 0 } },
                    ],
                    total: [{ $count: 'count' }],
                },
            },
        ]);
    }
}
