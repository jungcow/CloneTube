import Video from '../models/Video';
import Comment from '../models/Comment';
import routes from '../routes';

export const getIsLoggedIn = async (req, res) => {
  try {
    if (!req.user) {
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
    res.end();
  }
}

export const isCommentCreator = async (req, res) => {
  const { body: { uniqueId }, user } = req;
  try {
    if (!req.user) {
      res.redirect(routes.login);
      throw Error('No User');
    }
    const comment = await Comment.findOne({ uniqueId }).populate('creator');
    if (comment.creator.id === user.id) {
      console.log('success');
      res.status(200);
    } else {
      console.log('not match');
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
    console.log(video);
    video.views += 1;
    console.log(video.views);
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
  console.log('postAddComment');
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
  } catch (error) {
    console.log(error);
    res.status(400);
    res.redirect(`/video${routes.videoDetail(id)}`);
  } finally {
    res.end();
  }
}

export const postDeleteComment = async (req, res) => {
  const { params: { id }, body: { uniqueId }, user } = req;
  try {
    const video = await Video.findById(id).populate('comments');
    const comment = await Comment.findOne({ uniqueId });
    await Comment.findOneAndRemove({ uniqueId });
    const index = video.comments.indexOf(comment.id);
    video.comments.splice(index, 1);
    video.save();
  } catch (error) {
    console.log(error);
    //flash error message
    res.status(400);
  } finally {
    res.end();
  }
}