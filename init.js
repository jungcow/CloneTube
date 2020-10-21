import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import flash from 'express-flash';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import path from 'path';
import passport from 'passport';
import session from 'express-session';

import routes from './routes';
import { globalRouter } from './routers/globalRouter';
import { userRouter } from './routers/userRouter';
import { videoRouter } from './routers/videoRouter';
import { apiRouter } from './routers/apiRouter';
import { localsMiddleware } from './middleware';

import './db';
import './models/User';
import './passport';
import { contentSecurityPolicy } from 'helmet';

dotenv.config();
const PORT = process.env.PORT || 4003;

const SessionStore = MongoStore(session);

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/upload', express.static('upload'));
app.use('/static', express.static('static'));

app.use(morgan('dev'));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  store: new SessionStore({ mongooseConnection: mongoose.connection })
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


app.use(localsMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.video, videoRouter);
app.use(routes.user, userRouter);
app.use(routes.api, apiRouter);



app.listen(PORT, () => console.log(`✅ ${PORT}번 포트에 연결되었습니다`));