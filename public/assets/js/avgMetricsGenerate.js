function avgMetricsGenerate (){
    fetch('http://localhost:3000/api/data_avg')
        .then(res => res.json())
        .then(data => {
          $('#val-co').text(data.co);
          $('#val-no2').text(data.no2);
          $('#val-nox').text(data.nox);
          $('#val-o3').text(data.o3);
          $('#val-pm10').text(data.pm10);
        })
        .catch(e => console.error(e));
}