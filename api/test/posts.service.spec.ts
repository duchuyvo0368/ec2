import { PostsService } from '../module/posts/posts.service';

describe('PostsService', () => {
    it('getFeedPosts should use six hours window, not 248 hours', async () => {
        const friendService: any = {
            getFriendUserIds: jest.fn().mockResolvedValue([]),
            getFollowingUserIds: jest.fn().mockResolvedValue([]),
        };
        const postRepository: any = {
            findFeedAggregate: jest.fn().mockResolvedValue({ posts: [], totalItems: 0, totalPages: 0 }),
        };

        const service = new PostsService(friendService, postRepository);
        const now = Date.now();
        jest.spyOn(Date, 'now').mockReturnValue(now);

        await service.getFeedPosts('u', 1, 10);

        const calledWithDate: Date = postRepository.findFeedAggregate.mock.calls[0][3];

        const diffMs = now - calledWithDate.getTime();

        // Six hours window ~ 6 * 60 * 60 * 1000
        const sixHoursMs = 6 * 60 * 60 * 1000;

        // Allow 10 seconds tolerance
        expect(Math.abs(diffMs - sixHoursMs)).toBeLessThan(10_000);
    });
});


