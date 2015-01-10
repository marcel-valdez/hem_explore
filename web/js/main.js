$(document).ready(function() {
  var processResults = function(data) {
    $('.errors').html('');
    $('.data').html('');
    $('.grid-container').html('<table id="grid"></table><div id="pager"></div>');
    $('.chart-container').html('<div id="chart"></div>');

    HEM.logErrors(data.Errors);
    HEM.logResults(data);
    if($('#group-by-session-length')[0].checked == true) {
      data.Results = HEM.groupBySessionLength(data.Results);
    }

    if(data.Results && data.Results.length > 0) {
      HEM.gridResults(data);
      HEM.plotResults(data);
    }
  };

  var executeQuery = function(query) {
    $.ajax({
        url: "http://localhost:8080/Query?q=" + query
    }).then(function(data) {
      processResults(data);
    });
  };

  $(document).ready(function() {
    $('#query-btn').click(function(e) { 
      executeQuery($('#query-text').val());
    });
  });
});