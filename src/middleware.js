import dotenv from 'dotenv';
import routes from './routes';
import multerS3 from 'multer-s3';
import multer from 'multer';
import aws from 'aws-sdk';

dotenv.config();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
  region: 'ap-northeast-2'
})

const multerVideo = multer({
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: 'clone-tube/video',
  })
})
const multerAvatar = multer({
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: 'clone-tube/avatar'
  })
})

export const uploadVideo = multerVideo.single('videoFile');
export const uploadAvatar = multerAvatar.single('avatar');

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = 'Clonetube';
  res.locals.routes = routes;
  res.locals.user = req.user || '';
  next();
}

export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    return next();
  }
  req.flash('accessError', '로그인이 필요합니다');
  return res.redirect(routes.home);
}
export const onlyPublic = (req, res, next) => {
  if (!req.user) {
    return next();
  }
  req.flash('accessError', '잘못된 접근입니다');
  return res.redirect(routes.home);
}
