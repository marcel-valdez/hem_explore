$(document).ready(function() {
  if(typeof HEM  === 'undefined' || HEM == null) {
    HEM = {};
  }

  var stripNumberStr = function(value) {
    if(typeof value.replace !== 'undefined') 
      return value.replace(/,/g, '');

    return value;
  };

  var isNumberStr = function(value) {
    return typeof(value) !== "number" && !isNaN(stripNumberStr(value));
  };

  var isDateStr = function(value) {
    return Date.parse(value) !== "Invalid Date" && !isNaN(Date.parse(value));
  };

  HEM['parseValues'] = function(results) {
    return _.map(
      results,
      function(result, index) {
        return _.reduce(
          _.keys(result),
          function(parsedResult, key) {
            if(isNumberStr(result[key])) {
              parsedResult[key] = parseFloat(stripNumberStr(result[key]));
            } else if(isDateStr(result[key])) {
              parsedResult[key] = new Date(result[key]);
            } else {
              parsedResult[key] = result[key];
            }

            return parsedResult;
          },
          {}
        );
      }
    );
  };

  HEM['sortBy'] = function(results, sortColumn) {
    return _.sortBy(results, function(result) { return result[sortColumn]; });
  };

  HEM['groupBy'] = function(results, groupColumn, groupSize) {
    var NONE = "N/A";
    if(results.length > 0 && results[0][groupColumn]) {
      var groupedBySessionLength = 
      // Group in hour ranges
      _.chain(results)
       .groupBy(function(result) {
          var max = null;
          if(result[groupColumn] instanceof Date) {
            max = Math.ceil(result[groupColumn].getHours() / groupSize) * groupSize;
          } else  {
            max = Math.ceil(result[groupColumn] / groupSize) * groupSize;
          }

          var min = Math.max(0, max - groupSize);
          return min + " - " + max;
        })
       .map(function(group, groupRange) {
          var groupRangeColumnName = groupColumn + 'Group';
          var averaged = {
            'Count' : group.length
          };

          averaged[groupRangeColumnName] = groupRange;
          // For each key in a group
          _.each(_.keys(group[0]),
            function(key) {
              // Get average for the key
              var total = _.reduce(_.values(group),
                function(accum, session) {
                  if(typeof(session[key]) === 'number') {
                    var valueNum = session[key];
                    var valueNum = parseFloat(stripNumberStr(session[key]));
                    accum.sum += valueNum;
                    if(accum.max == NONE || accum.max < valueNum) {
                      accum.max = valueNum;
                    }
                    if(accum.min == NONE || accum.min > valueNum) {
                      accum.min = valueNum;
                    }
                    accum.count++;
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
      return _.values(groupedBySessionLength);
    }
    return results;
  };
});