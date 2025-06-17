// funzione per creare e mostrare i toast 
function showToast(type,        // tipo di sfondo   
                   message) {   // messaggio da visualizzare

// classi BS da applicare al toast
    const types = {
        success: 'bg-success text-white',
        error: 'bg-danger text-white',
        info: 'bg-info text-dark',
        default: 'bg-primary text-white'
    };

    // Decido il colore di sfondo/testo
    const classToUse = types[type] || types.default;

    // Creo il toast con type e message personalizzati
    const toastHtml = `
<div class="toast align-items-center border-0 ${classToUse}" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="d-flex">
    <div class="toast-body">
     ${message}
    </div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
</div>`;

    // Converto in elemento jQuery
    const $toast = $(toastHtml);

    // Aggiungo al contenitore
    $('#toast-container').append($toast);

    // Inizializzo e mostro
    const bsToast = new bootstrap.Toast($toast[0], { delay: 5000 });
    bsToast.show();

    // Rimuovo quando scompare
    $toast.on('hidden.bs.toast', () => $toast.remove());
}
