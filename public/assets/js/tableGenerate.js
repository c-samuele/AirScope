function tableGenerate(database, debug) {
  fetch(database)
    .then(res => res.json())
    .then(dati => {
      const table = document.getElementById("opendata-table");
      const tbody = table.querySelector("tbody");
      tbody.innerHTML = ''; // Pulisci prima la tabella

      dati.dati.forEach(item => {
        const tr = document.createElement('tr');

        ['data', 'ora', 'co', 'no2', 'nox', 'o3', 'pm10'].forEach(chiave => {
          const td = document.createElement('td');
          td.textContent = item[chiave];
          tr.appendChild(td);
        });

        // Bottone per eliminare
        const tdDelete = document.createElement('td');
        const btnDelete = document.createElement('button');
        btnDelete.classList.add('btn', 'btn-sm', 'btn-danger');
        btnDelete.innerHTML = '<i class="bi bi-x-circle"></i>';

        btnDelete.addEventListener('click', () => {
        if (confirm(`Vuoi eliminare la misurazione del ${item.data} alle ${item.ora}?`)){
          fetch(`/delete/${item.data}/${item.ora}`, { method: 'DELETE' })
            .then(res => {
              if (res.ok) {
                showToast('success',"Misurazione eliminata con successo!");
                tableGenerate(database, debug);
                // Distruggo il chart
                if (Chart.getChart("chartAvg")) 
                  Chart.getChart("chartAvg").destroy();
                // Creo il chart nuovamente
                chartGenerate(database, debug);
              } else {
                showToast('error',"Errore durante l'eliminazione!");
              }
            })
            .catch(err => showToast('error',"Errore di rete: " + err));
        }});
      

        tdDelete.appendChild(btnDelete);
        tr.appendChild(tdDelete);

        tbody.appendChild(tr);
      });
    });
}
