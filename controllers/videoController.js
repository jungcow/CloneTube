import Video from '../models/Video';
import User from '../models/User';
import Comment from '../models/Comment';
import routes from '../routes';


export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render('home', { videos });
  } catch (error) {
    console.log(error);
  }
}

export const search = async (req, res) => {
  const { query: { term } } = req;
  try {
    let videos = [];
    const creators = await User.find({ name: { $regex: term, $options: 'i' } });
    videos = await Video.find({ title: { $regex: term, $options: 'i' } }).sort({ _id: -1 }).populate('creator');
    creators.forEach(creator => videos.concat(creator.videos));
    res.render('search', { videos, term, creators });
  } catch (error) {
    console.log(error);
  }
}

export const videoDetail = async (req, res) => {
  const { params: { id }, user } = req;
  try {
    const video = await Video.findById(id).populate('creator').populate({
      path: 'comments',
      populate: { path: 'creator' }
    });
    console.log(video);
    res.render('videoDetail', { video });
  } catch (error) {
    console.log(error);
    //no video   Error
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
    res.redirect(`/video/${routes.videoDetail(id)}`);
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
    protectVideo(req);
    await Video.findByIdAndRemove(id);
    const user = await User.findById(req.user.id);
    if (user.videos.includes(id)) {
      const index = user.videos.indexOf(id);
      await user.videos.splice(index, 1);
      user.save();
    }
  } catch (error) {
    console.log(error);
  } finally {
    res.redirect(routes.home);
  }

}