// funzione per normalizzare la data nel caricamento file
function normalizeDate(data) {
  if (data.includes('/')) {
    let [dd, mm, yyyy] = data.split('/');
    dd = dd.padStart(2, '0');
    mm = mm.padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  return data;
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
