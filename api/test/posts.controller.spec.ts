import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import request from 'supertest';
import { PostsController } from 'module/posts/posts.controller';
import { PostsService } from 'module/posts/posts.service';
import { AuthGuard } from 'module/auth/guards/access-token.guard';
import { describe, it } from 'node:test';

describe('PostsController (HTTP)', () => {
    let app: INestApplication;
    const mockPostsService = {
        getFeedPosts: jest.fn().mockResolvedValue({
            data: [{ _id: 'p1', title: 't' }],
            pagination: { page: 1, limit: 10, totalItems: 1, totalPages: 1 },
        }),
        createPost: jest.fn().mockResolvedValue({ _id: 'p1', title: 'Created' }),
    } as Partial<PostsService>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PostsController],
            providers: [
                { provide: PostsService, useValue: mockPostsService },
                {
                    provide: AuthGuard,
                    useValue: {
                        canActivate: (context: ExecutionContext) => {
                            const req = context.switchToHttp().getRequest();
                            req.user = { userId: 'user-1' };
                            return true;
                        },
                    },
                },
            ],
        }).compile();

        app = module.createNestApplication();
        app.setGlobalPrefix('v1/api');
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /v1/api/posts should return feed posts', async () => {
        const res = await request(app.getHttpServer()).get('/v1/api/posts');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            data: [{ _id: 'p1', title: 't' }],
            pagination: { page: 1, limit: 10, totalItems: 1, totalPages: 1 },
        });
        expect(mockPostsService.getFeedPosts).toHaveBeenCalledWith('user-1', 1, 1);
    });

    it('POST /v1/api/posts/create should create a post', async () => {
        const payload = { title: 'A', content: 'B' };
        const res = await request(app.getHttpServer())
            .post('/v1/api/posts/create')
            .send(payload);
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ _id: 'p1', title: 'Created' });
        expect(mockPostsService.createPost).toHaveBeenCalledWith(payload, 'user-1');
    });
});


function expect(status: number) {
    throw new Error('Function not implemented.');
}

function afterAll(arg0: () => Promise<void>) {
    throw new Error('Function not implemented.');
}

