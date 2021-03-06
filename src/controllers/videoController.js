import mongoose from 'mongoose';
import Video from '../models/Video';
import User from '../models/User';
import Comment from '../models/Comment';
import routes from '../routes';
import { pageInVideos } from './apiController';

export const makeUploadTime = (array, receivedArray, randomArray) => {
  const hour = 3.6e6;
  const date = 8.64e7;
  const week = date * 7;
  const month = date * 30;
  const year = month * 12;
  let random;
  array.forEach((time) => {
    const elapsed = new Date() - new Date(time);
    if (elapsed > year) {
      time = `${parseInt(elapsed / year)}년 전`;
      random = elapsed + 2 * year * Math.random();
    } else if (elapsed <= year && elapsed > month) {
      time = `${parseInt(elapsed / month)}개월 전`;
      random = elapsed + 10 * month * Math.random();
    } else if (elapsed <= month && elapsed > week) {
      time = `${parseInt(elapsed / week)}주 전`;
      random = elapsed + 10 * week * Math.random();
    } else if (elapsed <= week && elapsed > date) {
      time = `${parseInt(elapsed / date)}일 전`;
      random = elapsed + 10 * date * Math.random();
    } else if (elapsed <= date && elapsed > hour) {
      time = `${parseInt(elapsed / hour)}시간 전`;
      random = elapsed + 20 * hour * Math.random();
    } else if (elapsed <= hour && elapsed > 60000) {
      time = `${parseInt(elapsed / 60000)}분 전`
      random = elapsed + 6 * hour * Math.random();
    } else if (elapsed <= 60000 && elapsed > 1000) {
      time = `${parseInt(elapsed / 1000)}초 전`;
      random = elapsed + 1 * hour * Math.random();
    } else {
      time = '방금 전';
      random = 0;
    }
    receivedArray.push(time);
    if (randomArray) {
      randomArray.push(parseInt(random));
    }
  })
}


export const home = async (req, res) => {
  try {
    let uploadedArray = [];
    let randomArray = [];
    const videos = await Video.find({}).sort({ _id: -1 }).limit(pageInVideos).populate('creator');
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
    res.render('home', { videos, pageTitle: '홈' });
  } catch (error) {
    console.log(error);
  }
}

export const search = async (req, res) => {
  const { query: { term } } = req;
  try {
    let videos = [];
    let uploadedArray = [];
    let randomArray = [];
    videos = await Video.find({ title: { $regex: term, $options: 'i' } }).sort({ _id: -1 }).populate('creator');
    const creators = await User.find({ name: { $regex: term, $options: 'i' } });
    creators.forEach(creator => videos.concat(creator.videos));
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
    res.render('search', { videos, term, creators, pageTitle: '검색' });
  } catch (error) {
    console.log(error);
  }
}

export const videoDetail = async (req, res) => {
  const { params: { id }, user } = req;
  try {
    let uploadedArray = [];
    let randomArray = [];
    const video = await Video.findById(id).populate('creator').populate({
      path: 'comments',
      populate: { path: 'creator' }
    });
    const recommendVideos = await Video.find({}).limit(8).populate('creator');
    const uploadedAt = recommendVideos.map((a) => a.uploadedAt);
    makeUploadTime(uploadedAt, uploadedArray, randomArray);
    recommendVideos.forEach((a, index) => {
      a.pastDate = uploadedArray[index];
      a.random = randomArray[index];
      a.save();
    });
    recommendVideos.sort((a, b) => {
      return b.random - a.random;
    })
    res.render('videoDetail', { video, recommendVideos, pageTitle: video.title });
  } catch (error) {
    console.log(error);
    req.flash('accessError', '잘못된 접근입니다');
    res.redirect(routes.home);
  }
}

export const getUpload = (req, res) => {
  res.render('upload', { pageTitle: '업로드' });
}
export const postUpload = async (req, res) => {
  const { body: { title, description }, file: { location } } = req;
  try {
    const newVideo = await Video.create({
      title,
      description: description || '.',
      fileUrl: location,
      creator: req.user.id,
    });
    req.user.videos.push(newVideo.id)
    req.user.save();
    req.flash('info', '성공적으로 업로드 하였습니다');
    res.redirect(`/video${routes.videoDetail(newVideo.id)}`);
  } catch (error) {
    console.log(error);
    res.redirect(routes.upload);
  }
}

const protectVideo = (req, res, video = {}) => {
  if (!req.user || req.user.id !== video.creator.toString()) {
    throw Error('Not Creator of this video');
  }
}

export const getEditVideo = async (req, res) => {
  const { params: { id } } = req;
  try {
    const video = await Video.findById(id);
    protectVideo(req, res, video);
    res.render('editVideo', { video, pageTitle: '영상 수정' });
  } catch (error) {
    console.log(error);
    req.flash('accessError', '잘못된 접근입니다');
    res.redirect(`/video${routes.videoDetail(id)}`);
  }
}

export const postEditVideo = async (req, res) => {
  const { params: { id } } = req;
  const { body: { title, description } } = req;
  try {
    await Video.findByIdAndUpdate(id, {
      title,
      description
    });
    req.flash('info', '영상 수정 완료');
    res.redirect(`/video${routes.videoDetail(id)}`);
  } catch (error) {
    console.log(error);
    res.redirect(`/video${routes.editVideo(id)}`);
  }
}

export const deleteVideo = async (req, res) => {
  //To Do: id가 존재하지 않을 때의 오류 처리
  const { params: { id } } = req;
  try {
    const video = await Video.findById(id);
    protectVideo(req, res, video);
    await Video.findByIdAndRemove(id);
    const user = await User.findById(req.user.id);
    if (user.videos.includes(id)) {
      const index = user.videos.indexOf(id);
      await user.videos.splice(index, 1);
      user.save();
    }
    req.flash('info', "성공적으로 영상을 삭제하였습니다");
  } catch (error) {
    req.flash('accessError', '잘못된 접근입니다');
    console.log(error);
  } finally {
    res.redirect(routes.home);
  }

}