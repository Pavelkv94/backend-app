import { Container } from "inversify";
import "reflect-metadata";
import { PostRepository } from "./features/posts/repositories/posts.repository";
import { PostQueryRepository } from "./features/posts/repositories/posts.query-repository";
import { PostService } from "./features/posts/posts.service";
import { PostController } from "./features/posts/posts.controller";
import { CommentRepository } from "./features/comments/repositories/comments.repository";
import { CommentQueryRepository } from "./features/comments/repositories/comments.query-repository";
import { CommentService } from "./features/comments/comments.service";
import { CommentController } from "./features/comments/comments.controller";
import { BlogRepository } from "./features/blogs/repositories/blogs.repository";
import { BlogQueryRepository } from "./features/blogs/repositories/blogs.query-repository";
import { BlogService } from "./features/blogs/blogs.service";
import { BlogController } from "./features/blogs/blogs.controller";
import { LikeService } from "./features/likes/like.service";
import { LikeRepository } from "./features/likes/like.repository";
import { UserRepository } from "./features/users/infrastructure/users.repository";
import { UserQueryRepository } from "./features/users/infrastructure/users.query-repository";
import { UserService } from "./features/users/application/users.service";
import { UserController } from "./features/users/api/users.controller";
import { AuthService } from "./features/auth/auth.service";
import { AuthController } from "./features/auth/auth.controller";
import { NodemailerService } from "./adapters/mail.service";
import { BcryptService } from "./adapters/bcrypt.service";
import { JwtService } from "./adapters/jwt/jwt.service";
import { SecurityDeviceRepository } from "./features/securityDevices/repositories/securityDevices.repository";
import { SecurityDeviceQueryRepository } from "./features/securityDevices/repositories/securityDevices.query-repository";
import { SecurityDeviceService } from "./features/securityDevices/securityDevices.service";
import { SecurityDeviceController } from "./features/securityDevices/securityDevices.controller";


export const container = new Container();

container.bind(AuthService).to(AuthService);
container.bind(AuthController).to(AuthController);

container.bind(NodemailerService).to(NodemailerService);
container.bind(BcryptService).to(BcryptService);
container.bind(JwtService).to(JwtService);

container.bind(SecurityDeviceRepository).to(SecurityDeviceRepository);
container.bind(SecurityDeviceQueryRepository).to(SecurityDeviceQueryRepository);
container.bind(SecurityDeviceService).to(SecurityDeviceService);
container.bind(SecurityDeviceController).to(SecurityDeviceController);

container.bind(UserRepository).to(UserRepository);
container.bind(UserQueryRepository).to(UserQueryRepository);
container.bind(UserService).to(UserService);
container.bind(UserController).to(UserController);

container.bind(BlogRepository).to(BlogRepository);
container.bind(BlogQueryRepository).to(BlogQueryRepository);
container.bind(BlogService).to(BlogService);
container.bind(BlogController).to(BlogController);

container.bind(PostRepository).to(PostRepository);
container.bind(PostQueryRepository).to(PostQueryRepository);
container.bind(PostService).to(PostService);
container.bind(PostController).to(PostController);

container.bind(CommentRepository).to(CommentRepository);
container.bind(CommentQueryRepository).to(CommentQueryRepository);
container.bind(CommentService).to(CommentService);
container.bind(CommentController).to(CommentController);

container.bind(LikeService).to(LikeService);
container.bind(LikeRepository).to(LikeRepository);
