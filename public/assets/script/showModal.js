function showModal(data,ora,database,debug,filename){

if(debug)
    console.log(`\nshowModal > filename = ${filename}`);

const modalHtml = `
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content bg-dark">
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">Modifica misurazione</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form id="edit-form">
                <section class="d-flex flex-row">
                        <div class="me-3">
                            <label for="co-metrics" class="form-label text-light">CO</label>
                            <input name="co" id="co-metrics" type="number" class="form-control text-white bg-transparent mb-3" placeholder="0.00" min="0" step="0.01" required>    
                        </div>
                        <div class="me-3">
                            <label for="no2-metrics" class="form-label text-light">NO<sub>2</sub></label>
                            <input name="no2" id="no2-metrics" type="number" class="form-control text-white bg-transparent mb-3" placeholder="0.00" min="0" step="0.01" required>    
                        </div>
                        <div class="me-3">
                            <label for="nox-metrics" class="form-label text-light">NO<sub>x</sub></label>
                            <input name="nox" id="nox-metrics" type="number" class="form-control text-white bg-transparent mb-3" placeholder="0.00" min="0" step="0.01" required>    
                        </div>
                        <div class="me-3">
                            <label for="o3-metrics" class="form-label text-light">O<sub>3</sub></label>
                            <input name="o3" id="o3-metrics" type="number" class="form-control text-white bg-transparent mb-3" placeholder="0.00" min="0" step="0.01" required>    
                        </div>
                        <div>
                            <label for="pm10-metrics" class="form-label text-light">PM<sub>10</sub></label>
                            <input name="pm10" id="pm10-metrics" type="number" class="form-control text-white bg-transparent mb-3" placeholder="0.00" min="0" step="0.01" required>    
                        </div>
                    </section>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
            <button id="send-edit" type="button" class="btn btn-primary">Conferma</button>
        </div>
        </div>
    </div>
    </div>`; 

// aggiungo 
$('#edit-zone').html(modalHtml); 
// inizializzo
const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
// mostro
modal.show();


document.getElementById('send-edit').addEventListener('click', () => {

const formHtml = document.getElementById('edit-form');

const bodyRequest = {
    co: parseFloat(formHtml.co.value),
    no2: parseFloat(formHtml.no2.value),
    nox: parseFloat(formHtml.nox.value),
    o3: parseFloat(formHtml.o3.value),
    pm10: parseFloat(formHtml.pm10.value)
}; 

fetch(`/edit/${data}/${ora}/${localStorage.getItem(filename)}`, { 
        method: 'PUT',
        headers: {'content-type':'application/json'},
        body:JSON.stringify(bodyRequest)
        
     })
.then(response => {
    if (response.ok) {
    showToast('success',"Misurazione modificata con successo!");
    tableGenerate(database, debug,filename);
    // Distruggo il chart
    if (Chart.getChart("chart")) 
        Chart.getChart("chart").destroy();
    // Creo il chart nuovamente
    chartGenerate(database, debug);
    } else {
    showToast('error',"Errore durante la modifica!");
    }
})
.catch(e => showToast('error', `Errore generico: ${e}`));
          
});// END EVENT CLICK

}