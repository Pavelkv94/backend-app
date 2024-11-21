import { NextFunction, Request, Response } from "express";
import { CommentInputModel, CommentViewModel, URIParamsCommentModel } from "./models/comments.models";
import { CommentService, commentService } from "./comments.service";
import { HTTP_STATUSES, ResultStatus } from "../../types/common-types";
import { ApiError } from "../../exeptions/api-error";
import { commentQueryRepository, CommentQueryRepository } from "./repositories/comments.query-repository";

export class CommentController {
  constructor(public commentQueryRepository: CommentQueryRepository, public commentService: CommentService) {}

  async getComment(req: Request<URIParamsCommentModel>, res: Response<CommentViewModel>, next: NextFunction) {
    try {
      const comment = await this.commentQueryRepository.findComment(req.params.id);

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
}

export const commentController = new CommentController(commentQueryRepository, commentService);
