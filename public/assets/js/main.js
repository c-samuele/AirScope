// funzione per popolare la tabella degli open data
// import { tableGenerate } from './tableGenerate.js';

// Versione --------------------------------------------------------------|
const version = "v0.1.4";
const versionElements = document.querySelectorAll(".version-number");

for (const el of versionElements) {
  el.textContent = version;
}
//----------------------------------------------------------------------------|

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
      chartGenerate();
      
      // Funzione per popolare la tabella con i valori del database
      tableGenerate('../../upload/dacaricare.json');
    });
  break;

  // SERVIZIO RICHIESTA
  case "request":
     // Uso JQuery per caricare il contenuto
    container.load("services/request.html", () => {
      // Ascoltatore per il submit del form
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
    });
    break;
    }
  }