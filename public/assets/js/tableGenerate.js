// funzione per generare la tabella delle misurazioni
function tableGenerate(database,  // Endpoint GET
                       debug) {   // Modalità debug
  // 
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

        // Bottone per eliminare
        const tdActionDelete = document.createElement('td');

        tdActionDelete.innerHTML = '<button class="btn btn-danger"><i class="bi bi-x-circle"></i></button>';

        tdActionDelete.addEventListener('click', () => {
        if (confirm(`Eliminare la misurazione: [${item.data} ${item.ora}] ?`)){
          fetch(`/delete/${item.data}/${item.ora}`, { method: 'DELETE' })
            .then(response => {
              if (response.ok) {
                showToast('success',"Misurazione eliminata con successo!");
                tableGenerate(database, debug);
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
        }});
    
        tr.appendChild(tdActionDelete);
        tbody.appendChild(tr);
      });
    });
}
