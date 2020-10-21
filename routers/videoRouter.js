import express from 'express';
import routes from '../routes';
import { deleteVideo, videoDetail } from '../controllers/videoController';
import { onlyPrivate } from '../middleware';
import { getEditVideo, postEditVideo } from '../controllers/videoController';

export const videoRouter = express.Router();

videoRouter.get(routes.editVideo(), onlyPrivate, getEditVideo);
videoRouter.post(routes.editVideo(), onlyPrivate, postEditVideo);

videoRouter.get(routes.videoDetail(), videoDetail);


videoRouter.get(routes.deleteVideo(), onlyPrivate, deleteVideo);