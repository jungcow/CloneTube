const routes = {
  //global
  home: '/',
  search: '/search',
  join: '/join',
  login: '/login',
  logout: '/logout',
  me: '/me',
  videoDetail(id) {
    if (id) {
      return `/${id}`;
    } else {
      return '/:id';
    }
  },
  upload: '/upload',
  //user
  user: '/user',
  profile(id) {
    if (id) {
      return `/${id}`;
    } else {
      return '/:id';
    }
  },
  editProfile: '/editProfile',
  changePassword: '/changePassword',
  //video
  video: '/video',
  editVideo(id) {
    if (id) {
      return `/${id}/edit`;
    } else {
      return '/:id/edit';
    }
  },
  deleteVideo(id) {
    if (id) {
      return `/${id}/delete`;
    } else {
      return '/:id/delete';
    }
  },
  //github
  github: '/auth/github',
  githubCallback: '/auth/github/callback',
  //kakao
  kakao: '/auth/kakao',
  kakaoCallback: '/auth/kakao/callback',
  //api
  api: '/api',
  addView: '/:id/view',
  addComment: '/:id/comment',
  deleteComment: '/:id/deleteComment',
  isLoggedIn: '/isLoggedIn',
  isCommentCreator: '/isCommentCreator',
  moreVideos: '/moreVideos',
}

export default routes;