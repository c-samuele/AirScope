// funzione per calcolare i valori medi
function avgMetricsGenerate (database,    // Endpoint per i dati
                             debug){      // modalità debug

  // valori medi
  let avgValue = {
      "co":0,
     "no2":0,
     "nox":0,
      "o3":0,
    "pm10":0
  }

  // valori massimi nazionali
  let maxValue = {
      "co":10,
     "no2":40,
     "nox":30,
      "o3":120,
    "pm10":35
  }

    fetch(database)
        .then(res => res.json())
        .then(data => {
         data.dati.forEach(element =>{
          // CAST a Number per via delle possibili stringhe e.g. co "0,5" -> 0,5
           avgValue.co += Number(element.co);
          avgValue.no2 += Number(element.no2);
          avgValue.nox += Number(element.nox);
           avgValue.o3 += Number(element.o3);
         avgValue.pm10 += Number(element.pm10);
        })

        let len = data.dati.length; // numero degli elementi

        if(debug) // debug ---------------------------|
          console.log('numero di misurazioni: ['+ len + ']'); 

          // eseguo la media aritmetica
          avgValue.co /= len;
          avgValue.no2 /= len;
          avgValue.nox /= len;
          avgValue.o3 /= len;
          avgValue.pm10 /= len;

          // aggiorno i valori
          $('#val-co').text(avgValue.co.toFixed(2));
          $('#val-no2').text(avgValue.no2.toFixed(2));
          $('#val-nox').text(avgValue.nox.toFixed(2));
          $('#val-o3').text(avgValue.o3.toFixed(2));
          $('#val-pm10').text(avgValue.pm10.toFixed(2));

          // controllo se supera i massimali
          for(let key in avgValue){

            let id = `#val-${key}`; // id di ogni elemento

            if(avgValue[key] >= maxValue[key]){
              $(id).addClass("text-danger"); // aggiungo la colorazione rossa al superamento
              if(debug) // debug ---------------------------|
                console.log(`Superato il massimale di: [${key}]`);  
            }
            else
            { 
              if(debug) // debug ---------------------------|
                console.log(`Valore sotto la soglia critica: [${key}]`);  
            }
          }        

        })
        .catch(e => console.error(e));
}