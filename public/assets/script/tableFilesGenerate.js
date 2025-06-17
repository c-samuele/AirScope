// funzione per generare la lista dei file caricati
function tableFilesGenerate(files, debug) {
  fetch(files)
    .then(response => response.json())
    .then(fileList => {

      const table = document.getElementById("files-table");
      const tbody = table.querySelector("tbody");

      tbody.innerHTML = ''; // inizializzo la tabella 

      // per ogni file
      fileList.forEach(item => {
        const tr = document.createElement('tr');
        const thKey = ['filename', 'citta', 'ente'];
        // per ogni chiave
        thKey.forEach(chiave => {
          const td = document.createElement('td');
          td.textContent = item[chiave];
          tr.appendChild(td);
        });

        // btn elimina ------------------------------------------ |
        const tdDelete = document.createElement('td');
              tdDelete.classList.add("text-center");
        // creo il bottone
        tdDelete.innerHTML = '<button class="btn btn-danger"><i class="bi bi-x-circle"></i></button>';
        // aggiungo un'event listener
        tdDelete.addEventListener('click', () => {
          if (confirm(`Eliminare il file: [${item.filename}] ?`)) {
            fetch(`/deletefiles/${item.filename}`, { method: 'DELETE'})
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
        // end btn elimina ------------------------------------------ |

        // btn use ------------------------------------------ |
        const tdUse = document.createElement('td');
              tdUse.classList.add("text-center");
        // creo il bottone
        tdUse.innerHTML = '<button class="btn btn-info"><i class="bi bi-check-circle text-dark"></i></button>';
        // aggiungo l'event listener
        tdUse.addEventListener('click', () => {
            localStorage.setItem("fileInUse", item.filename);
            if(debug)
              console.log(localStorage);
            showToast('info',`File in uso:${localStorage.getItem('fileInUse')}`);
        });

        // aggiungo i bottoni
        tr.appendChild(tdUse);
        tr.appendChild(tdDelete);

        // aggiungo la riga
        tbody.appendChild(tr);
      });
    });
}