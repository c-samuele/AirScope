// Versione GUI
const version = "v0.0.6";
const versionElements = document.querySelectorAll(".version-number");

for (const el of versionElements) {
  el.textContent = version;
}

// Gestione del menu con link attivo
document.querySelectorAll('#menu-nav .nav-link').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('#menu-nav .nav-link').forEach(item => {
        item.classList.remove('active');
      });
      this.classList.add('active');
    });
  });
// intercetto il click sul link del menu
  document.getElementById("dashboard-btn").addEventListener("click", () => contentGenerate("dashboard"));
  document.getElementById("analitics-btn").addEventListener("click", () => contentGenerate("analitics"));
  document.getElementById("request-btn").addEventListener("click", () => contentGenerate("request"));

// funzione per generare il contenuto della pagina servizio
 function contentGenerate(type) {
    const container = $("#main-section");

    switch(type) {
      case "dashboard":
        container.html(`
<div class="container-fluid">
<!-- TITOLO -->
        <div class="col-12 mb-3">
          <h1>Average air quality</h1>
        </div>

<!-- METRICHE -->
    <div class="container-metrics">
        <section class="d-flex flex-row item-card rounded-3">
          <h3 class="title-metrics">CO</h3>
          <div class="divider-metrics"></div>
          <i class="metrics-value"><span id="val-co" class="data-avg"></span> <span class="metrics-udm">[mg/m³]</span></i>
        </section>
        
        <section class="d-flex flex-row item-card rounded-3">
          <h3 class="title-metrics">NO2</h3>
          <div class="divider-metrics"></div>
          <i class="metrics-value"><span id="val-no2" class="data-avg"></span> <span class="metrics-udm">[μg/m³]</span></i>
        </section>
      
        <section class="d-flex flex-row item-card rounded-3">
          <h3 class="title-metrics">NOx</h3>
          <div class="divider-metrics"></div>
          <i class="metrics-value"><span id="val-nox" style="color:red" class="data-avg"></span> <span class="metrics-udm">[μg/m³]</span></i>
        </section>
      
        <section class="d-flex flex-row item-card rounded-3">
          <h3 class="title-metrics">O3</h3>
          <div class="divider-metrics"></div>
          <i class="metrics-value"><span id="val-o3" class="data-avg"></span> <span class="metrics-udm">[μg/m³]</span></i>
        </section>
      
        <section class="d-flex flex-row item-card rounded-3">
          <h3 class="title-metrics">PM10</h3>
          <div class="divider-metrics"></div>
          <i class="metrics-value"><span id="val-pm10"  class="data-avg"></span> <span class="metrics-udm">[μg/m³]</span></i>
        </section>
    </div>
</div>`);
// Aggiorno i dati sul client dal server
fetch('http://localhost:3000/api/values_avg')
  .then(res => res.json())
  .then(data => {
    $('#val-co').text(data.CO);
    $('#val-no2').text(data.NO2);
    $('#val-nox').text(data.NOX);  
    $('#val-o3').text(data.O3);
    $('#val-pm10').text(data.PM10);
  })
  .catch(e => console.error(e));

        break;
      case "analitics":
        container.html(`
          <div class="container-fluid">
            <p>Infographics,avg,table</p>
            <canvas id="chart-database" class="rounded-3"></canvas>
          </div>`);
        break;
      case "request":
        container.html(`
          <div class="container-fluid">
<!-- form -->
              <div class="container-form py-3">
                <div class="col-sm-12 col-md-8 col-lg-6">
                  <h2>POST</h2>
                  <div class="form-api d-flex flex-column rounded-3 p-3">
                      <form id="form-send" action="/upload" method="POST" enctype="multipart/form-data">
                          <input class="form-control mb-3" type="file" name="file" required>
                          <button class="btn btn-outline-primary px-3" type="submit">Carica</button>
                      </form>
                  </div>
                </div>
              </div>
              

<!-- end form -->
          </div>`);
  // Caricamento del file
document.getElementById('form-send').addEventListener('submit', async (e) => {
  e.preventDefault(); // Impedisce il ricaricamento della pagina

  // Crea un oggetto FormData con i dati del form, incluso il file
  const formData = new FormData(e.target);

  try {
    // Invia una richiesta POST al server con i dati del form
    const res = await fetch('/upload', {
      method: 'POST',
      body: formData
    });

    // Estrae il testo dalla risposta
    const text = await res.text();

    // Stampa il messaggio del server nella console
    console.log(text);

  } catch (err) {
    // Mostra un eventuale errore in console
    console.error('Errore nel caricamento:', err);
  }
});

        break;
    }
  }






