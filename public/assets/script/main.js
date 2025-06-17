// debug ---------------------------------------------------------------------|
const debug = true;
// ---------------------------------------------------------------------------|

// Gestione del menu con link attivo -----------------------------------------|
document.querySelectorAll('#menu-nav .nav-link').forEach(link => {
  link.addEventListener('click',  function() {
    //  Rimuovo active da tutti i link
    document.querySelectorAll('#menu-nav .nav-link').forEach(item => {
      item.classList.remove('active');
    });
    // Aggiungo active solo al link cliccato
    this.classList.add('active');
  });
});
// ---------------------------------------------------------------------------|

// GENERAZIONE dei Servizi ------------------------------------------------------------------------------|
  document.getElementById("dashboard-btn").addEventListener("click", () => contentGenerate("dashboard"));
  document.getElementById("analitics-btn").addEventListener("click", () => contentGenerate("analitics"));
  document.getElementById("request-btn").addEventListener("click", () => contentGenerate("request"));
// ------------------------------------------------------------------------------------------------------|


// funzione per generare il contenuto della pagina servizio ---------------------------------------------|
function contentGenerate(type) {
  const container = $("#main-section");
  
switch(type) {

  // SERVIZIO DASHBOARD
  case "dashboard":

    if(debug){
      console.clear();
      console.log(`DEBUG MODE: [${debug}]`);
    }

    // Uso JQuery per caricare il contenuto via AJAX (Asynchronous JavaScript and XML))
    container.load("services/dashboard.html", () => {
      // Calcolo la media e aggiorno i valori
      avgMetricsGenerate('/upload/data',  // endpoint get per i dati
                          debug);         // debug mode

    });     
  break;

  // SERVIZIO ANALISI
  case "analitics":

    if(debug){
      console.clear();
      console.log(`DEBUG MODE: [${debug}]`);
    }
    // Funzione per caricare il contenuto html del servizio con JQuery
    container.load("services/analytics.html", () => {
      // Funzione per generare il grafico
      chartGenerate('/upload/data',   // endpoint get per i dati
                     debug);          // debug mode
        
      // Funzione per popolare la tabella con i valori del database
      tableGenerate('/upload/data',   // endpoint get per i dati
                     debug);          // debug mode
    });
  break;

  // SERVIZIO RICHIESTA
  case "request":

    if(debug){
      console.clear();
      console.log(`DEBUG MODE: [${debug}]`);
    }
     // Uso JQuery per caricare il contenuto
    container.load("services/request.html", () => {

      // Event Listener per il form carica file ------------------------- //
      document.getElementById('form-send').addEventListener('submit', async (e) => {
        // Blocco per gestirlo via AJAX
        e.preventDefault();

        // contiene i dati del form (citta,ente,fileCsv)
        const formData = new FormData(e.target);

        try {
          // RICHIESTA POST asincrona
          const res = await fetch('/upload', {
            method: 'POST',
            body: formData
          });

          // LOG di Response --------------|
          const text = await res.text();

          if(!res.ok)
            showToast('error',text);
          else{
            tableFilesGenerate('/get/files', debug);
            showToast('success',text);
          }
          if(debug) // Debug ---------------|
            console.log(text);

        // Catturo eventuali errori
        } catch (err) {
          showToast('error','Errore nel caricamento: ' + err);
          if(debug)
            console.error('Errore nel caricamento:', err);
        }
      });
      // end ----------------------------------------------------------- //

      // Event Listener per il form aggiungi elemento ------------------ //
      document.getElementById('form-mod').addEventListener('submit', function (e) {

      e.preventDefault(); // blocco il caricamento pagina

      const form = e.target; // restituisce il form html per accedervi ai singoli valori tramite name="valore"

      if(debug)
        console.log(form);

      const newItem = {
        data: form.data.value,
        ora: form.ora.value,
          co: form.co.value,
         no2: form.no2.value,
         nox: form.nox.value,
          o3: form.o3.value,
        pm10: form.pm10.value
      };

      if(debug)
        console.log(newItem);

      fetch('/newItem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      })
      .then(res => res.json())
      .then(data => showToast("success",data.message))
      .catch(err => showToast('error','Errore: ' + err));
      });
      // end ----------------------------------------------------------- //


    // Tabella dei file caricati
    tableFilesGenerate('/get/files',debug);

    });
    break;
    }
  }