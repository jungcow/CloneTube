import routes from './routes';
import multer from 'multer';

const multerVideo = multer({ dest: 'upload/video' });
const multerAvatar = multer({ dest: 'upload/avatar' });

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = 'Mongo Populate';
  res.locals.routes = routes;
  res.locals.user = req.user || null;
  next();
}

export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.redirect(routes.home);
}
export const onlyPublic = (req, res, next) => {
  if (!req.user) {
    return next();
  }
  return res.redirect(routes.home);
}

export const uploadVideo = multerVideo.single('videoFile');
export const uploadAvatar = multerAvatar.single('avatar');