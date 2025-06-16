const fs = require('fs');

// PATH del DB che gestisce i riferimenti ai file.json convertiti
const FILES_LIST_PATH = './upload/files.json';

function readFilesList() {
  try {
    const content = fs.readFileSync(FILES_LIST_PATH, 'utf8');
    return JSON.parse(content); // converto in js
  } catch (e) {
    console.error(`Impossibile leggere il ${FILES_LIST_PATH} \nErrore: ${e}`);
    return [];
  }
}

// Aggiunge il riferimento e le informazioni al DB files.json
function addFileList(newFile) {

  try {
    let filesList = readFilesList(); // prendo il file convertito da readFilesList

    filesList.push(newFile);  // aggiungo all'array il nuovo oggetto js

    // scrivo sul filesystem trasformandolo in stringa JSON
    fs.writeFileSync(FILES_LIST_PATH, JSON.stringify(filesList, null, 2));
    console.log(`Riferimento file aggiunto a ${FILES_LIST_PATH}`);
  } catch (e) {
    console.error(`Errore aggiungendo file a files.json \nErrore: ${e}`);
  }
}

module.exports = {readFilesList,addFileList};
