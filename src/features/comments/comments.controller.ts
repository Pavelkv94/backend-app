import { NextFunction, Request, Response } from "express";
import { CommentInputModel, CommentViewModel, URIParamsCommentModel } from "./models/comments.models";
import { CommentService, commentService } from "./comments.service";
import { HTTP_STATUSES, ResultStatus } from "../../types/common-types";
import { ApiError } from "../../exeptions/api-error";
import { commentQueryRepository, CommentQueryRepository } from "./repositories/comments.query-repository";
import { LikeInputModel } from "../likes/models/like.model";
import { LikeService, likeService } from "../likes/like.service";
import { commentRepository } from "./repositories/comments.repository";
import { jwtService, JwtService } from "../../adapters/jwt/jwt.service";

export class CommentController {
  constructor(
    private commentQueryRepository: CommentQueryRepository,
    private commentService: CommentService,
    private likeService: LikeService,
    private jwtService: JwtService
  ) {}

  async getComment(req: Request<URIParamsCommentModel>, res: Response<CommentViewModel>, next: NextFunction) {
    try {
      let userId = null;

      if (req.headers.authorization) {
        const [authType, token] = req.headers.authorization.split(" ");
        if (authType === "Bearer") {
          const payload = await this.jwtService.verifyAccessToken(token);
          if (payload) {
            userId = payload.user_id;
          }
        }
      }

      const comment = await this.commentQueryRepository.findComment(req.params.id, userId);

      if (!comment) {
        return next(ApiError.NotFound("The requested resource was not found"));
      }

      res.status(HTTP_STATUSES.SUCCESS).send(comment);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
  async updateComment(req: Request<URIParamsCommentModel, {}, CommentInputModel>, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;

      const { status, errorMessage, data: updatedCommentId } = await this.commentService.updateComment(req.params.id, req.body, userId);

      if (status === ResultStatus.SUCCESS && updatedCommentId) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT);
      } else if (status === ResultStatus.FORBIDDEN) {
        return next(ApiError.Forbidden(errorMessage));
      } else {
        return next(ApiError.NotFound("The requested resource was not found"));
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
  async deleteComment(req: Request<URIParamsCommentModel>, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;

      const { status, errorMessage, data: isDeleted } = await this.commentService.deleteComment(req.params.id, userId);

      if (status === ResultStatus.SUCCESS && isDeleted) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT);
      } else if (status === ResultStatus.FORBIDDEN) {
        return next(ApiError.Forbidden(errorMessage));
      } else {
        return next(ApiError.NotFound("The requested resource was not found"));
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

  async changeLikeStatus(req: Request<URIParamsCommentModel, {}, LikeInputModel>, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const commentId = req.params.id;
      const newStatus = req.body.likeStatus;

      await commentService.changeLikeStatus(userId, commentId, newStatus);

      res.sendStatus(204);
    } catch (error) {
      commentRepository;
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
}

export const commentController = new CommentController(commentQueryRepository, commentService, likeService, jwtService);
