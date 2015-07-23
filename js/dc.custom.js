d3.csv('us_all.csv', function(data) {
    var format = d3.time.format("%m/%Y").parse;
    var ndx = crossfilter(data);
    var tip;

    var has_tip = document.querySelectorAll(".tooltip"); // check that there's not already a tip div

    if(has_tip.length) {
        tip = d3.select(".tooltip");
    } else {
        tip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
    }

    data.forEach(function (d) {
        d.date = format(d.date);
        d.month = d3.time.month(d.date).getMonth();
        d.year = d3.time.year(d.date).getFullYear();
        d.value = +d.value;
        d.anomaly = +d.anomaly;
    });

    var width = document.body.clientWidth - 80;
    var height = 1775;

    var heat_chart = dc.heatMap("#heatmap");
    var heatmap = ndx.dimension(function(d) { return [+d.month, +d.year]; });

   var grouping = [];

    for(var i=0, len=data.length; i<len; i++) {



        grouping.push({
            "key": [data[i].month, data[i].year],
            "temp": data[i].value,
            "value": data[i].anomaly
        });

    }

    var heat_group =  {
        all: function() {
            return grouping;
        }
    };
  //  var heat_group = heatmap.group().reduceSum(function(d) { return d.anomaly; });


    heat_chart.width(width)
        .height(height)
        .margins({top: 0, right: 20, bottom: 100, left: 60})
        .dimension(heatmap)
        .group(heat_group)
        .xBorderRadius(0)
        .yBorderRadius(0)
        .keyAccessor(function(d) { return +d.key[0]; })
        .valueAccessor(function(d) { return +d.key[1]; })
        .colorAccessor(function(d) { return +d.value; })
       // .colors(["#2c7bb6", "#abd9e9", "#fdae61", "#d7191c"])
        .colors(["#4575b4","#91bfdb","#e0f3f8","#fee090","#fc8d59","#d73027"])
        .calculateColorDomain()
        .on('renderlet', function(chart){
            d3.selectAll("#heatmap g.cols text").each(function(d) {
                var name = d3.select(this);
                var y;
                name.text(months(d));
                y = name.attr('y');
                name.attr('y', parseInt(y) - 50);
            });

            d3.selectAll(".box-group").on("mouseover", function(d) {
                var text = "Date: " + months(d.key[0]) +", " + d.key[1] + "<br/>" +
                    "Temperature: " + d.temp + " degrees (F)<br/>" +
                    "Anomaly: " + d.value + " degrees (F)";

                tip.transition()
                    .duration(200)
                    .style("opacity", .9);

                tip.html(text)
                    .style("top", (d3.event.pageY+38)+"px")
                    .style("left", (d3.event.pageX-38)+"px");
            })
            .on("mouseout", function() {
                tip.transition()
                   .duration(500)
                   .style("opacity", 0);
            });
        });

    heat_chart.render();

  /*  var map = dc.geoChoroplethChart("#map");
    var choropleth = ndx.dimension(function(d) { return d.state; });
    var choro_group = choropleth.group().reduceSum(function(d) { return d.anomaly; });

    map.width(990)
        .height(500)
        .dimension(choropleth)
        .group(choro_group)
        .colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
        .colorDomain([0, 200])
        .colorCalculator(function (d) { return d ? map.colors()(d) : '#ccc'; })
        .overlayGeoJson(statesJson.features, "state", function (d) {
            return d.properties.name;
        }) */

    d3.select('#type').on('change', function(d) {

    });

    d3.selectAll(".hide").classed('hide', false);

    function resetAll() {
        dc.filterAll();
        dc.renderAll();
    }
});

function months(m) {
    switch(m) {
        case 0:
            return "January";
            break;
        case 1:
            return "February";
            break;
        case 2:
            return "March";
            break;
        case 3:
            return "April";
            break;
        case 4:
            return "May";
            break;
        case 5:
            return "June";
            break;
        case 6:
            return "July";
            break;
        case 7:
            return "August";
            break;
        case 8:
            return "September";
            break;
        case 9:
            return "October";
            break;
        case 10:
            return "November";
            break;
        case 11:
            return "December";
            break;
        default:
            return "unknown";
    }
}

