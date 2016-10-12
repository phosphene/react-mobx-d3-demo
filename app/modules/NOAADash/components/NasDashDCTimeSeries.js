import * as d3 from 'd3';
import {crossfilter, units, geoChoroplethChart, bubbleChart, renderAll, redrawAll, filterAll, pieChart, barChart, dataCount, dataTable, pluck} from 'dc';
import * as dc from 'dc';
import * as colorbrewer from 'colorbrewer';
//we can call export at the top of the class declaration
export default class NasDashDC {

  constructor(el, props = {}) {
    console.log(props)
    //we initiate charts in constructor
    this.moveChart = dc.lineChart('#monthly-move-chart');
    this.volumeChart = dc.barChart('#monthly-volume-chart');
  }


  //and we call render here. this is not a react render. we could call it something else
  render() {

    let moveChart = this.moveChart
    let volumeChart = this.volumeChart

   d3.csv('src/stores/ndx.csv', function (data) {
      // Since its a csv file we need to format the data a bit.
      var dateFormat = d3.time.format('%m/%d/%Y');
      var numberFormat = d3.format('.2f');

      data.forEach(d => {
        d.dd = dateFormat.parse(d.date);
        d.month = d3.time.month(d.dd); // pre-calculate month for better performance
        d.close = +d.close; // coerce to number
        d.open = +d.open;
      });

      //### Create Crossfilter Dimensions and Groups

      //See the [crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference) for reference.
      var ndx = crossfilter(data);
      var all = ndx.groupAll();


      // Dimension by month
      var moveMonths = ndx.dimension(function (d) {
        return d.month;
      });
      // Group by total movement within month
      var monthlyMoveGroup = moveMonths.group().reduceSum(function (d) {
        return Math.abs(d.close - d.open);
      });
      // Group by total volume within move, and scale down result
      var volumeByMonthGroup = moveMonths.group().reduceSum(function (d) {
        return d.volume / 500000;
      });
      var indexAvgByMonthGroup = moveMonths.group().reduce(
        function (p, v) {
                    ++p.days;
          p.total += (v.open + v.close) / 2;
          p.avg = Math.round(p.total / p.days);
          return p;
        },
        function (p, v) {
                    --p.days;
          p.total -= (v.open + v.close) / 2;
          p.avg = p.days ? Math.round(p.total / p.days) : 0;
          return p;
        },
        function () {
          return {days: 0, total: 0, avg: 0};
        }
      );


      //#### Stacked Area Chart

      //Specify an area chart by using a line chart with `.renderArea(true)`.
      // <br>API: [Stack Mixin](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#stack-mixin),
      // [Line Chart](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#line-chart)
      moveChart /* dc.lineChart('#monthly-move-chart', 'chartGroup') */
        .renderArea(true)
        .width(990)
        .height(200)
        .transitionDuration(1000)
        .margins({top: 30, right: 50, bottom: 25, left: 40})
        .dimension(moveMonths)
        .mouseZoomable(true)
      // Specify a "range chart" to link its brush extent with the zoom of the current "focus chart".
        .rangeChart(volumeChart)
        .x(d3.time.scale().domain([new Date(1985, 0, 1), new Date(2012, 11, 31)]))
        .round(d3.time.month.round)
        .xUnits(d3.time.months)
        .elasticY(true)
        .renderHorizontalGridLines(true)
      //##### Legend

      // Position the legend relative to the chart origin and specify items' height and separation.
        .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
        .brushOn(false)
      // Add the base layer of the stack with group. The second parameter specifies a series name for use in the
      // legend.
      // The `.valueAccessor` will be used for the base layer
        .group(indexAvgByMonthGroup, 'Monthly Index Average')
        .valueAccessor(function (d) {
          return d.value.avg;
        })
      // Stack additional layers with `.stack`. The first paramenter is a new group.
      // The second parameter is the series name. The third is a value accessor.
        .stack(monthlyMoveGroup, 'Monthly Index Move', function (d) {
          return d.value;
        })
      // Title can be called by any stack layer.
        .title(function (d) {
          var value = d.value.avg ? d.value.avg : d.value;
          if (isNaN(value)) {
            value = 0;
          }
          return dateFormat(d.key) + '\n' + numberFormat(value);
        });

      //#### Range Chart

      // Since this bar chart is specified as "range chart" for the area chart, its brush extent
      // will always match the zoom of the area chart.
      volumeChart.width(990) /* dc.barChart('#monthly-volume-chart', 'chartGroup'); */
                 .height(40)
                 .margins({top: 0, right: 50, bottom: 20, left: 40})
                 .dimension(moveMonths)
                 .group(volumeByMonthGroup)
                 .centerBar(true)
                 .gap(1)
                 .x(d3.time.scale().domain([new Date(1985, 0, 1), new Date(2012, 11, 31)]))
                 .round(d3.time.month.round)
                 .alwaysUseRounding(true)
                 .xUnits(d3.time.months);


      //#### Rendering

      //simply call `.renderAll()` to render all charts on the page
      dc.renderAll();
      /*
         // Or you can render charts belonging to a specific chart group
         dc.renderAll('group');
         // Once rendered you can call `.redrawAll()` to update charts incrementally when the data
         // changes, without re-rendering everything
         dc.redrawAll();
         // Or you can choose to redraw only those charts associated with a specific chart group
         dc.redrawAll('group');
       */

    });

  }


  resetChart(chartName) {

    switch (chartName) {
      case "monthly-move-chart":
        this.moveChart.filterAll();
        this.volumeChart.filterAll();
        break;
      case "all":
        dc.filterAll();
        dc.renderAll();
        break;
      default:
        //Statements executed when none of the values match the value of the expression
        break;
    }

    dc.redrawAll();
  }


}
