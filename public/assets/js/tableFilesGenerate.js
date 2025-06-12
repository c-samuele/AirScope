function tableFilesGenerate(files, debug) {
  fetch(files)
    .then(res => res.json())
    .then(fileList => {
      const table = document.getElementById("files-table");
      const tbody = table.querySelector("tbody");
      tbody.innerHTML = ''; // Pulisci prima la tabella

      fileList.forEach(item => {
        const tr = document.createElement('tr');

        ['filename', 'citta', 'ente'].forEach(chiave => {
          const td = document.createElement('td');
          td.textContent = item[chiave];
          tr.appendChild(td);
        });

        const tdDelete = document.createElement('td');
        const btnDelete = document.createElement('button');
        btnDelete.classList.add('btn', 'btn-sm', 'btn-danger');
        btnDelete.innerHTML = '<i class="bi bi-x-circle"></i>';

        btnDelete.addEventListener('click', () => {
          if (confirm(`Vuoi eliminare il file ${item.filename}?`)) {
            fetch(`/deletefiles/${item.filename}`, { method: 'DELETE' })
              .then(res => {
                if (res.ok) {
                  showToast('success', "File eliminato con successo!");
                  tableGenerate(files, debug);
                } else {
                  showToast('error', "Errore durante l'eliminazione!");
                }
              })
              .catch(err => showToast('error', "Errore di rete: " + err));
          }
        });

        tdDelete.appendChild(btnDelete);
        tr.appendChild(tdDelete);
        tbody.appendChild(tr);
      });
    });
}
