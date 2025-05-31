function avgMetricsGenerate (){
    fetch('http://localhost:3000/api/data_avg')
        .then(res => res.json())
        .then(data => {
          $('#val-co').text(data.CO);
          $('#val-no2').text(data.NO2);
          $('#val-nox').text(data.NOX);
          $('#val-o3').text(data.O3);
          $('#val-pm10').text(data.PM10);
        })
        .catch(e => console.error(e));
}