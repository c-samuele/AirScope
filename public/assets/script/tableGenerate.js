// funzione per generare la tabella delle misurazioni
function tableGenerate(database,  // Endpoint GET
                       debug,     // Modalità debug
                       filename) {// file in uso   
  if(debug)
    console.log(`\ntableGenerate > filename = ${filename}`);

  fetch(database)
    .then(response => response.json())
    .then(dati => {
      const table = document.getElementById("opendata-table");
      const tbody = table.querySelector("tbody");
      tbody.innerHTML = ''; // Pulisci prima la tabella

      dati.dati.forEach(item => {
        const tr = document.createElement('tr');
        const thKey = ['data', 'ora', 'co', 'no2', 'nox', 'o3', 'pm10'];

          thKey.forEach(chiave => {
          const td = document.createElement('td');
          td.textContent = item[chiave];
          tr.appendChild(td);
        });

        // Bottone per modificare
        const tdEdit = document.createElement('td');
              tdEdit.classList.add("text-center");
        tdEdit.innerHTML = '<button class="btn btn-primary"><i class="bi bi-pencil-square"></i></button>';

        tdEdit.addEventListener('click', () => {
          showModal(item.data,item.ora,database,debug,filename);
          });
         tr.appendChild(tdEdit);


        // Bottone per eliminare
        const tdDelete = document.createElement('td');
              tdDelete.classList.add("text-center");

        tdDelete.innerHTML = '<button class="btn btn-danger"><i class="bi bi-x-circle"></i></button>';

        tdDelete.addEventListener('click', () => {
        // if (confirm(`Eliminare la misurazione: [${item.data} ${item.ora}] ?`)){
          fetch(`/delete/${item.data}/${item.ora}/${localStorage.getItem(filename)}`, { method: 'DELETE' })
            .then(response => {
              if (response.ok) {
                showToast('success',"Misurazione eliminata con successo!");
                tableGenerate(database, debug,filename);
                // Distruggo il chart
                if (Chart.getChart("chart")) 
                  Chart.getChart("chart").destroy();
                // Creo il chart nuovamente
                chartGenerate(database, debug);
              } else {
                showToast('error',"Errore durante l'eliminazione!");
              }
            })
            .catch(e => showToast('error', `Errore generico: ${e}`));
          //  }
          });
    
        tr.appendChild(tdDelete);
        tbody.appendChild(tr);
      });
    });
}
