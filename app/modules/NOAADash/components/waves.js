'use strict';

/* jshint globalstrict: true */
/* global dc,d3,crossfilter,colorbrewer */

// ### Create Chart Objects
// Create chart objects assocated with the container elements identified by the css selector.
// Note: It is often a good idea to have these objects accessible at the global scope so that they can be modified or filtered by other page controls.
var windChart  = dc.pieChart("#wind-chart");
var periodChart = dc.barChart("#period-chart");
var heightChart = dc.barChart("#height-chart");
var dayOfWeekChart = dc.rowChart("#day-of-week-chart");
var moveChart = dc.lineChart("#monthly-move-chart");
//var volumeChart = dc.barChart("#monthly-volume-chart");
var yearlyBubbleChart = dc.bubbleChart("#yearly-bubble-chart");

/*
d3.csv("ndx.csv", function (data) {
    var dateFormat = d3.time.format("%m/%d/%Y");
    var numberFormat = d3.format(".2f");

    data.forEach(function (d) {
        d.dd = dateFormat.parse(d.date);
        d.month = d3.time.month(d.dd); // pre-calculate month for better performance
        d.close = +d.close; // coerce to number
        d.open = +d.open;
    });*/


d3.csv("jan_wv_dec_cc.csv", function (data) {
    var dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S");
    var numberFormat = d3.format(".2f");

    data.forEach(function (d) {
        d.dd = dateFormat.parse(d.origintime);
        d.day = d3.time.day(d.dd); // pre-calculate day for better performance
        d.month = d3.time.month(d.dd);
        d.year = d3.time.year(d.dd);
        d.wvdp   = d3.round(+d.wvdp,1);
        d.wvht = d3.round(+d.wvht,1); 
        d.wndir = +d.wndir;
    });


    var waves = crossfilter(data);
    var all = waves.groupAll();
    
    // create categorical dimension
    var wind = waves.dimension(function (d) {
        //return d.open > d.close ? "Loss" : "Gain";
        var direction = d.wndir;
        if (direction > 0 && direction <= 180)
            return 'East';
        else
            return 'West';

    });
    // produce counts records in the dimension
    var windGroup = wind.group();


    // counts per weekday
    var dayOfWeek = waves.dimension(function (d) {
        var day = d.dd.getDay();
        var name=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        return day+"."+name[day];
     });
    var dayOfWeekGroup = dayOfWeek.group();

    // determine a histogram of wave period
    var period = waves.dimension(function (d) {
        return d.wvdp;
    });
    var periodGroup = period.group();

    // determine a histogram of wave height
    var height = waves.dimension(function (d) {
        return d.wvht;
    });
    var heightGroup = height.group();

    var dateDimension = waves.dimension(function (d) {
        return d.dd;
    });

    // dimension by month
    var moveMonths = waves.dimension(function (d) {
        return d.month;
    });

    // group by total volume within move, and scale down result
    var moveMonthsGroup = moveMonths.group().reduceSum(function (d) {
        return d.wvht;
    });


    // group by total volume within move, and scale down result
    var volumeByMonthGroup = moveMonths.group().reduceSum(function (d) {
        return d.wvht / 5000;
    });

     
    var yearlyDimension = waves.dimension(function (d) {
        return d.year.getFullYear();
    });


    var yearlyPerformanceGroup = yearlyDimension.group().reduce(
        function (p, v) {
            ++p.count;
            p.wvdp += v.wvdp;
            p.wvht += v.wvht;
            p.wndir += v.wndir;
            p.wvhtdp += v.wvdp + v.wvht;
            console.log(p);
            return p;
        },
        function (p, v) {
            --p.count;
            p.wvdp -= v.wvdp;
            p.wvht -= v.wvht;
            p.wndir -= v.wndir;
            p.wvhtdp -= v.wvdp + v.wvht;
            return p;
        },
        function () {
            return {count: 0, wvdp: 0, wvht: 0, wndir: 0, wvhtdp: 0};
        }
    );

   

    yearlyBubbleChart
        .width(990) // (optional) define chart width, :default = 200
        .height(250)  // (optional) define chart height, :default = 200
        .transitionDuration(1500) // (optional) define chart transition duration, :default = 750
        .margins({top: 10, right: 50, bottom: 30, left: 60})
        .dimension(yearlyDimension)
        //Bubble chart expect the groups are reduced to multiple values which would then be used
        //to generate x, y, and radius for each key (bubble) in the group
        .group(yearlyPerformanceGroup)
        //.colors(colorbrewer.RdYlGn[9]) // (optional) define color function or array for bubbles
        .colorDomain([0, 360]) //(optional) define color domain to match your data domain if you want to bind data or color
        //##### Accessors
        //Accessor functions are applied to each value returned by the grouping
        //
        //* `.colorAccessor` The returned value will be mapped to an internal scale to determine a fill color
        //* `.keyAccessor` Identifies the `X` value that will be applied against the `.x()` to identify pixel location
        //* `.valueAccessor` Identifies the `Y` value that will be applied agains the `.y()` to identify pixel location
        //* `.radiusValueAccessor` Identifies the value that will be applied agains the `.r()` determine radius size, by default this maps linearly to [0,100]
        .colorAccessor(function (p) {
            return p.value.wndir;
        })
        .keyAccessor(function (p) {
            return p.value.wvht;
        })
        .valueAccessor(function (p) {
            return p.value.wvdp;
        })
        .radiusValueAccessor(function (p) {
            return p.value.wvhtdp;
        })
        .maxBubbleRelativeSize(0.3)
        .x(d3.scale.linear().domain([0, 20]))
        .y(d3.scale.linear().domain([0, 30]))
        .r(d3.scale.linear().domain([0, 4000000]))
        //##### Elastic Scaling
        //`.elasticX` and `.elasticX` determine whether the chart should rescale each axis to fit data.
        //The `.yAxisPadding` and `.xAxisPadding` add padding to data above and below their max values in the same unit domains as the Accessors.
        .elasticY(true)
        .elasticX(true)
        .yAxisPadding(100)
        .xAxisPadding(500)
        .renderHorizontalGridLines(true) // (optional) render horizontal grid lines, :default=false
        .renderVerticalGridLines(true) // (optional) render vertical grid lines, :default=false
        .xAxisLabel('Place Holder X') // (optional) render an axis label below the x axis
        .yAxisLabel('Place Holder Y') // (optional) render a vertical axis lable left of the y axis
        //#### Labels and  Titles
        //Labels are displaed on the chart for each bubble. Titles displayed on mouseover.
        .renderLabel(true) // (optional) whether chart should render labels, :default = true
        .label(function (p) {
            return p.key;
        })
        .renderTitle(true) // (optional) whether chart should render titles, :default = false
        .title(function (p) {
            return [p.key,
                   "Index Gain: " + numberFormat(p.value.absGain),
                   "Index Gain in Percentage: " + numberFormat(p.value.percentageGain) + "%",
                   "Fluctuation / Index Ratio: " + numberFormat(p.value.fluctuationPercentage) + "%"]
                   .join("\n");
        })
        //#### Customize Axis
        //Set a custom tick format. Note `.yAxis()` returns an axis object, so any additional method chaining applies to the axis, not the chart.
        .yAxis().tickFormat(function (v) {
            return v + "sec";
        });




    windChart
        .width(160) // (optional) define chart width, :default = 200
        .height(160) // (optional) define chart height, :default = 200
        .radius(80) // define pie radius
        .dimension(wind) // set dimension
        .group(windGroup) // set group
        /* (optional) by default pie chart will use group.key as it's label
         * but you can overwrite it with a closure */
        .label(function (d) {
            if (windChart.hasFilter() && !windChart.hasFilter(d.key))
                return d.key + "(0%)";
            return d.key + "(" + Math.floor(d.value / all.value() * 100) + "%)";
        }) /*
        // (optional) whether chart should render labels, :default = true
        .renderLabel(true)
        // (optional) if inner radius is used then a donut chart will be generated instead of pie chart
        .innerRadius(40)
        // (optional) define chart transition duration, :default = 350
        .transitionDuration(500)
        // (optional) define color array for slices
        .colors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
        // (optional) define color domain to match your data domain if you want to bind data or color
        .colorDomain([-1750, 1644])
        // (optional) define color value accessor
        .colorAccessor(function(d, i){return d.value;})
        */;


    //#### Row Chart
    dayOfWeekChart.width(200)
        .height(180)
        .margins({top: 10, left: 10, right: 10, bottom: 30})
        .group(dayOfWeekGroup)
        .dimension(dayOfWeek)
        // assign colors to each value in the x scale domain
        .ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
        .label(function (d) {
            return d.key.split(".")[1];
        })
        // title sets the row text
        .title(function (d) {
            return d.value;
        })
        .elasticX(true)
        .xAxis().ticks(4);


    //dc.barChart("#period-chart")
    periodChart.width(300)
        .height(180)
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(period)
        .group(periodGroup)
        .elasticY(true)
        // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
        .centerBar(true)
        // (optional) set gap between bars manually in px, :default=2
        .gap(45)
        // (optional) set filter brush rounding
        .round(dc.round.floor)
        .x(d3.scale.linear().domain([0, 30]))
        .renderHorizontalGridLines(true)
        // customize the filter displayed in the control span
        .filterPrinter(function (filters) {
            var filter = filters[0], s = "";
            s += numberFormat(filter[0]) + "sec -> " + numberFormat(filter[1]) + "sec";
            return s;
        });

    // Customize axis
    periodChart.xAxis().tickFormat(
        function (v) { return v + "sec"; });
    periodChart.yAxis().ticks(5);



    /* dc.barChart("#height-chart") */
    heightChart.width(300)
        .height(180)
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(height)
        .group(heightGroup)
        .elasticY(true)
        // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
        .centerBar(true)
        // (optional) set gap between bars manually in px, :default=2
        .gap(65)
        // (optional) set filter brush rounding
        .round(dc.round.floor)
        .x(d3.scale.linear().domain([0, 7]))
        .renderHorizontalGridLines(true)
        // customize the filter displayed in the control span
        .filterPrinter(function (filters) {
            var filter = filters[0], s = "";
            s += numberFormat(filter[0]) + "met -> " + numberFormat(filter[1]) + "met";
            return s;
        });

    // Customize axis
    heightChart.xAxis().tickFormat(
        function (v) { return v + "met"; });
    heightChart.yAxis().ticks(5);

/*
    volumeChart.width(990)
        .height(40)
        .margins({top: 0, right: 50, bottom: 20, left: 40})
        .dimension(moveMonths)
        .group(volumeByMonthGroup)
        .centerBar(true)
        .gap(1)
        .x(d3.time.scale().domain([new Date(2004, 0, 1), new Date(2012, 11, 31)]))
        .round(d3.time.month.round)
        .xUnits(d3.time.months);


    //#### Stacked Area Chart
    //Specify an area chart, by using a line chart with `.renderArea(true)`
    moveChart
        .renderArea(true)
        .width(990)
        .height(200)
        .transitionDuration(1000)
        .margins({top: 30, right: 50, bottom: 25, left: 40})
        .dimension(moveMonths)
        .mouseZoomable(true)
        // Specify a range chart to link the brush extent of the range with the zoom focue of the current chart.
        //.rangeChart(volumeChart)
        .x(d3.time.scale().domain([new Date(2004, 1, 1), new Date(2012, 1, 31)]))
        .round(d3.time.month.round)
        .xUnits(d3.time.months)
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
        .brushOn(false)
        // Add the base layer of the stack with group. The second parameter specifies a series name for use in the legend
        // The `.valueAccessor` will be used for the base layer
        .group(indexAvgByMonthGroup, "Monthly Index Average")
        .valueAccessor(function (d) {
            return d.wvht;
        })
        // stack additional layers with `.stack`. The first paramenter is a new group.
        // The second parameter is the series name. The third is a value accessor.
        .stack(monthlyMoveGroup, "Monthly Index Move", function (d) {
            return d.value;
        })
        // title can be called by any stack layer.
        .title(function (d) {
            var value = d.value.avg ? d.value.avg : d.value;
            if (isNaN(value)) value = 0;
            return dateFormat(d.key) + "\n" + numberFormat(value);
        });
*/


      // time graph
      moveChart.width(960)
        .height(100)
        .margins({top: 10, right: 10, bottom: 20, left: 40})
        .dimension(moveMonths)
        .group(moveMonthsGroup)
        .transitionDuration(500)
        .elasticY(true)
        //.x(d3.time.scale().domain([new Date(2013, 6, 18), new Date(2013, 6, 24)])) // scale and domain of the graph
        .x(d3.time.scale().domain(d3.extent(data, function(d) { return d.dd; })))  //use extent to auto scale the axis
        .xAxis();

    dc.dataCount(".dc-data-count")
        .dimension(waves)
        .group(all);

    dc.dataTable(".dc-data-table")
        .dimension(dateDimension)
        // data table does not use crossfilter group but rather a closure
        // as a grouping function
        .group(function (d) {
            var format = d3.format("02d");
            return d.dd.getFullYear() + "/" + format((d.dd.getMonth() + 1));
        })
        .size(10) // (optional) max number of records to be shown, :default = 25
        // dynamic columns creation using an array of closures
        .columns([
            function (d) {
                return d.origintime;
            },
            function (d) {
                return numberFormat(d.wndir);
            },
            function (d) {
                return numberFormat(d.wvht);
            },
            function (d) {
                return numberFormat(d.wvdp);
            }
        ])
        // (optional) sort using the given field, :default = function(d){return d;}
        .sortBy(function (d) {
            return d.dd;
        })
        // (optional) sort order, :default ascending
        .order(d3.ascending)
        // (optional) custom renderlet to post-process chart using D3
        .renderlet(function (table) {
            table.selectAll(".dc-table-group").classed("info", true);
        });



    dc.renderAll();
    
});
