const recordContainer = document.querySelector('.record-video__container');
const recordBtn = document.getElementById('jsRecordBtn');
const recordPreview = document.getElementById('jsRecordPreview');


let videoRecorder;
let chuncks = [];
let timer = 0;
let recordTimer;
let recordingBtn;


const handleStopped = () => {
  clearInterval(recordTimer);
  timer = 0;
  const videoFile = new Blob(chuncks);
  recordBtn.removeEventListener('click', stopRecord);
  recordBtn.addEventListener('click', getRecord);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(videoFile);
  link.download = 'CloneTube_record.webm';
  recordingBtn.innerHTML = '녹화 영상 다운받기';
  recordingBtn.style.backgroundColor = '#2980b9';
  link.appendChild(recordingBtn);
  recordContainer.appendChild(link);
}

const stopRecord = () => {
  videoRecorder.stop();
  videoRecorder.addEventListener('stop', handleStopped);
  recordContainer.removeChild(recordingBtn);
  recordBtn.innerText = "바로 녹화하기";
}

let dataUrl;

const handleVideoData = async (e) => {
  chuncks.push(e.data);
}

const handleStarted = () => {
  recordingBtn = document.createElement('button');
  const redCircle = document.createElement('div');
  const timerSpan = document.createElement('span');
  recordingBtn.className = 'timerBtn';
  redCircle.className = 'redCircle';
  timerSpan.className = 'timerSpan';
  recordingBtn.appendChild(redCircle);
  recordingBtn.appendChild(timerSpan);
  recordContainer.appendChild(recordingBtn)
  recordTimer = setInterval(() => {
    timerSpan.innerText = `${++timer}초`;
  }, 1000);
}

const startRecording = (stream) => {
  videoRecorder = new MediaRecorder(stream);
  videoRecorder.start(1000);
  videoRecorder.addEventListener('start', handleStarted);
  videoRecorder.addEventListener('dataavailable', handleVideoData);
  recordBtn.addEventListener('click', stopRecord);
}

const getRecord = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 1280, height: 720 },
    });
    recordPreview.srcObject = stream;
    recordPreview.play();
    recordPreview.muted = true;
    recordBtn.innerText = "녹화 중단하기";
    startRecording(stream);
  } catch (error) {
    console.log(error);
    alert(error.message);
    recordBtn.innerText = "Can't record";
  } finally {
    recordBtn.removeEventListener('click', getRecord);
  }
}

function init() {
  recordBtn.addEventListener('click', getRecord);
}


if (recordPreview) {
  init();
}