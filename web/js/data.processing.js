$(document).ready(function() {
  if(typeof HEM  === 'undefined' || HEM == null) {
    HEM = {};
  }

  HEM['groupBySessionLength'] = function(results) {
    var NONE = "N/A";
    var LEN_KEY = 'SessionLength(Minutes)';
    var MINUTES = 45;
    if(results.length > 0 && results[0][LEN_KEY]) {
      var groupedBySessionLength = 
      // Group in hour ranges
      _.chain(results)
       .groupBy(function(result) {
          return Math.ceil(result[LEN_KEY] / MINUTES);
        })
       .map(function(group, hours) {
          var averaged = {
            'SessionLengthGroup' : (hours * (MINUTES / 60)) + " hrs",
            'Count' : group.length
          };
          // For each key in a group
          _.each(_.keys(group[0]),
            function(key) {
              // Get average for the key
              console.log(_.values(group));
              var total = _.reduce(_.values(group),
                function(accum, session) {
                  if(parseFloat(session[LEN_KEY]) >= 10) {
                    var value = session[key].replace(/,/g, '');
                    if(!isNaN(value)) {
                      var valueNum = parseFloat(value);
                      accum.sum += valueNum;
                      if(accum.max == NONE || accum.max < valueNum) {
                        accum.max = valueNum;
                      }
                      if(accum.min == NONE || accum.min > valueNum) {
                        accum.min = valueNum;
                      }
                      accum.count++;
                    }
                  }
                  return accum;
                }, {
                  sum: 0,
                  max: NONE,
                  min: NONE,
                  count: 0
                });
              if(total.count > 0) {
                averaged[key] = total.sum / total.count;
                if(total.min != NONE) {
                  averaged[key + " (Min)"] = total.min;
                }
                if(total.max != NONE) {
                  averaged[key + " (Max)"] = total.max;
                }
              }
            });
          return averaged;
        }).value();
      console.log(groupedBySessionLength);
      return _.values(groupedBySessionLength);
    }
    return results;
  };
});