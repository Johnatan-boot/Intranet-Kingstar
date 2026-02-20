document.addEventListener('DOMContentLoaded', () => {
  const toastData = sessionStorage.getItem('toast');
  if (!toastData) return;

  const { message, type } = JSON.parse(toastData);
  sessionStorage.removeItem('toast');

  const toastEl = document.getElementById('toastMsg');
  if (!toastEl) return;

  toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
  toastEl.querySelector('.toast-body').innerText = message;

  new bootstrap.Toast(toastEl, { delay: 3000 }).show();
});
