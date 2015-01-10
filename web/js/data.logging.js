$(document).ready(function() {
  if(typeof HEM  === 'undefined' || HEM == null) {
    HEM = {};
  }

  HEM['logResults'] = function(data) {
    _.each(
      data.Results,
      function(result) {
        _.each(
          _.keys(result),
          function(key) {
            $('.data').append(key + ':' + result[key] + ', ');
          }
        );

        $('.data').append('<br>');
      }
    );
  };

  HEM['logErrors'] = function(errors) {
    _.each(errors,
      function(error) {
        $('.errors').append(error);
        $('.errors').append('<br>');
    });
  };
});