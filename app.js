'use strict';
const form = document.querySelector('#signup');
const email = document.querySelector('#email');
const submit = form.querySelector('button[type="submit"]');
const status = document.querySelector('#signup-status');
const fallback = document.querySelector('.fallback-submit');
let submitting = false;
function showStatus(message, state) {
  status.textContent = message;
  status.dataset.state = state;
}
form.addEventListener('submit', async event => {
  if (event.submitter?.dataset.native === 'true') return;
  event.preventDefault();
  if (submitting) return;
  email.value = email.value.trim();
  if (!form.reportValidity()) return;
  if (form.elements._honey.value) return;
  const payload = Object.fromEntries(new FormData(form).entries());
  delete payload._next;
  fallback.hidden = true;
  submitting = true;
  submit.disabled = true;
  submit.textContent = 'Sending…';
  form.setAttribute('aria-busy', 'true');
  showStatus('Sending your signup request…', 'pending');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch('https://formsubmit.co/ajax/info@volcandecacao.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    const result = await response.json();
    if (!response.ok || ![true, 'true'].includes(result.success)) throw new Error('Submission was not accepted');
    showStatus('Thank you. Your launch-update request has been received.', 'success');
    form.reset();
  } catch (error) {
    showStatus(error.name === 'AbortError'
      ? 'We couldn’t confirm delivery. Continue with secure signup or email info@volcandecacao.com.'
      : 'We couldn’t confirm delivery. Continue with secure signup or email info@volcandecacao.com.', 'error');
    fallback.hidden = false;
  } finally {
    clearTimeout(timeout);
    submitting = false;
    submit.disabled = false;
    submit.textContent = 'Notify me';
    form.removeAttribute('aria-busy');
  }
});
