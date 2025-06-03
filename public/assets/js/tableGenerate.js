// Funzione per popolare la tabella 
function tableGenerate(database) {  // file.json contenente open data
  fetch(database)
    .then(res => res.json())
    .then(dati => {
      const table = document.getElementById("opendata-table");
      const tbody = table.querySelector("tbody");

      dati.dati.forEach(item => {
        const tr = document.createElement('tr');

        ['data','ora', 'co', 'no2', 'nox', 'o3', 'pm10'].forEach(chiave => {
          const td = document.createElement('td');
          td.textContent = item[chiave];
          tr.appendChild(td);
        });

        tbody.appendChild(tr);
      });
    });
}