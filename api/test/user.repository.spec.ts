import { UserRepository } from '../module/user/user.repository';

describe('UserRepository', () => {
    it('findUserById should select fcm_token, not fcmToken', async () => {
        const selectMock = jest.fn().mockReturnThis();
        const leanMock = jest.fn().mockResolvedValue({});
        const findByIdMock = jest.fn().mockReturnValue({ select: selectMock, lean: leanMock });

        const mockModel: any = {
            findById: findByIdMock,
        };

        const repo = new UserRepository(mockModel as any, {} as any);
        await repo.findUserById('x');

        expect(selectMock).toHaveBeenCalledWith('name fcm_token avatar');
    });
});


