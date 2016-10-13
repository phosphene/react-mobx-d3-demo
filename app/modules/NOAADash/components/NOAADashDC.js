import * as d3 from 'd3';
import {crossfilter, units, legend, lineChart, geoChoroplethChart, bubbleChart, renderAll, redrawAll, filterAll, pieChart, barChart, dataCount, dataTable, pluck, round} from 'dc';
import * as colorbrewer from "colorbrewer";
import reductio from 'reductio';
//we can call export at the top of the class declaration
export default class NOAADashDC {

  constructor(el, props = {}) {
    //we initiate charts in constructor
    this.myCharts = NOAADashDC.initCharts();
  }

  render() {
    //de-structure myCharts object
    //const {heightChart, periodChart} = this.myCharts;
    const {heightChart, periodChart, moveChart} = this.myCharts;

    d3.csv('data/fullyear_wv_dec_cc.csv', (error, data) => {
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
      const {heightGroup, periodGroup, waveMoveHeightGroup, myMonthGroup} = yGroups;
      //call number format
      const numberFormat =  this.numberFormat();
      //dc.js Charts chained configuration

      this.buildMoveChart(moveChart, data, monthDim, myMonthGroup);

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
        .filterPrinter((filters) => {
          var filter = filters[0], s = "";
          s += numberFormat(filter[0]) + "met -> " + numberFormat(filter[1]) + "met";
          return s;
        });

      // Customize axis
      heightChart.xAxis().tickFormat((v) => {
        return v + "met";
      });
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



      //draw the viz!
      renderAll();

    });
  }

  buildMoveChart(moveChart, data, monthDim, myMonthGroup){

    moveChart /* dc.lineChart('#monthly-move-chart', 'chartGroup') */
      .renderArea(true)
      .width(990)
      .height(200)
      .transitionDuration(1000)
      .margins({top: 30, right: 50, bottom: 25, left: 40})
      .dimension(monthDim)
      .mouseZoomable(true)
    // Specify a "range chart" to link its brush extent with the zoom of the current "focus chart".
    //   .rangeChart(volumeChart)
    //.x(d3.time.scale().domain([new Date(2004, 0, 1), new Date(2012, 11, 31)]))
      .x(d3.time.scale().domain(d3.extent(data, (d) => { return d.dd; })))  //use extent to auto scale the axis
      .round(d3.time.month.round)
      .xUnits(d3.time.months)
      .elasticY(true)
      .renderHorizontalGridLines(true)
    //##### Legend

    // Position the legend relative to the chart origin and specify items' height and separation.
      .legend(legend().x(800).y(10).itemHeight(13).gap(5))
      .brushOn(false)
    // Add the base layer of the stack with group. The second parameter specifies a series name for use in the
    // legend.
    // The `.valueAccessor` will be used for the base layer
      .group(myMonthGroup, 'Monthly Height Min')
      .valueAccessor((d) =>  {
        return d.value.min;
      })
    // Stack additional layers with `.stack`. The first paramenter is a new group.
    // The second parameter is the series name. The third is a value accessor.
      .stack(myMonthGroup, 'Monthly Height Average', (d) => {
       //console.log("val " + d.value);
        return d.value.avg;
       })
       // Title can be called by any stack layer.
      /* .title(function (d) {
       var value = d.value.avg ? d.value.avg : d.value;
       if (isNaN(value)) {
       value = 0;
       }
       return dateFormat(d.key) + '\n' + numberFormat(value);
       });*/
      .stack(myMonthGroup, "Monthly Height Max", (d) => {
        return d.value.max;
      })

  }




  static initCharts() {
    const heightChart = barChart('#chart-height');
    const periodChart = barChart('#chart-period');
    const moveChart = lineChart('#chart-month-move');

    //const myCharts = {heightChart, periodChart}
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


    buoyData.forEach(d => {
      d.dd = dateFormat.parse(d.origintime);
      d.day = d3.time.day(d.dd); // pre-calculate day for better performance
      d.week = d3.time.week(d.dd);
      d.month = d3.time.month(d.dd);
      d.year = d3.time.year(d.dd);
      d.wvdp   = d3.round(+d.wvdp,1);
      //d.wvht = d3.round((+d.wvht * 3.2),1); //convert to feet
      d.wvht = d3.round((+d.wvht * 3.2)); //convert to feet
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
    const heightGroup = heightDim.group();
    const periodGroup = periodDim.group();
    let myMonthGroup = monthDim.group();
    let reducer = reductio().count(true).sum('wvht').avg(true).min('wvht').max(true).median(true);
    reducer(myMonthGroup);
    //console.log(myMonthGroup.all());
    const waveMoveHeightGroup = monthDim.group().reduceSum((d) => {
      //console.log(d.wvht);
      //console.log("hello");
      return d.wvht;
    });
    //map reduce functions
    const yGroups = {heightGroup, periodGroup, waveMoveHeightGroup, myMonthGroup};
    return yGroups;

  }


  //end of class
}
