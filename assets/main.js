
const version = "v0.0.6";
const versionElements = document.querySelectorAll(".version-number");

for (const el of versionElements) {
  el.textContent = version;
}

document.querySelectorAll('#menu-nav .nav-link').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('#menu-nav .nav-link').forEach(item => {
        item.classList.remove('active');
      });
      this.classList.add('active');
    });
  });

  document.getElementById("dashboard-btn").addEventListener("click", () => contentGenerate("dashboard"));
  document.getElementById("analitics-btn").addEventListener("click", () => contentGenerate("analitics"));
  document.getElementById("request-btn").addEventListener("click", () => contentGenerate("request"));


 function contentGenerate(type) {
    const container = document.getElementById("main-section");

    switch(type) {
      case "dashboard":
        container.innerHTML = `
<div class="container-fluid">
      <!-- TITOLO -->
        <div class="col-12 mb-3">
          <h1>Average air quality</h1>
        </div>
      <!-- END TITOLO -->

      <!-- METRICHE -->
    <div class="container-metrics">
      
        <section class="d-flex flex-row item-card rounded-3">
          <h3 class="title-metrics">CO</h3>
          <div class="divider-metrics"></div>
          <i class="metrics-value"> <span class="metrics-udm">[mg/m³]</span></i>
        </section>
        
        <section class="d-flex flex-row item-card rounded-3">
          <h3 class="title-metrics">NO2</h3>
          <div class="divider-metrics"></div>
          <i class="metrics-value"> <span class="metrics-udm">[μg/m³]</span></i>
        </section>
      
        <section class="d-flex flex-row item-card rounded-3">
          <h3 class="title-metrics">NOx</h3>
          <div class="divider-metrics"></div>
          <i class="metrics-value"> <span class="metrics-udm">[μg/m³]</span></i>
        </section>
      
        <section class="d-flex flex-row item-card rounded-3">
          <h3 class="title-metrics">O3</h3>
          <div class="divider-metrics"></div>
          <i class="metrics-value"> <span class="metrics-udm">[μg/m³]</span></i>
        </section>
      
        <section class="d-flex flex-row item-card rounded-3">
          <h3 class="title-metrics">PM10</h3>
          <div class="divider-metrics"></div>
          <i class="metrics-value"> <span class="metrics-udm">[μg/m³]</span></i>
        </section>

    </div>
  <!-- END METRICHE -->

  <!-- form -->
  <div class="container-form py-3">
    <div class="col-sm-12 col-md-8 col-lg-6">
      <h2>Load file</h2>
      <div class="form-api d-flex flex-column rounded-3 p-3">
        <label for="formFile" class="form-label mb-2 text-primary">Seleziona file</label>
        <input class="form-control mb-3" type="file" id="formFile">
        <div class="d-flex justify-content-end">
          <button class="btn btn-outline-primary px-3" type="submit">Carica</button>
        </div>
      </div>
    </div>
  </div>
  <!-- end form -->

</div>`;
        break;
      case "analitics":
        container.innerHTML = `
          <div class="container-fluid">
            <h1>analitics</h1>
            <p>Infographics,avg,table</p>
          </div>`;
        break;
      case "request":
        container.innerHTML = `
          <div class="container-fluid">
            <h1>request</h1>
            <p>Contenuto della terza vista.</p>
          </div>`;
        break;
    }
  }