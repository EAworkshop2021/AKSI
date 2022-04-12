'use strict';

//валидация формы футера
(() => {
  const NUMS_BRACKETS_ONLY = /^\+[7]\([0-9]{3}\)[0-9]{0,8}\d*$/;
  const PHONE_NUMS_ONLY = /\d/g;
  const KEYDOWN_NUMS_ONLY = /\d/;
  const PHONE_LENGTH = 11;
  const TEL_PREFIX = `+7(`;
  const BACKSPACE_KEY = `Backspace`;
  const TAB_KEY = `Tab`;
  const ENTER_KEY = `Enter`;

  const form = document.querySelector(`footer #form`);

  if (!form) {
    return;
  }

  const submitBtn = form.querySelector(`button[type="submit"]`);
  const inputs = form.querySelectorAll(`input`);
  const tel = form.querySelector(`#tel`);
  const username = form.querySelector(`#name`);

  let storedName = localStorage.getItem(`name`);
  let storedTel = localStorage.getItem(`tel`);

  if (storedName) {
    username.value = storedName;
  }
  if (storedTel) {
    tel.value = storedTel;
  }

  if (!tel) {
    return;
  }

  tel.addEventListener(`focus`, () => {

    if (!NUMS_BRACKETS_ONLY.test(tel.value)) {
      tel.value = TEL_PREFIX;
    }
  });

  tel.addEventListener(`keydown`, (evt) => {
    let old = 0;

    if (!KEYDOWN_NUMS_ONLY.test(evt.key)) {
      evt.preventDefault();
      tel.setCustomValidity(`Только цифры!`);
    } else {
      tel.setCustomValidity(``);

      let curLen = tel.value.length;

      if (curLen < old) {
        old--;
        return;
      }
      if (curLen === 2) {
        tel.value = tel.value + `(`;
      }
      if (curLen === 6) {
        tel.value = tel.value + `)`;
      }
      if (curLen > 13) {
        tel.value = tel.value.substring(0, tel.value.length - 1);
      }

      old++;
    }

    if ((evt.key === BACKSPACE_KEY) && (tel.value !== `+7(`)) {
      tel.value = tel.value.substring(0, tel.value.length - 1);
      tel.setCustomValidity(``);
    }
    if (evt.key === TAB_KEY) {
      submitBtn.focus();
      tel.setCustomValidity(``);
    }
    if (evt.key === ENTER_KEY) {
      submitBtn.click();
      tel.setCustomValidity(``);
    }
    tel.reportValidity();
  });

  if (!submitBtn) {
    return;
  }

  submitBtn.addEventListener(`click`, () => {

    for (let input of inputs) {
      if (input.reportValidity() === false) {
        input.classList.add(`input-invalid`);
      } else {
        input.classList.remove(`input-invalid`);
      }
    }

    if (username.value.length === 0) {
      username.setCustomValidity(`Введите имя!`);
    }

    if (tel.value === TEL_PREFIX) {
      tel.setCustomValidity(`Вы не ввели номер телефона!`);
      tel.classList.add(`input-invalid`);
    } else if (tel.value.match(PHONE_NUMS_ONLY).length < PHONE_LENGTH) {
      tel.setCustomValidity(`Номер должен быть длиной ${PHONE_LENGTH} цифр, еще ${PHONE_LENGTH - tel.value.match(PHONE_NUMS_ONLY).length}`);
      tel.classList.add(`input-invalid`);
    } else if (tel.value.match(PHONE_NUMS_ONLY).length > PHONE_LENGTH) {
      tel.setCustomValidity(`Номер должен быть длиной ${PHONE_LENGTH} цифр, введено: ${tel.value.match(PHONE_NUMS_ONLY).length}`);
      tel.classList.add(`input-invalid`);
    } else {
      tel.setCustomValidity(``);
      tel.classList.remove(`input-invalid`);
    }

    localStorage.setItem(`name`, username.value);
    localStorage.setItem(`tel`, tel.value);
  });

})();

