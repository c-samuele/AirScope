const fs = require('fs');
const path = require('path');

function removeDataFile(nameFile){

const removePath = path.join(__dirname, '..', 'upload', nameFile); // percorso del file da rimuovere

console.error(removePath);
    // rimuovo il file
    fs.unlink(removePath, (err) => {
            if (err)
                console.error(`Errore nella rimozione ${removePath}`, err);
            else 
                console.log(`File ${removePath} rimosso `);
        });
}

module.exports = {removeDataFile};