// funzione per calcolare i valori medi
function avgMetricsGenerate (database){ // Endpoint per i dati

  // valori medi
  let avgValue = {
      "co":0,
     "no2":0,
     "nox":0,
      "o3":0,
    "pm10":0
  }
  // valori massimi
  let maxValue = {
      "co":10,
     "no2":40,
     "nox":100,
      "o3":120,
    "pm10":50
  }

    fetch(database)
        .then(res => res.json())
        .then(data => {
         data.dati.forEach(element =>{
           avgValue.co += Number(element.co);
          avgValue.no2 += Number(element.no2);
          avgValue.nox += Number(element.nox);
           avgValue.o3 += Number(element.o3);
         avgValue.pm10 += Number(element.pm10);
        })

        let len = data.dati.length; // numero degli elementi
        console.log(len);

          // eseguo la media aritmetica
          avgValue.co /= len;
          avgValue.no2 /= len;
          avgValue.nox /= len;
          avgValue.o3 /= len;
          avgValue.pm10 /= len;

          // aggiorno i valori
          $('#val-co').text(avgValue.co.toFixed(3));
          $('#val-no2').text(avgValue.no2.toFixed(3));
          $('#val-nox').text(avgValue.nox.toFixed(3));
          $('#val-o3').text(avgValue.o3.toFixed(3));
          $('#val-pm10').text(avgValue.pm10.toFixed(3));

          // controllo se supera i massimali
          for(let key in avgValue){

            let id = `#val-${key}`; // id di ogni elemento

            if(avgValue[key] >= maxValue[key]){
              console.log(`superato il massimale di:${avgValue[key]}`);
              $(id).addClass("text-danger");
            }
            else{    
              console.log(`Valore sotto la soglia critica:${avgValue[key]}`);
            }
          }        

        })
        .catch(e => console.error(e));
}