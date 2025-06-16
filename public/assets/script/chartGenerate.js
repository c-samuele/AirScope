async function chartGenerate(dataBase,debug) {

  // Lavoro: elemento grafico html
  const chart = $('#chart');


  const response = await fetch(dataBase);
  const jsonData = await response.json();
  
  if(debug) // debug ---------------------------|
    console.log(response);

  const dataArray = jsonData.dati;
  const labels = dataArray.map(item => `${item.data} ${item.ora}`);

  // chart key metrics
  const keys = ['co', 'no2', 'nox', 'o3', 'pm10'];

  const datasets = keys.map(key => ({
    label: key,
    data: dataArray.map(item => item[key]),
    borderWidth: 1,
    fill: false,
  }));


  new Chart(chart, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}