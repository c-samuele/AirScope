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
    .then(res => res.text())
    .then(data => {
      responseMsg.textContent = data;
    })
    .catch(() => {
      responseMsg.textContent = 'Errore nel caricamento';
    });
  });
}
