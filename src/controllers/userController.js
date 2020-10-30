import routes from '../routes';
import passport from 'passport';
import User from '../models/User';
import Video from '../models/Video';
import { makeUploadTime } from './videoController';

export const getJoin = (req, res) => {
  res.render('join', { pageTitle: '가입' });
}

export const postJoin = async (req, res, next) => {
  const { body: { name, email, password, password2 } } = req;
  try {
    if (password !== password2) {
      req.flash('loginError', '비밀번호를 다시 확인해주세요')
      throw Error('password error');
    }
    const user = await User.findOne({ email });
    if (user) {
      req.flash('loginError', '이미 사용중인 이메일 입니다');
      return res.redirect(routes.join);
    }
    const newUser = await User({
      name,
      email
    });
    await User.register(newUser, password);
    req.flash('welcome', `환영합니다 ${name}님`)
    next();
  } catch (error) {
    console.log(error);
    res.redirect(routes.join);
  }
}


export const getLogin = (req, res) => {
  res.render('login', { pageTitle: '로그인' });
}

//LOCAL LOGIN CONTROLLER

export const postLogin = passport.authenticate('local', {
  successRedirect: routes.home,
  failureRedirect: routes.login,
  successFlash: '로그인 완료',
  failureFlash: '아이디 또는 비밀번호를 다시 확인해주시기 바랍니다.',
});


//GITHUB LOGIN CONTROLLER
export const github = passport.authenticate('github');

export const githubCallback = async (accessToken, refreshToken, profile, done) => {
  const { _json: { login, id, avatar_url }, emails: [{ value }] } = profile;
  try {
    const user = await User.findOne({ email: value });
    if (user) {
      user.snsId.githubId = id;
      user.save();
      return done(null, user);
    }
    const newUser = await User.create({
      name: login,
      snsId: {
        githubId: id
      },
      avatarUrl: avatar_url,
      email: value,
    });
    return done(null, newUser);
  } catch (error) {
    return done(error);
  }
}

//KAKAO LOGIN CONTROLLER
export const kakao = passport.authenticate('kakao');

export const kakaoCallback = async (accessToken, refreshToken, profile, cb) => {
  const { id, username, _json: { properties: { profile_image: avatarUrl }, kakao_account: { email } } } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.snsId.kakaoId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      name: username,
      email,
      avatarUrl,
      snsId: {
        kakaoId: id
      },
    });
    cb(null, newUser);
  } catch (error) {
    cb(error);
  }
}

export const logout = (req, res) => {
  req.flash('info', `안녕히 가세요 ${req.user.name}님`);
  req.logout();
  res.redirect(routes.home);
}

export const me = async (req, res) => {
  try {
    let uploadedArray = [];
    const user = await User.findById(req.user.id).populate('videos');
    const uploadedAt = user.videos.map((video) => video.uploadedAt);
    makeUploadTime(uploadedAt, uploadedArray);
    res.render('me', { user, uploadedArray, pageTitle: '내 프로필' });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
}
export const profile = async (req, res) => {
  const { params: { id } } = req;
  try {
    let uploadedArray = [];
    const user = await User.findById(id).populate('videos');
    const uploadedAt = user.videos.map((video) => video.uploadedAt);
    makeUploadTime(uploadedAt, uploadedArray);
    res.render('profile', { user, uploadedArray, pageTitle: `${user.name}의 프로필` });
  } catch (error) {
    req.flash('accessError', '잘못된 접근입니다');
    console.log(error);
    res.redirect(routes.home);
  }
}
export const getEditProfile = async (req, res) => {
  res.render('editProfile', { pageTitle: '프로필 수정' });
}

export const postEditProfile = async (req, res) => {
  const { body: { name, email }, file, user: { id } } = req;
  console.log(id);
  try {
    await User.findByIdAndUpdate(id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl
    });
    console.log(req.user);
    req.flash('info', "프로필 수정 완료");
  } catch (error) {
    console.log(error);
    res.redirect(`/user${routes.editProfile}`);
  }
  res.redirect(routes.me);
}

export const getChangePassword = (req, res) => {
  res.render('changePassword', { pageTitle: '비밀번호 변경' });
}

export const postChangePassword = async (req, res) => {
  const { body: { currentPassword, newPassword, newPassword2 } } = req;
  if (newPassword !== newPassword2) {
    req.flash('loginError', '비밀번호를 다시 확인해주세요')
    res.redirect(routes.changePassword);
    throw Error('password error');
  }
  try {
    const user = await User.findOne({ _id: req.user.id });
    user.changePassword(currentPassword, newPassword);
    req.flash('info', "비밀번호 변경 완료");
    res.redirect(routes.editProfile);
  } catch (error) {
    console.log(error);
    res.redirect(routes.changePassword);
  }
}
