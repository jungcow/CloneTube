import axios from 'axios';
const commentForm = document.getElementById('jsCommentForm');
const commentList = document.getElementById('jsCommentList');
const commentNumber = document.getElementById('jsCommentNumber');
const commentDeleteBtn = Array.from(document.querySelectorAll('.comment__delete'));

const commentArray = [];

const addComment = (comment, id, name, avatarUrl) => {
  const li = document.createElement('li');
  const commentContainer = document.createElement('div');
  commentContainer.className = 'comment__comment-container';
  // 첫번쨰 column
  const firstCommentColumn = document.createElement('div');
  firstCommentColumn.className = 'comment__column';
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
  const creatorAvatarImg = document.createElement('img');
  if (avatarUrl) {
    if (avatarUrl.startsWith('upload')) {
      creatorAvatarImg.src = `/${avatarUrl}`;
    } else {
      creatorAvatarImg.src = avatarUrl;
    }
    firstCommentColumn.appendChild(creatorAvatarImg);
  } else {
    const imgBox = document.createElement('div');
    imgBox.className = 'comment__img';
    imgBox.innerHTML = '<i class="fas fa-user fa-lg"></i>'
    firstCommentColumn.appendChild(imgBox);
  }
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
  li.id = id;
  li.appendChild(commentContainer);
  commentList.prepend(li);
  console.log(commentList);
  deleteOption.addEventListener('click', handleCommentDelete);
}


//Create Comment function
const requestCreator = async () => {
  const responseCreator = await axios({
    url: '/api/isLoggedIn',
    method: 'GET'
  });
  return responseCreator;
}

const requestComment = async (comment, creator) => {
  const id = window.location.href.split('/video/')[1];
  const uniqueId = Math.random().toString(36).slice(3) + Date.now().toString(36);
  const URL = `/api/${id}/comment`;
  const response = await axios({
    url: URL,
    method: 'POST',
    data: {
      comment,
      uniqueId,
    }
  });
  if (response.status === 200) {
    const name = creator.data.name;
    const avatarUrl = creator.data.avatarUrl;
    return addComment(comment, uniqueId, name, avatarUrl);
  }
}




//Delete function
const requestIsCommentCreator = async (uniqueId) => {
  const responseIsCommentCreator = await axios({
    url: '/api/isCommentCreator',
    method: 'POST',
    data: {
      uniqueId
    }
  })
  return responseIsCommentCreator;
}

// const deleteComment = (id) => {
//   const li = Array.from(commentList.childNodes).find(e => e.id = id);
//   console.log(li);
//   commentList.removeChild(li);
//   console.log(commentList);
// }

const requestDeleteComment = async (uniqueId) => {
  const id = window.location.href.split('/video/')[1];
  const URL = `/api/${id}/deleteComment`;
  const response = await axios({
    url: URL,
    method: 'POST',
    data: {
      uniqueId,
    }
  });
  return response;
}

//Handle Event function
const handleCommentSubmit = async (event) => {
  event.preventDefault();
  const commentInput = commentForm.querySelector("textarea");
  const comment = commentInput.value;
  const creator = await requestCreator();
  if (creator.status === 200) {
    requestComment(comment, creator);
  }
  commentInput.value = '';
  commentNumber.innerText = parseInt(commentNumber.innerText, 10) + 1;
}

const handleCommentDelete = async (e) => {
  console.log(e.target.parentNode.parentNode.parentNode.parentNode.id);
  const container = e.target.parentNode.parentNode.parentNode.parentNode;
  const uniqueId = container.id;
  const comment = container.childNodes[0].firstChild.lastChild.childNodes[2].innerText;
  const creator = await requestIsCommentCreator(uniqueId);
  if (creator.status === 200) {
    const deleteResponse = await requestDeleteComment(uniqueId);
    if (deleteResponse.status === 200) {
      commentList.removeChild(container);
      console.log(commentList);
    }
  }
  commentNumber.innerText = parseInt(commentNumber.innerText, 10) - 1;
}

function init() {
  commentDeleteBtn.forEach((btn) => btn.addEventListener('click', handleCommentDelete));
  commentForm.addEventListener('submit', handleCommentSubmit);
}

if (commentForm) {
  init();
}