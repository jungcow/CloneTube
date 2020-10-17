import express from 'express';
import routes from '../routes';
import { getAddView, getIsLoggedIn, isCommentCreator, postAddComment, postDeleteComment } from '../controllers/apiController';

export const apiRouter = express.Router();

apiRouter.get(routes.isLoggedIn, getIsLoggedIn);

apiRouter.post(routes.isCommentCreator, isCommentCreator)

apiRouter.get(routes.addView, getAddView);

apiRouter.post(routes.addComment, postAddComment);

apiRouter.post(routes.deleteComment, postDeleteComment);

