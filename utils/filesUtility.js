const fs = require('fs');

// PATH del DB che gestisce i riferimenti ai file.json convertiti
const FILES_LIST_PATH = './upload/files.json';

function readFilesList() {
  try {
    const content = fs.readFileSync(FILES_LIST_PATH, 'utf8');
    return JSON.parse(content); // converto in js
  } catch (e) {
    console.error(`Impossibile leggere il [${FILES_LIST_PATH}] -> [${e}]\n`);
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
    console.log(`Riferimento al file aggiunto su: [${FILES_LIST_PATH}]\n`);
  } catch (e) {
    console.error(`Errore aggiungendo il file a files.json -> [${e}]\n`);
  }
}

function removeFile(nome) {
  try {
    let filesList = readFilesList();

    filesList = filesList.filter(f => f.filename !== nome);

    fs.writeFileSync(FILES_LIST_PATH, JSON.stringify(filesList, null, 2));
    console.log(`File [${nome}] rimosso da [${FILES_LIST_PATH}]\n`);
  } catch (e) {
    console.error(`Errore rimuovendo il file da files.json -> [${e}]\n`);
  }
}



module.exports = {readFilesList,addFileList,removeFile};
