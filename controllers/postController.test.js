const { createPost } = require('../controllers/postController');
const cloudinary = require('../utils/cloudinary');
const Post = require('../models/postModel');

jest.mock('../utils/cloudinary');
jest.mock('../models/postModel');

describe('Post Controller', () => {
    describe('createPost', () => {
        it('should create a new post', async () => {
            cloudinary.uploader.upload.mockResolvedValue({
                public_id: 'public_id',
                secure_url: 'https://secure_url',
            });

            Post.create.mockResolvedValue({
                title: 'Test Title',
                content: 'Test Content',
                postedBy: 'user_id',
                image: {
                    public_id: 'public_id',
                    url: 'https://secure_url',
                },
            });

            const req = {
                user: { _id: 'user_id' },
                body: {
                    title: 'Test Title',
                    content: 'Test Content',
                    image: 'https://test_image_url',
                },
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const next = jest.fn();

            await createPost(req, res, next);

            expect(cloudinary.uploader.upload).toHaveBeenCalled();
            expect(Post.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                post: {
                    title: 'Test Title',
                    content: 'Test Content',
                    postedBy: 'user_id',
                    image: {
                        public_id: 'public_id',
                        url: 'https://secure_url',
                    },
                },
            });
        });
    });
});
