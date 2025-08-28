import { Types } from 'mongoose';
import { PostRepository } from '../module/posts/post.reponsitory';
import { describe, it } from 'node:test';

describe('PostRepository', () => {
    it('should not overwrite userId provided in data (must keep ObjectId)', async () => {
        const createMock = jest.fn(async (doc) => doc);

        const mockModel: any = {
            create: createMock,
        };

        const repository = new PostRepository(mockModel as any);

        const objectId = new Types.ObjectId();
        const data: any = { userId: objectId, title: 't' };
        const userIdString = 'user-id-string-should-not-override';

        await repository.createPost(data, userIdString);

        expect(createMock).toHaveBeenCalledTimes(1);
        const calledWith = createMock.mock.calls[0][0];
        // BUG: current implementation overwrites userId with string
        expect(calledWith.userId).toBe(objectId);
    });
});


function expect(createMock: any) {
    throw new Error('Function not implemented.');
}

