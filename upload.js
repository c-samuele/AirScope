function registerUploadListener() {
  const form = document.getElementById('uploadForm');
  const responseMsg = document.getElementById('responseMsg');

  if (!form) {
    console.warn('Form non trovato, listener non registrato');
    return;
  }

  form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  fetch('/upload', {
    method: 'POST',
    body: formData
  })
  .then(res => {
    if (res.ok) return res.text().then(data => ({ status: 'success', message: data }));
    else return res.text().then(data => ({ status: 'error', message: data }));
  })
  .then(({ status, message }) => {
    showToast(message, status);
  })
  .catch(() => {
    showToast('Errore nel caricamento', 'error');
  });
});

}
