function tableFilesGenerate(files, debug) {
  fetch(files)
    .then(response => response.json())
    .then(fileList => {
      const table = document.getElementById("files-table");
      const tbody = table.querySelector("tbody");
      tbody.innerHTML = ''; // Pulisci prima la tabella

      fileList.forEach(item => {
        const tr = document.createElement('tr');
        const thKey = ['filename', 'citta', 'ente'];

        thKey.forEach(chiave => {
          const td = document.createElement('td');
          td.textContent = item[chiave];
          tr.appendChild(td);
        });

        const tdActionDelete = document.createElement('td');

        tdActionDelete.innerHTML = '<button class="btn btn-danger"><i class="bi bi-x-circle"></i></button>';

        tdActionDelete.addEventListener('click', () => {
          if (confirm(`Eliminare il file: [${item.filename}] ?`)) {
            fetch(`/deletefiles/${item.filename}`, { method: 'DELETE' })
              .then(response => {
                if (response.ok) {
                  showToast('success', "File eliminato con successo!");
                  tableFilesGenerate(files, debug);
                } else {
                  showToast('error', "Errore durante l'eliminazione!");
                }
              })
              .catch(e => showToast('error', `Errore generico: ${e}`));
          }
        });

        tr.appendChild(tdActionDelete);
        tbody.appendChild(tr);
      });
    });
}