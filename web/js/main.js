$(document).ready(function() {
  var processResults = function(data) {
    $('.errors').html('');
    $('.data').html('');
    $('.grid-container').html('<table id="grid"></table><div id="pager"></div>');
    $('.chart-container').html('<div id="chart"></div>');

    HEM.logErrors(data.Errors);
    HEM.logResults(data);

    data.Results = HEM.parseValues(data.Results);
    if($('#group-by')[0].checked == true) {
      var groupByColumn = $('#group-by-col').val();
      var groupBySize = $('#group-by-size').val();
      data.Results = HEM.groupBy(data.Results, groupByColumn, groupBySize);
    }

    if($('#sort-by')[0].checked == true) {
      var sortByColumn = $('#sort-by-col').val();
      data.Results = HEM.sortBy(data.Results, sortByColumn);
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