import express from 'express';
import routes from '../routes';
import passport from 'passport';
import { getJoin, getLogin, github, kakao, logout, me, postJoin, postLogin } from '../controllers/userController';
import { getUpload, home, postUpload, search } from '../controllers/videoController';
import { onlyPrivate, onlyPublic, uploadVideo } from '../middleware';


export const globalRouter = express.Router();

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);

globalRouter.get(routes.github, onlyPublic, github);
globalRouter.get(
  routes.githubCallback,
  passport.authenticate('github', { failureRedirect: routes.join }),
  onlyPublic,
  (req, res) => {
    res.redirect(routes.home);
  }
);

globalRouter.get(routes.kakao, onlyPublic, kakao);
globalRouter.get(routes.kakaoCallback,
  passport.authenticate('kakao', { failureRedirect: routes.join }),
  onlyPublic,
  (req, res) => {
    res.redirect(routes.home)
  }
)

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.logout, onlyPrivate, logout);
globalRouter.get(routes.me, onlyPrivate, me);

globalRouter.get(routes.upload, onlyPrivate, getUpload);
globalRouter.post(routes.upload, onlyPrivate, uploadVideo, postUpload);
