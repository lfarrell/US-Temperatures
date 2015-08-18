d3.csv('world/all.csv', function(world) {
    var format = d3.time.format("%m/%Y").parse,
        colors = ["#4575b4","#91bfdb","#e0f3f8","#fee090","#fc8d59","#d73027"],
        width = document.body.clientWidth/2 - 80,
        height = 1775,
        tip;

    var has_tip = document.querySelectorAll(".tooltip"); // check that there's not already a tip div

    if(has_tip.length) {
        tip = d3.select(".tooltip");
    } else {
        tip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
    }

    world.forEach(function (d) {
        d.date = format(d.date);
        d.month = d3.time.month(d.date).getMonth();
        d.year = d3.time.year(d.date).getFullYear();
        //  d.value = +d.value;
        d.anomaly = +d.anomaly;
    });

    d3.csv('us_all.csv', function(data) {
        data.forEach(function (d) {
            d.date = format(d.date);
            d.month = d3.time.month(d.date).getMonth();
            d.year = d3.time.year(d.date).getFullYear();
            d.value = +d.value;
            d.anomaly = +d.anomaly;
        });

        var dx = crossfilter(world),
            ndx = crossfilter(data),
            us_heat = dc.heatMap("#us_heat"),
            world_heat = dc.heatMap("#world_heat"),
            heatmap = ndx.dimension(function(d) { return [+d.month, +d.year]; }),
            worldheat = dx.dimension(function(d) { return [+d.month, +d.year]; });

        var us_group =  {
            all: function() {
                return grouping(data);
            }
        };

        var world_group =  {
            all: function() {
                return grouping(world);
            }
        };

        us_heat.width(width)
            .height(height)
            .margins({top: 0, right: 20, bottom: 100, left: 60})
            .dimension(heatmap)
            .group(us_group)
            .xBorderRadius(0)
            .yBorderRadius(0)
            .keyAccessor(function(d) { return +d.key[0]; })
            .valueAccessor(function(d) { return +d.key[1]; })
            .colorAccessor(function(d) { return +d.value; })
            // .colors(["#2c7bb6", "#abd9e9", "#fdae61", "#d7191c"])
            .colors(colors)
            .calculateColorDomain()
            .on('renderlet', function(chart){
                d3.selectAll("#us_heat g.cols text").each(function(d) {
                    var name = d3.select(this);
                    var y;
                    name.text(months(d));
                    y = name.attr('y');
                    name.attr('y', parseInt(y) - 50);
                });

                d3.selectAll("#us_heat .box-group").on("mouseover", function(d) {
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

        us_heat.render();

        world_heat.width(width)
            .height(height)
            .margins({top: 0, right: 20, bottom: 100, left: 60})
            .dimension(worldheat)
            .group(world_group)
            .xBorderRadius(0)
            .yBorderRadius(0)
            .keyAccessor(function(d) { return +d.key[0]; })
            .valueAccessor(function(d) { return +d.key[1]; })
            .colorAccessor(function(d) { return +d.value; })
            .colors(colors)
            .calculateColorDomain()
            .on('renderlet', function(chart){
                d3.selectAll("#world_heat g.cols text").each(function(d) {
                    var name = d3.select(this);
                    var y;
                    name.text(months(d));
                    y = name.attr('y');
                    name.attr('y', parseInt(y) - 50);
                });

                d3.selectAll("#world_heat .box-group").on("mouseover", function(d) {
                    var text = "Date: " + months(d.key[0]) +", " + d.key[1] + "<br/>" +
                        //  "Temperature: " + d.temp + " degrees (F)<br/>" +
                        "Anomaly: " + d.value + " degrees (C)";

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

        world_heat.render();


        /*  var map = dc.geoChoroplethChart("#map");
         var choropleth = ndx.dimension(function(d) { return d.state; });

         map.width(width)
         .height(500)
         .dimension(choropleth)
         .group(all_group)
         .colors(d3.scale.quantize().range(colors))
         .colorDomain([0, 200])
         .colorCalculator(function (d) { return d ? map.colors()(d) : '#ccc'; })
         .overlayGeoJson(topo.features, "state", function (d) {
         return d.properties.name;
         });

         */

        function resetAll() {
            dc.filterAll();
            dc.renderAll();
        }
        d3.selectAll(".hide").classed('hide', false);
        d3.select("#note").classed('hide', true);
    });
});

function months(m) {
    switch(m) {
        case 0:
            return "Jan";
            break;
        case 1:
            return "Feb";
            break;
        case 2:
            return "Mar";
            break;
        case 3:
            return "Apr";
            break;
        case 4:
            return "May";
            break;
        case 5:
            return "Jun";
            break;
        case 6:
            return "Jul";
            break;
        case 7:
            return "Aug";
            break;
        case 8:
            return "Sep";
            break;
        case 9:
            return "Oct";
            break;
        case 10:
            return "Nov";
            break;
        case 11:
            return "Dec";
            break;
        default:
            return "unknown";
    }
}

function grouping(data) {
    var grouping = [];

    for(var i=0, len=data.length; i<len; i++) {
        grouping.push({
            "key": [data[i].month, data[i].year],
            "temp": data[i].value,
            "state": data[i].state,
            "value": data[i].anomaly
        });
    }

    return grouping;
}