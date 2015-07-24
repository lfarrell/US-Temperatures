d3.csv('./us_all.csv', function(data) {
    var margins = { top: 20, right: 20, bottom: 75, left: 50 };
    var height = 500 - margins.top - margins.bottom,
        width = 1000 - margins.left - margins.right;

    var format = d3.time.format("%m/%Y").parse;

    var t = data.filter(function(d) {
        if(/^04/.test(d.date)) {
            return d.date;
        }
    })

    data.sort(function(a,b) {
        var date_one_parts = a.date.split('/');
        var date_two_parts = b.date.split('/');
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

    var xScale = d3.time.scale()
        .domain(d3.extent(t, function(d) { return format(d.date); }))
        .range([0, width]);

    var yScale = d3.scale.linear()
        .domain([d3.max(t, function(d) { return d.value }), 0])
        .range([0, height]);

    var bisectDate = d3.bisector(function(d) { return format(d.date); }).right;

    // Create Axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    var chart = d3.select("#graph").append("svg")
        .attr("width", width + margins.left + margins.right)
        .attr("height", height + margins.top + margins.bottom);

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate("+ margins.left + "," + (height + margins.top) + ")")
        .call(xAxis);

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", height + margins.bottom)
        .style("text-anchor", "zs")
        .text("Date");

    chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .call(yAxis);

    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Avg. Temp (Fahrenheit)");

    var temps = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return xScale(format(d.date)); })
        .y(function(d) {
            return yScale(d.value);
        });

    chart.append("g")
        .append("path")
        .attr("d", temps(t))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("transform", "translate(" + margins.left + "," + margins.top +")");

    function update() {

    }
});