const button = document.getElementById('jsRecordBtn');
const btnContainer = document.querySelector('.record-video__container');

document.getElementById('jsVideoPreview').addEventListener('change', function (event) {
  var file = event.target.files[0];
  var fileReader = new FileReader();
  if (file.type.match('image')) {
    fileReader.onload = function () {
      var img = document.createElement('img');
      img.src = fileReader.result;
      document.querySelector('.preview').innerHTML = '';
      document.querySelector('.preview').appendChild(img);
    };
    fileReader.readAsDataURL(file);
  } else {
    fileReader.onload = function () {
      var blob = new Blob([fileReader.result], { type: file.type });
      var url = URL.createObjectURL(blob);
      var video = document.createElement('video');
      var timeupdate = function () {
        if (snapImage()) {
          video.removeEventListener('timeupdate', timeupdate);
          video.pause();
        }
      };
      video.addEventListener('loadeddata', function () {
        if (snapImage()) {
          video.removeEventListener('timeupdate', timeupdate);
        }
      });
      var snapImage = function () {
        var canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        var image = canvas.toDataURL();
        var success = image.length > 100000;
        if (success) {
          var img = document.createElement('img');
          img.src = image;
          document.querySelector('.preview').innerHTML = '';
          document.querySelector('.preview').appendChild(img);
          if (button) {
            btnContainer.removeChild(button);
          }
          URL.revokeObjectURL(url);

        }
        return success;
      };
      video.addEventListener('timeupdate', timeupdate);
      video.preload = 'metadata';
      video.src = url;
      // Load video in Safari / IE11
      video.muted = true;
      video.playsInline = true;
      video.play();
    };
    fileReader.readAsArrayBuffer(file);
  }
});