'use strict';
const form = document.querySelector('#signup');
const submit = form.querySelector('button[type="submit"]');
form.addEventListener('submit', () => {
  submit.disabled = true;
  submit.textContent = 'Sending…';
});
