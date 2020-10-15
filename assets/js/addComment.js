import axios from 'axios';
const commentForm = document.getElementById('jsCommentForm');
const commentList = document.getElementById('jsCommentList');
const commentNumber = document.getElementById('jsCommentNumber');

// const makeOptionBox = () => {
//   const optionBox = document.createElement('div');
//   const updateSpan = document.createElement('span');
//   const deleteSpan = document.createElement('span');
//   updateSpan.innerText = '수정';
//   deleteSpan.innerText = '삭제';
//   optionBox.appendChild(updateSpan);
//   optionBox.appendChild(deleteSpan);
//   // optionBox.classList.add('unshowing');
//   return optionBox;
// }

const addComment = (comment, name, avatarUrl) => {
  const li = document.createElement('li');
  const commentContainer = document.createElement('div');
  commentContainer.className = 'comment__comment-container';
  // 첫번쨰 column
  const firstCommentColumn = document.createElement('div');
  firstCommentColumn.className = 'comment__column';

  const creatorAvatarImg = document.createElement('img');
  if (avatarUrl.startsWith('upload')) {
    creatorAvatarImg.src = `/${avatarUrl}`;
  } else {
    creatorAvatarImg.src = avatarUrl;
  }
  const contentContainer = document.createElement('div');
  contentContainer.className = 'comment__content-container';
  const creatorName = document.createElement('span');
  creatorName.className = 'comment__creator-name';
  creatorName.innerText = name;
  const commentMessage = document.createElement('span');
  commentMessage.className = 'comment__comment';
  commentMessage.innerText = comment;
  const commentBtnContainer = document.createElement('div');
  commentBtnContainer.className = 'comment__button-container';
  const btnLike = document.createElement('button');
  const btnHate = document.createElement('button');
  const btnReply = document.createElement('button');
  btnLike.innerHTML = '<i class="fas fa-thumbs-up"></i>';
  btnHate.innerHTML = '<i class="fas fa-thumbs-down"></i>';
  btnReply.innerText = '답글';
  btnLike.className = 'btn-like';
  btnHate.className = 'btn-hate';
  btnReply.className = 'btn-reply';
  commentBtnContainer.appendChild(btnLike);
  commentBtnContainer.appendChild(btnHate);
  commentBtnContainer.appendChild(btnReply);
  contentContainer.appendChild(creatorName);
  contentContainer.appendChild(commentMessage);
  contentContainer.appendChild(commentBtnContainer);
  firstCommentColumn.appendChild(creatorAvatarImg);
  firstCommentColumn.appendChild(contentContainer);
  // 두번째 column
  const secondCommentColumn = document.createElement('div');
  secondCommentColumn.className = 'comment__column'
  const btnEllipsis = document.createElement('button');
  btnEllipsis.className = 'comment__menu-box';
  btnEllipsis.innerHTML = '<i class="fas fa-ellipsis-v"></i>';
  const optionBox = document.createElement('div');
  optionBox.className = 'comment__option-box';
  const updateOption = document.createElement('span');
  const deleteOption = document.createElement('span');
  updateOption.innerText = '수정';
  deleteOption.innerText = '삭제';

  optionBox.appendChild(updateOption);
  optionBox.appendChild(deleteOption);
  secondCommentColumn.appendChild(btnEllipsis);
  secondCommentColumn.appendChild(optionBox);
  commentContainer.appendChild(firstCommentColumn);
  commentContainer.appendChild(secondCommentColumn);
  li.id = Date.now().toString(36) + Math.random().toString(36).slice(3);
  console.log(li.id);
  li.appendChild(commentContainer);
  commentList.prepend(li);
}

// const addComment = (comment) => {
//   const li = document.createElement('li');
//   const commentSpan = document.createElement('span');
//   const menuBox = document.createElement('div');
//   const optionBox = makeOptionBox();
//   menuBox.innerHTML = '<i class="fas fa-ellipsis-v"></i>';
//   menuBox.appendChild(optionBox);
//   commentSpan.innerHTML = comment;
//   li.appendChild(commentSpan);
//   li.appendChild(menuBox);
//   commentList.prepend(li);
// }


const requestComment = async (comment) => {
  const id = window.location.href.split('/video/')[1];
  const URL = `/api/${id}/comment`;
  const response = await axios({
    url: URL,
    method: 'POST',
    data: {
      comment
    }
  });
  const responseCreator = await axios({
    url: URL,
    method: 'GET'
  })
  if (response.status === 200 && responseCreator.status === 200) {
    const name = responseCreator.data.name;
    const avatarUrl = responseCreator.data.avatarUrl;
    return addComment(comment, name, avatarUrl);
  }
}


const handleCommentSubmit = (event) => {
  event.preventDefault();
  const commentInput = commentForm.querySelector("textarea");
  const comment = commentInput.value;
  requestComment(comment);
  commentInput.value = '';
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
}

function init() {
  commentForm.addEventListener('submit', handleCommentSubmit);
}

if (commentForm) {
  init();
}