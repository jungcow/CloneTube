const videoBlock = Array.from(document.querySelectorAll('.videoBlock'));

function handleResize() {
  videoBlock.forEach(e => {
    const videoBox = e.querySelector('.videoBox');
    const video = videoBox.querySelector('video');
    video.width = videoBox.clientWidth;
    video.height = video.width * 0.5625;
  })
}

function init() {
  videoBlock.forEach((e) => {
    const videoBox = e.querySelector('.videoBox');
    const video = videoBox.querySelector('video');
    video.width = videoBox.clientWidth;
    video.height = video.width * 0.5625;
    window.addEventListener('resize', handleResize);
  })
}

init();