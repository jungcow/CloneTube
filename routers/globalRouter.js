import express from 'express';
import routes from '../routes';
import passport from 'passport';
import { getJoin, getLogin, github, isUser, kakao, logout, me, postJoin, postLogin } from '../controllers/userController';
import { getUpload, home, postUpload, search } from '../controllers/videoController';
import { onlyPrivate, onlyPublic, uploadVideo } from '../middleware';


export const globalRouter = express.Router();

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);

globalRouter.get(routes.github, github);
globalRouter.get(
  routes.githubCallback,
  passport.authenticate('github', {
    failureRedirect: routes.join,
    failureFlash: '아이디 또는 비밀번호를 다시 확인해주시기 바랍니다.'
  }),
  (req, res) => {
    req.flash('success', `환영합니다 ${req.user.name}님!`)
    res.redirect(routes.home);
  }
);

globalRouter.get(routes.kakao, kakao);
globalRouter.get(routes.kakaoCallback,
  passport.authenticate('kakao', {
    failureRedirect: routes.join,
    failureFlash: '아이디 또는 비밀번호를 다시 확인해주시기 바랍니다.'
  }),
  (req, res) => {
    req.flash('success', `환영합니다 ${req.user.name}님!`)
    res.redirect(routes.home)
  }
)

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.logout, onlyPrivate, logout);
globalRouter.get(routes.me, onlyPrivate, me);

globalRouter.get(routes.upload, onlyPrivate, getUpload);
globalRouter.post(routes.upload, onlyPrivate, uploadVideo, postUpload);
