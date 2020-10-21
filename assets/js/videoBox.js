const videoBlock = Array.from(document.querySelectorAll('.videoBlock'));
const searchVideoBlock = Array.from(document.querySelectorAll('.searchVideoBlock'));

let mouseTimer;

function handleResize() {
  videoBlock.forEach(e => {
    const videoBox = e.querySelector('.videoBox');
    const video = videoBox.querySelector('video');
    video.width = videoBox.clientWidth;
    video.height = video.width * 0.5625;
  })
}

function handleSearchResize() {
  searchVideoBlock.forEach(e => {
    const videoBox = e.querySelector('.videoBox');
    const video = videoBox.querySelector('video');
    video.width = videoBox.clientWidth;
    video.height = video.width * 0.5625;
  })
}


const mouseenter = (video) => {
  console.log('hover');
  video.muted = true;
  video.autoplay = true;
  video.load();
  mouseTimer = setTimeout(() => {
    console.log('finish');
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

function init() {
  videoBlock.forEach((e) => {
    const videoBox = e.querySelector('.videoBox');
    const video = videoBox.querySelector('video');
    video.width = videoBox.clientWidth;
    video.height = video.width * 0.5625;
    window.addEventListener('resize', handleResize);
    if (searchVideoBlock.length === 0) {
      e.addEventListener('mouseenter', () => {
        mouseenter(video);
      });
      e.addEventListener('mouseleave', () => {
        mouseleave(video);
      })
      e.addEventListener('click', (event) => {
        goVideoDetail(event, e);
      });
    }
  })

  searchVideoBlock.forEach((e) => {
    const videoBox = e.querySelector('.videoBox');
    const video = videoBox.querySelector('video');
    video.width = videoBox.clientWidth;
    video.height = video.width * 0.5625;
    window.addEventListener('resize', handleSearchResize);
  })
}

if (videoBlock || searchVideoBlock) {
  init();
}