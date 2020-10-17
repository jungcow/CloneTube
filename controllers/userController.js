import routes from '../routes';
import passport from 'passport';
import User from '../models/User';
import Video from '../models/Video';

export const getJoin = (req, res) => {
  res.render('join');
}

export const postJoin = async (req, res, next) => {
  const { body: { name, email, password, password2 } } = req;
  try {
    if (password !== password2) {
      return res.redirect(routes.join);
    }
    const newUser = await User({
      name,
      email
    });
    // if (newUser){
    // return flash
    // }
    await User.register(newUser, password);
    next();
  } catch (error) {
    console.log(error);
    res.redirect(routes.join);
  }
}


export const getLogin = (req, res) => {
  res.render('login');
}

//LOCAL LOGIN CONTROLLER
export const postLogin = passport.authenticate('local', {
  failureRedirect: routes.login,
  successRedirect: routes.home
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
  req.logout();
  res.redirect(routes.home);
}

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('videos');
    res.render('me', { user });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
}
export const profile = async (req, res) => {
  const { params: { id } } = req;
  try {
    const user = await User.findById(id).populate('videos');
    res.render('profile', { user });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
}
export const getEditProfile = async (req, res) => {
  res.render('editProfile');
}

export const postEditProfile = async (req, res) => {
  const { body: { name, email }, file } = req;
  try {
    const user = await User.findOneAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.path : req.user.avatarUrl
    });
  } catch (error) {
    console.log(error);
    res.redirect(`/user${routes.editProfile}`);
  }
  res.redirect(routes.me);
}

export const getChangePassword = (req, res) => {
  res.render('changePassword');
}

export const postChangePassword = async (req, res) => {
  const { body: { currentPassword, newPassword, newPassword2 } } = req;
  if (newPassword !== newPassword2) {
    return res.redirect(routes.changePassword);
  }
  try {
    const user = await User.findOne({ _id: req.user.id });
    user.changePassword(currentPassword, newPassword);
    res.redirect(routes.editProfile);
  } catch (error) {
    console.log(error);
    res.redirect(routes.changePassword);
  }
}
