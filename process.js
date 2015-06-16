var d3 = require('d3');
var crossfilter = require('crossfilter');
var _ = require('lodash');
var fs = require('fs');

fs.readFile('all.csv', 'utf8', function(err, data) {
    var all_years = [];
    var csv_data = d3.csv.parse(data);
    var udx = crossfilter(csv_data);
    var year = udx.dimension(function(d) { return d.Year; });
    var month_counts, actual_counts, month, month_avg;

    for(var i=0; i<=12; i++) {
        month_counts = year.group().reduceCount(function(d) {
            if(d[i] !== -99.99) {
                return d[i];
            } else {
                return 0;
            }
        });
        actual_counts = month_counts.top(Infinity);

        month = year.group().reduceSum(function(d) {
            if(d[i] !== -99.99) {
                return d[i];
            } else {
                return 0;
            }
        });
        month_avg =  month.top(Infinity);

        month_avg.forEach(function(d, i) {
            var year_count = _.findWhere(actual_counts, function(g){ return g.key === d.key; });
            var monthly_avg = Math.round(d.value / year_count.value , 1);
            all_years.push({month_year: (i + 1) + '/' + d.key, average: monthly_avg});
        });
    }

    fs.writeFile('data.json', JSON.stringify(all_years, null, 4), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("JSON saved to data.json");
        }
    });
});