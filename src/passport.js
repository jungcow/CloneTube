import dotenv from 'dotenv';
import passport from 'passport';
import GithubStrategy from 'passport-github2';
import KakaoStrategy from 'passport-kakao';
import { githubCallback, kakaoCallback } from './controllers/userController';
import User from './models/User';

dotenv.config();

passport.use(User.createStrategy());

passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: "http://localhost:4003/auth/github/callback",
  scope: ['user:email'],
},
  githubCallback
));

passport.use(new KakaoStrategy({
  clientID: process.env.KAKAO_ID,
  clientSecret: '',
  callbackURL: 'http://localhost:4003/auth/kakao/callback',
},
  kakaoCallback
))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());