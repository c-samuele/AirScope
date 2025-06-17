// funzione per normalizzare la data nel caricamento file
function normalizeDate(data) {
  let block;

  if (data.includes('/'))
    block = data.split('/');
  else 
    block = data.split('-'); 

  let giorno = block[0];
  let mese = block[1];
  let anno = block[2] ? block[2].substring(0, 4) : '';

  return `${anno}-${mese}-${giorno}`;
}

// funzione per normalizzare la l'orario nel caricamento file
function normalizeTime(time) {
  let block = time.split('.');
  if (block.length >= 2) {
    let ore = block[0].padStart(2, '0');
    let min = block[1].padStart(2, '0');
    return `${ore}:${min}`;
  }
  return time;
}

module.exports = { normalizeDate, normalizeTime };
