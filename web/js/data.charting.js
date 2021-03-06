$(document).ready(function() {
  if(typeof HEM  === 'undefined' || HEM == null) {
    HEM = {};
  }

  var getYAxis = function() {
    return $('#y-axis').val();
  };

  var getXAxis = function() {
    return $('#x-axis').val();
  };

  HEM['plotResults'] = function(data) {
    var yAxisRowKey = getYAxis();
    var xAxisRowKey = getXAxis();
    // map the data.Results
    if(!data.Results[0][xAxisRowKey] || !data.Results[0][yAxisRowKey]) {
      return;
    }

    var dataPoints = _.map(data.Results, function(row) {
      return [
               row[xAxisRowKey].toString().substring(0,5),
               row[yAxisRowKey]
             ];
    });

    var plot = $.jqplot('chart', [dataPoints], {
      title: xAxisRowKey + ' vs. ' + yAxisRowKey,
      axesDefaults: {
        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
        tickOptions: {
          angle: -30,
          fontSize: '10pt'
        }
      },
      axes: {
        xaxis: {
          renderer: $.jqplot.CategoryAxisRenderer
        }
      }
    });
  };
});