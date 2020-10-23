import axios from 'axios';

const infiniteScrollContainer = document.querySelector('.video-container');
const main = document.querySelector('.main');

let page = 0;
let status = true;
let mouseTimer;


const mouseenter = (video) => {
  video.muted = true;
  video.autoplay = true;
  video.load();
  mouseTimer = setTimeout(() => {
    video.currentTime = 0;
    video.autoplay = false;
    video.load();
  }, 5000);
}

const mouseleave = (video) => {
  clearTimeout(mouseTimer);
  video.muted = true;
  video.autoplay = false;
  video.load();
}

const getVideoId = (videoBlock) => {
  const video = videoBlock.querySelector('video');
  const videoId = video.id;
  const url = `${window.location.href}video/${videoId}`;
  return url;
}

const goVideoDetail = (event, block) => {
  if (event.target.id !== 'jsVideoCreator') {
    const link = document.createElement('a');
    const url = getVideoId(block);
    link.href = url;
    link.click();
  }
}

function handleResize(videoBox, video) {
  video.width = videoBox.clientWidth;
  video.height = video.width * 0.5625;
}

const addVideos = (videos) => {
  videos.forEach(video => {
    const id = video._id,
      fileUrl = video.fileUrl,
      title = video.title,
      views = video.views,
      uploadedAt = video.pastDate,
      creatorId = video.creator._id,
      creatorName = video.creator.name,
      creatorAvatarUrl = video.creator.avatarUrl;
    const videoBlock = document.createElement('div');
    videoBlock.className = 'videoBlock';

    const videoBox = document.createElement('div');
    videoBox.className = 'videoBox';
    const inVideo = document.createElement('VIDEO');
    inVideo.id = id;
    inVideo.src = `/${fileUrl}`;
    videoBox.appendChild(inVideo);
    videoBlock.appendChild(videoBox);

    const videoExplanation = document.createElement('div');
    videoExplanation.className = 'video-explanation';

    const videoExplanationColumn1 = document.createElement('div');
    videoExplanationColumn1.className = 'video-explanation__column';
    videoExplanationColumn1.id = 'jsVideoCreator';

    const creatorLink = document.createElement('a');
    creatorLink.href = `/user/${creatorId}`;
    const videoCreatorAvatar = document.createElement('div');
    videoCreatorAvatar.className = 'video-creator__avatar';
    if (creatorAvatarUrl) {
      const img = new Image();
      if (creatorAvatarUrl.startsWith('upload')) {
        img.src = `/${creatorAvatarUrl}`;
      } else {
        img.src = creatorAvatarUrl;
      }
      videoCreatorAvatar.appendChild(img);
    } else if (creatorName) {
      const videoImg = document.createElement('div');
      videoImg.className = 'video__img';
      videoCreatorAvatar.appendChild(videoImg);
    }
    creatorLink.appendChild(videoCreatorAvatar);
    videoExplanationColumn1.appendChild(creatorLink);

    const videoExplanationColumn2 = document.createElement('div');
    videoExplanationColumn2.className = 'video-explanation__column';

    const videoTitle = document.createElement('div');
    videoTitle.className = 'video-title';
    const videoTitleSpan = document.createElement('h4');
    videoTitleSpan.innerText = title;
    videoTitle.appendChild(videoTitleSpan);

    const videoTitleBelow = document.createElement('div');
    videoTitleBelow.className = 'video-title__below';

    if (creatorName) {
      const videoCreatorName = document.createElement('h5');
      videoCreatorName.className = 'video-creator__name';
      videoCreatorName.innerText = creatorName;
      videoTitleBelow.appendChild(videoCreatorName);
    }
    const videoViewsAndTime = document.createElement('div');
    videoViewsAndTime.className = 'video-explanation__viewsAndTime';
    const videoViews = document.createElement('h6');
    videoViews.className = 'video-views';
    videoViews.innerText = `조회수 ${views}회`;
    const blank = document.createElement('h6');
    blank.innerText = ` • `;
    const videoUploadedAt = document.createElement('h6');
    videoUploadedAt.className = 'video-uploadedAt';
    videoUploadedAt.innerText = uploadedAt;
    videoViewsAndTime.appendChild(videoViews);
    videoViewsAndTime.appendChild(blank);
    videoViewsAndTime.appendChild(videoUploadedAt);
    videoTitleBelow.appendChild(videoViewsAndTime);

    videoExplanationColumn2.appendChild(videoTitle);
    videoExplanationColumn2.appendChild(videoTitleBelow);

    videoExplanation.appendChild(videoExplanationColumn1);
    videoExplanation.appendChild(videoExplanationColumn2);

    videoBlock.appendChild(videoExplanation);
    infiniteScrollContainer.appendChild(videoBlock);

    //Set video width & height
    //0.5625는 화면비 16 : 9를 맞추기 위한 비율이다.
    inVideo.width = videoBox.clientWidth;
    inVideo.height = inVideo.width * 0.5625;
    window.addEventListener('resize', () => {
      handleResize(videoBox, inVideo);
    });
    //event
    videoBlock.addEventListener('click', (event) => {
      goVideoDetail(event, videoBlock);
    });
    videoBlock.addEventListener('mouseenter', () => {
      mouseenter(inVideo);
    })
    videoBlock.addEventListener('mouseleave', () => {
      mouseleave(inVideo);
    })
  })

}

const requestMoreVideo = async (page) => {
  page += 1;
  const URL = '/api/moreVideos';
  const response = await axios({
    url: URL,
    method: 'POST',
    data: { page }
  })
  if (response.status === 200) {
    addVideos(response.data);
  }
}


const handleSrcoll = () => {
  const wholeHeight = main.scrollHeight;
  const scrolledHeight = window.scrollY;
  const browserHeight = window.innerHeight;
  const x = wholeHeight - (scrolledHeight + browserHeight);
  if (x < 0) {
    if (status) {
      requestMoreVideo(page);
      status = false;
    }
    status = true;
  }
}

function init() {
  window.addEventListener('scroll', handleSrcoll);
}

init();