var d3 = require('d3');
var crossfilter = require('crossfilter');
var _ = require('lodash');
var fs = require('fs');

fs.readFile('all.csv', 'utf8', function(err, data) {
    var all_years = [];
    var csv_data = d3.csv.parse(data);
    var udx = crossfilter(csv_data);
    var year = udx.dimension(function(d) { return d.date; });
    var month_counts, actual_counts, month, month_avg;

    month_counts = year.group().reduceCount(function(d) { return d.date;});
    actual_counts = month_counts.top(Infinity);

    month = year.group().reduceSum(function(d) { return d.value; });
    month_avg =  month.top(Infinity);

    month_avg.forEach(function(d, i) {
        var year_count = _.findWhere(actual_counts, function(g){ return g.key === d.key; });
        var monthly_avg = (d.value / year_count.value).toFixed(2);

        if(!/^\d{2}/.test(d.key)) d.key = '0' + d.key;
        var year = d.key.split('/')[1];
        all_years.push({month_year: d.key, average: monthly_avg, year: year });
    });

    all_years.sort(function(a, b) {
        var date_one_parts = a.month_year.split('/');
        var date_two_parts = b.month_year.split('/');
        var date_one = new Date(date_one_parts[1], date_one_parts[0] - 1);
        var date_two = new Date(date_two_parts[1], date_two_parts[0] - 1);

        if(date_one < date_two) {
            return -1;
        } else if(date_one > date_two) {
            return 1;
        } else {
            return 0;
        }
    });

    var all_sorted = d3.nest()
        .key(function(d) { return d.year; })
        .entries(all_years);

    fs.writeFile('data.json', JSON.stringify(all_sorted, null, 4), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("JSON saved to data.json");
        }
    });
});