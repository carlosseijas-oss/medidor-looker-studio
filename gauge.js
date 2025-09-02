const dscc = require('@google/dscc');


dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });

function drawViz(data) {
  
  document.body.innerHTML = '';

 
  if (!data.tables.DEFAULT || !data.tables.DEFAULT.length) {
    return;
  }

  
  const metricValue = data.tables.DEFAULT[0]['metric'][0];
  const style = data.style;

  const minValue = style.minValue.value !== undefined ? style.minValue.value : 0;
  const maxValue = style.maxValue.value !== undefined ? style.maxValue.value : 100;
  
  // Leemos los valores personalizados del panel de estilo.
  const endLowValue = style.endLowRange.value !== undefined ? style.endLowRange.value : (minValue + (maxValue - minValue) / 3);
  const endMediumValue = style.endMediumRange.value !== undefined ? style.endMediumRange.value : (minValue + (maxValue - minValue) * 2 / 3);

  const lowColor = style.lowColor.value ? style.lowColor.value.color : '#F44336';
  const mediumColor = style.mediumColor.value ? style.mediumColor.value.color : '#FFC107';
  const highColor = style.highColor.value ? style.highColor.value.color : '#4CAF50';

  
  google.charts.load('current', { 'packages': ['gauge'] });
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    
    const chartData = google.visualization.arrayToDataTable([
      ['Label', 'Value'],
      ['Valor', metricValue]
    ]);

    
    const options = {
      width: 400,
      height: 240,
      redFrom: minValue,
      redTo: endLowValue,
      yellowFrom: endLowValue,
      yellowTo: endMediumValue,
      greenFrom: endMediumValue,
      greenTo: maxValue,
      minorTicks: 5,
      min: minValue,
      max: maxValue,
      colors: [lowColor, mediumColor, highColor]
    };

    
    const chartContainer = document.createElement('div');
    chartContainer.id = 'chart_div';
    document.body.appendChild(chartContainer);

    const chart = new google.visualization.Gauge(document.getElementById('chart_div'));
    chart.draw(chartData, options);
  }
}