import Video from '../models/Video';
import Comment from '../models/Comment';
import routes from '../routes';
import { makeUploadTime } from './videoController';

export const getIsLoggedIn = async (req, res) => {
  try {
    if (!req.user) {
      req.flash('accessError', '로그인 필요');
      res.redirect(routes.login);
      throw Error('No User');
    }
    const commentCreator = {
      name: req.user.name,
      avatarUrl: req.user.avatarUrl
    }
    res.send(commentCreator);
  } catch (error) {
    console.log(error);
    res.status(400);
  } finally {
    res.end();
  }
}

export const isCommentCreator = async (req, res) => {
  const { body: { uniqueId }, user } = req;
  try {
    if (!req.user) {
      req.flash('accessError', '로그인 필요');
      res.redirect(routes.login);
      throw Error('No User');
    }
    const comment = await Comment.findOne({ uniqueId }).populate('creator');
    if (comment.creator.id === user.id) {
      console.log('success');
      res.status(200);
    } else {
      console.log('not match');
      req.flash('accessError', '잘못된 접근입니다');
      res.status(400);
    }
  } catch (error) {
    console.log(error);
    res.status(400);
  } finally {
    res.end();
  }
}

export const getAddView = async (req, res) => {
  const { params: { id } } = req;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(400);
  } finally {
    res.end();
  }
}

export const postAddComment = async (req, res) => {
  const { params: { id }, body: { comment, uniqueId }, user } = req;
  try {
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      uniqueId,
      creator: user.id,
      message: comment,
    })
    video.comments.push(newComment.id);
    video.save();
    req.flash('info', "댓글 등록 완료");
  } catch (error) {
    console.log(error);
    req.flash('accessError', '잘못된 접근입니다');
    res.status(400);
    res.redirect(`/video${routes.videoDetail(id)}`);
  } finally {
    res.end();
  }
}

export const postDeleteComment = async (req, res) => {
  const { params: { id }, body: { uniqueId }, user } = req;
  try {
    const video = await Video.findById(id);
    video.comments.forEach((id) => console.log(id));
    const comment = await Comment.findOne({ uniqueId });
    const index = video.comments.indexOf(comment.id);
    await Comment.findOneAndRemove({ uniqueId });
    video.comments.splice(index, 1);
    video.comments.forEach((comment) => console.log(comment.uniqueId));
    video.save();
    req.flash('info', "댓글 삭제 완료");
  } catch (error) {
    console.log(error);
    req.flash('accessError', '잘못된 접근입니다');
    res.status(400);
  } finally {
    res.end();
  }
}

export const pageInVideos = 6;


export const moreVideos = async (req, res) => {
  const { body: { page } } = req;
  let uploadedArray = [];
  let randomArray = [];
  let arrayObject = {};
  try {
    const videos = await Video.find({}).populate('creator').skip((page - 1) * pageInVideos).limit(pageInVideos);
    const uploadedAt = videos.map((video) => video.uploadedAt);
    makeUploadTime(uploadedAt, uploadedArray, randomArray);
    videos.forEach((video, index) => {
      video.pastDate = uploadedArray[index];
      video.random = randomArray[index];
      video.save();
    })
    videos.sort((a, b) => {
      return b.random - a.random;
    })
    arrayObject.videos = videos;
    res.json(videos);
  } catch (error) {
    console.log(error);
    res.status(400);
  } finally {
    res.end();
  }
}