// Gestione del menu con link attivo -----------------------------------------|
document.querySelectorAll('#menu-nav .nav-link').forEach(link => {
  link.addEventListener('click', function () {
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
    // Uso JQuery per caricare il contenuto
    container.load("services/dashboard.html", () => {
      
      avgMetricsGenerate();   // Calcolo la media e aggiorno i valori

    });     
  break;

  // ASERVIZIO ANALISI
  case "analitics":
    // Funzione per caricare il contenuto html del servizio con JQuery
    container.load("services/analytics.html", () => {
      // Funzione per generare il grafico
      chartGenerate('/upload/data');  
      
      // Funzione per popolare la tabella con i valori del database
      tableGenerate('/upload/data');
    });
  break;

  // SERVIZIO RICHIESTA
  case "request":
     // Uso JQuery per caricare il contenuto
    container.load("services/request.html", () => {

      // Event Listener per il form carica file ------------------------- //
      document.getElementById('form-send').addEventListener('submit', async (e) => {
        // Blocco per gestirlo via AJAX
        e.preventDefault();
        // FormData contiene i dati del form
        const formData = new FormData(e.target);

        // SEZIONE CRITICA
        try {
          // RICHIESTA POST asincrona
          const res = await fetch('/upload', {
            method: 'POST',
            body: formData
          });
          // LOG di Response
          const text = await res.text();
          console.log(text);

        // Catturo eventuali errori
        } catch (err) {
          console.error('Errore nel caricamento:', err);
        }
      });
      // end ----------------------------------------------------------- //

      // Event Listener per il form aggiungi elemento ------------------ //
      document.getElementById('form-mod').addEventListener('submit', function (e) {

      e.preventDefault(); // blocco il caricamento pagina

      const form = e.target;

      const newItem = {
        data: form.data.value,
        ora: form.ora.value,
          co: form.co.value,
         no2: form.no2.value,
         nox: form.nox.value,
          o3: form.o3.value,
        pm10: form.pm10.value
      };

      fetch('/newItem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      })
      .then(res => res.json())
      .then(data => alert(data.message))
      .catch(err => alert('Errore: ' + err));
      });
      // end ----------------------------------------------------------- //

    });
    break;
    }
  }