import axios from 'axios';
import getBlobDuration from 'get-blob-duration';

const videoBlock = document.getElementById('jsVideoDetailBlock');
let videoBoxContainer;
let videoBox;
let videoPlayer;
let videoControllContainer;
let videoControlBar;
let durationInput;
let fillDurationInput;
let playBtn;
let volumeBtn;
let volumeInput;
let fullscreenBtn;
let videoTime;
let videoDuration;

const addViews = () => {
  const views = document.getElementById('jsViews');
  let viewNumber = parseInt(views.innerText);
  views.innerText = `${viewNumber + 1}`;
}

const requestView = async () => {
  const id = window.location.href.split('/video/')[1];
  const response = await axios({
    url: `/api/${id}/view`,
    method: 'GET',
  })
  if (response.status === 150) {
    return addViews()
  }
}


const handleDurationChange = () => {
  videoPlayer.currentTime = durationInput.value;
  fillDurationInput.style.width = `${(durationInput.value * 100) / durationInput.max}%`;
  videoTime.innerText = makeDurationTime(videoPlayer.currentTime);
}

const showVolumeBtn = () => {
  if (volumeInput.value > 0.8) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else if (volumeInput.value > 0.2 && volumeInput.value <= 0.8) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>'
  } else if (volumeInput.value > 0 && volumeInput.value <= 0.2) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>'
  } else if (volumeInput.value === 0) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>'
  }
}

const handleVolumeChange = () => {
  videoPlayer.volume = volumeInput.value;
  showVolumeBtn();
}

const handlePlayBtn = () => {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
}

const handleVolumeBtn = () => {
  if (!videoPlayer.muted) {
    videoPlayer.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  } else {
    videoPlayer.muted = false;
    showVolumeBtn();
  }
}


const handleExitFullScreen = () => {
  let exitFullscreen =
    document.webkitExitFullscreen ||
    document.mozCancelFullscreen ||
    document.msExitFullscreen;
  exitFullscreen.call(document);
  fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
  videoBox.style.height = '';
  videoPlayer.style.height = "";
  videoPlayer.style.maxHeight = "72vh";
  fullscreenBtn.removeEventListener("click", handleExitFullScreen);
  fullscreenBtn.addEventListener("click", handleGoFullScreen);
}

const handleGoFullScreen = () => {
  let requestFullscreen =
    videoBoxContainer.webkitRequestFullscreen ||
    videoBoxContainer.mozRequestFullscreen ||
    videoBoxContainer.msRequestFullscreen;
  requestFullscreen.call(videoBoxContainer);
  fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
  videoBox.style.height = "100%";
  videoPlayer.style.height = "100%";
  videoPlayer.style.maxHeight = "100%";
  fullscreenBtn.removeEventListener("click", handleGoFullScreen);
  fullscreenBtn.addEventListener("click", handleExitFullScreen);
}

// <?xml version="1.0" encoding="UTF-8"?>
// <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
// <CORSRule>
//     <AllowedOrigin>*</AllowedOrigin>
//     <AllowedMethod>GET</AllowedMethod>
//     <MaxAgeSeconds>3000</MaxAgeSeconds>
//     <AllowedHeader>Authorization</AllowedHeader>
// </CORSRule>
// </CORSConfiguration>

const makeDurationTime = (duration) => {
  console.log('calculating');
  const durationTime = parseInt(duration, 10);
  let time, hours, minutes, seconds;
  if (durationTime < 3600) {
    minutes = parseInt(durationTime / 60, 10);
    seconds = durationTime % 60;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    time = `${minutes}:${seconds}`;
    console.log(time);
    return time;
  }
  hours = parseInt(durationTime / 3600, 10);
  let temp = durationTime % 3600;
  minutes = parseInt(temp / 60, 10);
  seconds = temp % 60;
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  time = `${hours}:${minutes}:${seconds}`;
  console.log(time);
  return time;
}

let timer;
const handleVideoPlaying = async () => {
  const blob = await fetch(videoPlayer.src).then(res => res.blob());
  const duration = await getBlobDuration(blob);
  timer = setInterval(() => {
    durationInput.value = videoPlayer.currentTime;
    fillDurationInput.style.width = `${videoPlayer.currentTime * 100 / duration
      }%`;
    videoTime.innerText = `${makeDurationTime(videoPlayer.currentTime)}`;
  }, 10);
  playBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

const handleVideoPaused = () => {
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
  clearInterval(timer);
}

const handleVideoEnded = () => {
  videoPlayer.currentTime = 0;
  videoPlayer.play();
  requestView();
}

const handleLoaded = async () => {
  const blob = await fetch(videoPlayer.src).then(res => {
    videoDuration.innerText = 'loading';
    return res.blob();
  });
  const duration = await getBlobDuration(blob);
  const DURATION = makeDurationTime(parseInt(duration));
  videoDuration.innerText = DURATION;
  durationInput.value = videoPlayer.currentTime;
  durationInput.max = duration;
  fillDurationInput.style.width = `${(durationInput.value * 100) / durationInput.max}%`;
  volumeInput.max = 1;
  volumeInput.value = 0.5;
}

const handleKeyPressed = (e) => {
  if (e.code === ' ' || e.code === "Space") {
    if (videoPlayer.paused) {
      videoPlayer.play();
      playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      videoPlayer.pause();
      playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
  }
}
let timeFunction;
const handleMouseMove = () => {
  videoControllContainer.classList.add("showing");
  videoControllContainer.classList.remove("none");
  videoBoxContainer.style.cursor = "default";
  clearTimeout(timeFunction);
  timeFunction = setTimeout(() => {
    videoControllContainer.classList.remove("showing");
    videoControllContainer.classList.add("none");
    videoBoxContainer.style.cursor = "none";
  }, 2000);
}

function init() {
  videoPlayer.volume = 0.5;
  videoBoxContainer.addEventListener('mousemove', handleMouseMove);
  // videoPlayer.addEventListener('loadedmetadata', handleLoaded);
  document.addEventListener('readystatechange', handleLoaded);
  videoPlayer.addEventListener('play', handleVideoPlaying);
  videoPlayer.addEventListener('pause', handleVideoPaused);
  videoPlayer.addEventListener('ended', handleVideoEnded);
  durationInput.addEventListener('input', handleDurationChange);
  volumeInput.addEventListener('input', handleVolumeChange);
  playBtn.addEventListener('click', handlePlayBtn);
  volumeBtn.addEventListener('click', handleVolumeBtn);
  fullscreenBtn.addEventListener('click', handleGoFullScreen);
  document.addEventListener('keypress', handleKeyPressed);
}

if (videoBlock) {
  videoBoxContainer = document.querySelector('.videoBoxContainer');
  videoBox = document.querySelector('.videoBox');
  videoPlayer = videoBox.querySelector('video');

  videoControllContainer = document.getElementById('jsVideoControlBar');
  videoControlBar = videoControllContainer.querySelector('.video-controlBar');

  durationInput = document.querySelector('.durationInput');
  volumeInput = document.querySelector('.volumeInput');
  fillDurationInput = document.querySelector('.fill');
  videoTime = document.querySelector('.time__current');
  videoDuration = document.querySelector('.time__duration');

  playBtn = videoControlBar.querySelector('.playBtn');
  volumeBtn = videoControlBar.querySelector('.volumeBtn');
  fullscreenBtn = videoControlBar.querySelector('.fullscreenBtn');
  init();
}

