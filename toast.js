function showToast(message, type = 'primary') {
  const toastContainer = document.getElementById('toast-container');

  const toastElem = document.createElement('div');
  toastElem.className = `toast align-items-center text-bg-${type} border-0`;
  toastElem.setAttribute('role', 'alert');
  toastElem.setAttribute('aria-live', 'assertive');
  toastElem.setAttribute('aria-atomic', 'true');

  toastElem.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  toastContainer.appendChild(toastElem);

  const bsToast = new bootstrap.Toast(toastElem, { delay: 5000 });
  bsToast.show();

  toastElem.addEventListener('hidden.bs.toast', () => {
    toastElem.remove();
  });
}
