import { NextFunction, Request, Response } from "express";
import { commentQueryRepository } from "./comments.query-repository";
import { CommentInputModel, CommentViewModel, URIParamsCommentModel } from "./models/comments.models";
import { commentsService } from "./comments.service";
import { HTTP_STATUSES, ResultStatus } from "../../types/common-types";
import { ApiError } from "../../exeptions/api-error";

export const commentsController = {
  async getComment(req: Request<URIParamsCommentModel>, res: Response<CommentViewModel>, next: NextFunction) {
    try {
      const comment = await commentQueryRepository.findComment(req.params.id);

      if (!comment) {
        return next(ApiError.NotFound("The requested resource was not found"));
      }

      res.status(HTTP_STATUSES.SUCCESS).send(comment);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async updateComment(req: Request<URIParamsCommentModel, {}, CommentInputModel>, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;

      const { status, errorMessage, data: isUpdated } = await commentsService.updateComment(req.params.id, req.body, userId);

      if (status === ResultStatus.SUCCESS && isUpdated) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT);
      } else if (status === ResultStatus.FORBIDDEN) {
        return next(ApiError.Forbidden(errorMessage));
      } else {
        return next(ApiError.NotFound("The requested resource was not found"));
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async deleteComment(req: Request<URIParamsCommentModel>, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;

      const { status, errorMessage, data: isDeleted } = await commentsService.deleteComment(req.params.id, userId);

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
  },
};
