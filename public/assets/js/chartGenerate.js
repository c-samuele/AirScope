async function chartGenerate() {

  // Lavoro: elemento grafico html
  const chartAvg = $('#chartAvg');


  const response = await fetch('/upload/data_chart');
  const jsonData = await response.json();

  const dataArray = jsonData.dati;
  const labels = dataArray.map(item => `${item.data} ${item.ora}`);

  const keys = ['co', 'no2', 'nox', 'o3', 'pm10'];

  const datasets = keys.map(key => ({
    label: key,
    data: dataArray.map(item => item[key]),
    borderWidth: 1,
    fill: false,
  }));


  new Chart(chartAvg, {
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
