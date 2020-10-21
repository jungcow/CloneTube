import Video from '../models/Video';
import User from '../models/User';
import Comment from '../models/Comment';
import routes from '../routes';

export const makeUploadTime = (array, receivedArray) => {
  array.forEach((time) => {
    const elapsed = new Date() - new Date(time);
    if (elapsed > 31.536e9) {
      time = `${parseInt(elapsed / 31.536e9)}년 전`;
    } else if (elapsed <= 31.536e9 && elapsed > 2.592e9) {
      time = `${parseInt(elapsed / 2.592e9)}개월 전`;
    } else if (elapsed <= 2.592e9 && elapsed > 8.64e7) {
      time = `${parseInt(elapsed / 8.64e7)}일 전`;
    } else if (elapsed <= 8.64e7 && elapsed > 3.6e6) {
      time = `${parseInt(elapsed / 3.6e6)}시간 전`;
    } else if (elapsed <= 3.6e6 && elapsed > 60000) {
      time = `${parseInt(elapsed / 60000)}분 전`
    } else if (elapsed <= 60000 && elapsed > 1000) {
      time = `${parseInt(elapsed / 1000)}초 전`;
    } else {
      time = '방금 전';
    }
    receivedArray.push(time);
  })
}

export const home = async (req, res) => {
  try {
    let uploadedArray = [];
    const videos = await Video.find({}).sort({ _id: -1 }).populate('creator');
    const uploadedAt = videos.map((video) => video.uploadedAt);
    makeUploadTime(uploadedAt, uploadedArray);
    res.render('home', { videos, uploadedArray });
  } catch (error) {
    console.log(error);
  }
}

export const search = async (req, res) => {
  const { query: { term } } = req;
  try {
    let videos = [];
    let uploadedArray = [];
    videos = await Video.find({ title: { $regex: term, $options: 'i' } }).sort({ _id: -1 }).populate('creator');
    const creators = await User.find({ name: { $regex: term, $options: 'i' } });
    creators.forEach(creator => videos.concat(creator.videos));
    const uploadedAt = videos.map((video) => video.uploadedAt);
    makeUploadTime(uploadedAt, uploadedArray);
    res.render('search', { videos, term, creators, uploadedArray });
  } catch (error) {
    console.log(error);
  }
}

export const videoDetail = async (req, res) => {
  const { params: { id }, user } = req;
  try {
    let uploadedArray = [];
    const video = await Video.findById(id).populate('creator').populate({
      path: 'comments',
      populate: { path: 'creator' }
    });
    console.log(video.comments.length);
    video.comments.forEach((comment) => console.log(comment.uniqueId));
    const recommendVideos = await Video.find({}).populate('creator');
    const uploadedAt = recommendVideos.map((video) => video.uploadedAt);
    makeUploadTime(uploadedAt, uploadedArray);
    res.render('videoDetail', { video, recommendVideos, uploadedArray });
  } catch (error) {
    console.log(error);
    //no video   Error
    req.flash('accessError', '잘못된 접근입니다');
    res.redirect(routes.home);
  }
}

export const getUpload = (req, res) => {
  res.render('upload');
}
export const postUpload = async (req, res) => {
  const { body: { title, description }, file: { path } } = req;
  try {
    const newVideo = await Video.create({
      title,
      description: description || '.',
      fileUrl: path,
      creator: req.user.id,
    });
    req.user.videos.push(newVideo.id)
    req.user.save();
    req.flash('info', '성공적으로 업로드 하였습니다');
    res.redirect(`/video/${routes.videoDetail(newVideo.id)}`);
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
    res.render('editVideo', { video });
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