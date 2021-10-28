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
