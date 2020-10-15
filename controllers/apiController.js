import Video from '../models/Video';
import Comment from '../models/Comment';
import routes from '../routes';

export const postAddComment = async (req, res) => {
  console.log('postAddComment');
  const { params: { id }, body: { comment }, user } = req;
  //ToDo: 로그인 안했을 시 경고창
  try {
    const video = await Video.findById(id);
    const newComment = await Comment.create({
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

export const getAddComment = async (req, res) => {
  const commentCreator = {
    name: req.user.name,
    avatarUrl: req.user.avatarUrl
  }
  res.send(commentCreator);
}