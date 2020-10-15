import express from 'express';
import routes from '../routes';
import { getAddComment, postAddComment } from '../controllers/apiController';
import { onlyPrivate } from '../middleware';

export const apiRouter = express.Router();

apiRouter.get(routes.addComment, getAddComment);
apiRouter.post(routes.addComment, postAddComment);

