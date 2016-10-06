import * as d3 from 'd3';
import {crossfilter, units, lineChart, geoChoroplethChart, bubbleChart, renderAll, redrawAll, filterAll, pieChart, barChart, dataCount, dataTable, pluck, round} from 'dc';
import * as colorbrewer from "colorbrewer";
//we can call export at the top of the class declaration
export default class NOAADashDC {

  constructor(el, props = {}) {
    //we initiate charts in constructor
    this.myCharts = NOAADashDC.initCharts();
  }

  render() {
    //de-structure myCharts object
    const {heightChart, periodChart, moveChart} = this.myCharts;

    d3.csv('data/jan_wv_dec_cc.csv', (error, data) => {
        //format the data
        const buoyData = this.formatData(data);
        const wavesx = crossfilter(buoyData);
        // build the x dimensions
        const xDims = this.buildXDimensions(wavesx);
        //destructure the xDims object
        const {heightDim, periodDim, monthDim} = xDims;
        //build the Y groups
        const yGroups = this.buildYGroups(wavesx, xDims);
        //de-structure they yGroups object
        const {heightGroup, periodGroup, monthGroup} = yGroups;
        //call number format
        const numberFormat =  this.numberFormat();
        //dc.js Charts chained configuration

        /* dc.barChart("#height-chart") */
        heightChart
            .width(300)
            .height(180)
            .margins({top: 10, right: 50, bottom: 30, left: 40})
            .dimension(heightDim)
            .group(heightGroup)
            .elasticY(true)
            // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
            .centerBar(true)
            // (optional) set gap between bars manually in px, :default=2
            .gap(65)
            // (optional) set filter brush rounding
            .round(round.floor)
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

        //dc.barChart("#period-chart")
        periodChart
            .width(300)
            .height(180)
            .margins({top: 10, right: 50, bottom: 30, left: 40})
            .dimension(periodDim)
            .group(periodGroup)
            .elasticY(true)
            // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
            .centerBar(true)
            // (optional) set gap between bars manually in px, :default=2
            .gap(45)
            // (optional) set filter brush rounding
            .round(round.floor)
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

        moveChart
            .width(960)
            .height(100)
            .margins({top: 10, right: 10, bottom: 20, left: 40})
            .dimension(monthDim)
            .group(monthGroup)
            .transitionDuration(500)
            .elasticY(true)
            //.x(d3.time.scale().domain([new Date(2013, 6, 18), new Date(2013, 6, 24)])) // scale and domain of the graph
            .x(d3.time.scale().domain(d3.extent(data, function(d) { return d.dd; })))  //use extent to auto scale the axis
            .xAxis();


      //draw the viz!
      renderAll();

    });
  }

  static initCharts() {
    const heightChart = barChart('#chart-height');
    const periodChart = barChart('#chart-period');
    const moveChart = lineChart('#chart-month-move');

    const myCharts = {heightChart, periodChart, moveChart}


    return myCharts;
  }


  resetChart(chartName) {

    let {heightChart, periodChart} = this.myCharts;

    switch (chartName) {
    case "height-chart":
        heightChart.filterAll();
        break;
     case "period-chart":
        heightChart.filterAll();
        break;
      default:
        //Statements executed when none of the values match the value of the expression
        break;
    }

    redrawAll();
  }



  formatData(data){

    const buoyData = data;

    const dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S");


    buoyData.forEach(d=>{
        d.dd = dateFormat.parse(d.origintime);
        d.day = d3.time.day(d.dd); // pre-calculate day for better performance
        d.month = d3.time.month(d.dd);
        d.year = d3.time.year(d.dd);
        d.wvdp   = d3.round(+d.wvdp,1);
        d.wvht = d3.round(+d.wvht,1);
        d.wndir = +d.wndir;
    });

    return buoyData;
  }

  numberFormat(){

    return d3.format(".2f");
  }

  buildXDimensions(xwaves){
    // create dimensions (x-axis values)

    const heightDim  = xwaves.dimension(pluck("wvht"));
    const periodDim  = xwaves.dimension(pluck("wvdp"));
    const monthDim  = xwaves.dimension(pluck("month"));

    const xDims = { heightDim, periodDim, monthDim };
    return xDims;

  }


  buildYGroups(wavesx, xDims){

    const {heightDim, periodDim, monthDim} = xDims;

    // create groups (y-axis values)
    //map reduce functions
    const heightGroup = heightDim.group();
    const periodGroup = periodDim.group();
    const monthGroup = monthDim.group();

    const yGroups = {heightGroup, periodGroup, monthGroup};
    return yGroups;

  }

  //end of class
}
