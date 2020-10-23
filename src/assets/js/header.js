const youtubeSpan = document.getElementById('jsResize');

const originHtml = youtubeSpan.innerHTML;

// const closeMenu = () => {
//   column.classList.add('close');
//   column.classList.remove('open');
//   column.removeEventListener('click', closeMenu);
//   column.addEventListener('click', openMenu);
// }

// const openMenu = () => {
//   column.classList.add('open');
//   column.innerHTML = originHtml;
//   column.classList.remove('close');
//   column.removeEventListener('click', openMenu);
//   column.addEventListener('click', closeMenu);
// }


const changeMenu = () => {
  if (window.innerWidth <= 768) {
    youtubeSpan.innerHTML = '<i class="fab fa-youtube"></i>';
  } else {
    youtubeSpan.innerHTML = originHtml;
  }
}

function init() {
  window.addEventListener('resize', changeMenu);
  changeMenu();
}
init();