import { Request, Response } from "express";
import { commentQueryRepository } from "./comments.query-repository";
import { CommentInputModel, CommentViewModel, URIParamsCommentModel } from "./models/comments.models";
import { commentsService } from "./comments.service";
import { ResultStatus } from "../../types/common-types";

export const commentsController = {
  async getComment(req: Request<URIParamsCommentModel>, res: Response<CommentViewModel>) {
    const comment = await commentQueryRepository.findComment(req.params.id);

    if (!comment) {
      res.sendStatus(404);
      return;
    }

    res.status(200).send(comment);
  },
  async updateComment(req: Request<URIParamsCommentModel, {}, CommentInputModel>, res: Response) {
    const userId = req.user.id;

    const { status, errorMessage, data: isUpdated } = await commentsService.updateComment(req.params.id, req.body, userId);

    if (status === ResultStatus.SUCCESS && isUpdated) {
      res.sendStatus(204);
    } else if (status === ResultStatus.FORBIDDEN) {
      res.status(403).json({ errorsMessages: [{ message: errorMessage, field: "" }] });
    } else {
      res.sendStatus(404);
    }
  },
  async deleteComment(req: Request<URIParamsCommentModel>, res: Response) {
    const userId = req.user.id;

    const { status, errorMessage, data: isDeleted } = await commentsService.deleteComment(req.params.id, userId);

    if (status === ResultStatus.SUCCESS && isDeleted) {
      res.sendStatus(204);
    } else if (status === ResultStatus.FORBIDDEN) {
      res.status(403).json({ errorsMessages: [{ message: errorMessage, field: "" }] });
    } else {
      res.sendStatus(404);
    }
  },
};
