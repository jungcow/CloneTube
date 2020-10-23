const column = document.getElementById('jsLoginColumn');


const originHtml = column.innerHTML;

const closeMenu = () => {
  column.classList.add('close');
  column.classList.remove('open');
  column.removeEventListener('click', closeMenu);
  column.addEventListener('click', openMenu);
}

const openMenu = () => {
  column.classList.add('open');
  column.innerHTML = originHtml;
  column.classList.remove('close');
  column.removeEventListener('click', openMenu);
  column.addEventListener('click', closeMenu);
}


const changeMenu = () => {
  if (window.innerWidth <= 768) {
    column.innerHTML = '<i class="fas fa-bars"></i>';
    column.addEventListener('click', openMenu);
  } else {
    column.innerHTML = originHtml;
    column.addEventListener('click', closeMenu);
    column.removeEventListener('click', closeMenu);
  }
}

function init() {
  window.addEventListener('resize', changeMenu);
  changeMenu();
}
init();