//слайдер Команда
(() => {
  const SMALL_SCREEN = 576;
  const LARGE_SCREEN = 1290;
  const GAP_MOB = 47;

  const container = document.querySelector(`.slider-wrapper`);

  const initSlider = () => {
    const slider = container.querySelector(`.slider`);
    const sliderList = container.querySelector(`.slider__list`);
    const sliderItem = container.querySelector(`.slider__item`);
    const sliderItems = container.querySelectorAll(`.slider__item`);
    const sliderBtns = container.querySelector(`.slider__btns`);

    const left = container.querySelector(`.slider__btn--left`);
    const right = container.querySelector(`.slider__btn--right`);

    sliderList.style.transform = ``;

    let slide = 0;
    let viewport = document.documentElement.clientWidth;

    if (viewport < SMALL_SCREEN) {

      let slidesCount = sliderItems.length;
      let itemWidth = sliderItem.offsetWidth;
      let slidesOverlap = (viewport - (itemWidth + (GAP_MOB * 2))) / 2;

      let initStepToSlide_1 = itemWidth - slidesOverlap;
      let stepToSlide_0 = GAP_MOB + slidesOverlap;
      let sliderStep = itemWidth + GAP_MOB;
      let curStep;

      slide = 1;
      sliderList.style.transform = `translateX(-${initStepToSlide_1}px)`;
      //slider controls
      right.addEventListener(`click`, () => {
        if (slide < (slidesCount - 1)) {
          curStep = (slide * sliderStep) + initStepToSlide_1;
          slide++;
        } else {
          slide = 0;
          curStep = -stepToSlide_0;
        }

        sliderList.style.transform = `translateX(${curStep * -1}px)`;
      });

      left.addEventListener(`click`, () => {

        if (slide > 0) {
          slide--;

          slide === 0 ?
            curStep = -stepToSlide_0 :
            curStep = ((slide - 1) * sliderStep) + initStepToSlide_1;
        } else {
          slide = (slidesCount - 1);
          curStep = ((slide - 1) * sliderStep) + initStepToSlide_1;
        }

        sliderList.style.transform = `translateX(${curStep * -1}px)`;
      });
      //swipe
      let xDown = null;
      let yDown = null;

      const handleTouchStart = (evt) => {
        xDown = evt.touches[0].clientX;
        yDown = evt.touches[0].clientY;
      };
      const handleTouchMove = (evt) => {
        if (!xDown || !yDown) {
          return;
        }

        let xUp = evt.touches[0].clientX;
        let yUp = evt.touches[0].clientY;
        let xDiff = xDown - xUp;
        let yDiff = yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {

          if (xDiff > 0) {
            if (slide < (slidesCount - 1)) {

              curStep = (slide * sliderStep) + initStepToSlide_1;
              slide++;
            } else {
              slide = 0;
              curStep = -stepToSlide_0;
            }

            sliderList.style.transform = `translateX(${curStep * -1}px)`;

          } else {
            if (slide > 0) {
              slide--;

              slide === 0 ?
                curStep = -stepToSlide_0 :
                curStep = ((slide - 1) * sliderStep) + initStepToSlide_1;
            } else {
              slide = (slidesCount - 1);
              curStep = ((slide - 1) * sliderStep) + initStepToSlide_1;
            }

            sliderList.style.transform = `translateX(${curStep * -1}px)`;
          }
        }
        xDown = null;
        yDown = null;
      };

      sliderList.addEventListener(`touchstart`, handleTouchStart, false);
      sliderList.addEventListener(`touchmove`, handleTouchMove, false);

    } else {
      //big screens no swipe
      let moveStep = slider.offsetWidth;
      let sliderLength = sliderList.offsetWidth;
      let slidesCount = Math.ceil(sliderLength / moveStep);

      right.addEventListener(`click`, () => {

        if (slide < (slidesCount - 1)) {
          slide++;
        } else {
          slide = 0;
        }

        sliderList.style.transform = `translateX(-${slide * moveStep}px)`;
      });

      left.addEventListener(`click`, () => {

        if (slide > 0) {
          slide--;
        } else {
          slide = (slidesCount - 1);
        }

        sliderList.style.transform = `translateX(-${slide * moveStep}px)`;
      });
    }
    //прячет кнопкина больих экранах, если нет прокрутки
    if (sliderItems.length <= 4) {
      sliderBtns.style.display = 'none'
    }
  };

  if (container) {
    initSlider();

    window.addEventListener(`resize`, () => {
      setTimeout(() => {
        initSlider()
      }, 600);
    });
  }
})();
//swiper
(() => {
  const LARGE_SCREEN = 1024;
  const swiper = document.querySelector('.swiper');
  const swiperWrapper = swiper.querySelector('.swiper-wrapper');

  if (!swiper) {
    return;
  }

  swiper.classList.add('init');

  const swiperServices = new Swiper('.swiper', {
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
        enabled: true,
      },
      360: {
        slidesPerView: 1.2,
        spaceBetween: 10,
        enabled: true,
      },
      450: {
        slidesPerView: 1.3,
        spaceBetween: 10,
        enabled: true,
      },
      600: {
        slidesPerView: 1.4,
        spaceBetween: 10,
        enabled: true,
      },
      786: {
        slidesPerView: 2,
        spaceBetween: 20,
        enabled: true,
      },
      1024: {
        enabled: false,
      },
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });

window.addEventListener(`resize`, () => {
  let viewport = window.innerWidth;

  setTimeout(() => {
    viewport >= LARGE_SCREEN ? swiperWrapper.style.transform = 'none' : ''
  }, 400);
});
})();
