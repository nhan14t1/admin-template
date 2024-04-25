const initEvents = () => {
  // search-box open close js code
  let navbar = document.querySelector(".navbar");
  let searchBox = document.querySelector(".search-box .bx-search");

  if (searchBox) {
    searchBox.addEventListener("click", () => {
      navbar.classList.toggle("showInput");
    });
  }

  // sidebar open close js code
  let navLinks = document.querySelector(".nav-links");
  let menuOpenBtn = document.querySelector(".navbar .bx-menu");
  let menuCloseBtn = document.querySelector(".nav-links .btn-close-menu");
  
  // No top navbar
  if (!menuOpenBtn) {
    return;
  }

  menuOpenBtn.onclick = function () {
    navLinks.style.left = "0";
  }

  menuCloseBtn.onclick = function () {
    navLinks.style.left = "-100%";
  }

  // sidebar submenu open close js code
  let show1Arrow = document.querySelector(".show1-arrow");
  if (show1Arrow) {
    show1Arrow.onclick = function () {
      navLinks.classList.toggle("show1");
    }
  }

  let show2Arrow = document.querySelector(".show2-arrow");
  if (show2Arrow) {
    show2Arrow.onclick = function () {
      navLinks.classList.toggle("show2");
    }
  }

  let show3Arrow = document.querySelector(".show3-arrow");
  if (show3Arrow) {
    show3Arrow.onclick = function () {
      navLinks.classList.toggle("show3");
    }
  }

  // Need to fix when applying show more
  let moreArrow = document.querySelector(".more-arrow");
  if (moreArrow) {
    moreArrow.onclick = function () {
      navLinks.classList.toggle("show-more");
    }
  }
}

document.addEventListener('DOMContentLoaded', initEvents);
