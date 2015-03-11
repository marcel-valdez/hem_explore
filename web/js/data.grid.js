$(document).ready(function() {
  if(typeof HEM  === 'undefined' || HEM == null) {
    HEM = {};
  }

  HEM['gridResults'] = function(data) {
    $('#grid').jqGrid({
      datatype: 'local',
      height: 250,
      colNames: _.keys(data.Results[0]),
      colModel: _.map(_.keys(data.Results[0]), function(key) {
        var model = { 'name': key, 'index': key };
        if(typeof(data.Results[0][key]) === "number") {
          model['sorttype'] = 'int';
        } else if(data.Results[0][key] instanceof Date) {
          model['sorttype'] = 'date';
        }

        return model;
      }),
      multiselect: true,
      caption: data.ResultType,
      pager: '#pager',
      rowNum: 10,
      rowList: [10, 20, 50, 100],
      gridview: true,
      viewrecords: true
    });

    $("#grid").jqGrid('clearGridData', true);

    _.each(
      data.Results,
      function(result, index) {
        $("#grid").jqGrid('addRowData', index+1, result);
    });
  };
});