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
    let {heightChart, periodChart, moveChart, periodSLChart} = this.myCharts;

    d3.csv('data/fullyear_wv_dec_cc.csv', (error, data) => {
      //format the data
      const buoyData = this.formatData(data);
      let wavesx = crossfilter(buoyData);
      // build the x dimensions
      let xDims = this.buildXDimensions(wavesx);
      //destructure the xDims object
      let {heightDim, periodDim, hMonthDim, pMonthDim} = xDims;
      //build the Y groups
      let yGroups = this.buildYGroups(wavesx, xDims);
      //de-structure they yGroups object
      let {heightGroup, periodGroup, hMonthGroup, pMonthGroup} = yGroups;
      //console.log(myMonthGroup.all());
      //console.log(yourMonthGroup.all());
      //call number format
      const numberFormat =  this.numberFormat();
      //dc.js Charts chained configuration

      moveChart = this.buildMoveChart(moveChart, data, hMonthDim, hMonthGroup);
      periodSLChart = this.buildPeriodSLChart(periodSLChart, data, pMonthDim, pMonthGroup);
      this.buildHeightChart(heightChart, heightDim, heightGroup);
      this.buildPeriodChart(periodChart, periodDim, periodGroup, numberFormat);
      //draw the viz!
      renderAll();

    });
  }



  buildPeriodChart(periodChart, periodDim, periodGroup, numberFormat){
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

  }


  buildHeightChart(heightChart, heightDim, heightGroup){
    let numberFormat = this.numberFormat();
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

  }


  buildMoveChart(moveChart, data, monthDim, monthGroup){

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
      .group(monthGroup, 'Monthly Height Min')
      .valueAccessor((d) =>  {
          //console.log(d.value.height.count + '  ' + d.value.height.avg);
          let avg = d.value.height.count ? d.value.height.avg : 0;
          //console.log(avg);
        //return d.value.height.count;
        return avg;
      })
    // Stack additional layers with `.stack`. The first paramenter is a new group.
    // The second parameter is the series name. The third is a value accessor.
/*      .stack(monthGroup, 'Monthly Height Average', (d) => {
        //console.log("val " + d.value);
        return d.value.height.avg;
      })*/
    // Title can be called by any stack layer.
    /* .title(function (d) {
       var value = d.value.avg ? d.value.avg : d.value;
       if (isNaN(value)) {
       value = 0;
       }
       return dateFormat(d.key) + '\n' + numberFormat(value);
       });*/
/*      .stack(monthGroup, "Monthly Height Max", (d) => {
        return d.value.height.max;
      })*/
   return moveChart;
  }

  buildPeriodSLChart(periodSLChart, data, monthDim, monthGroup){

    periodSLChart /* dc.lineChart('#monthly-move-chart', 'chartGroup') */
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
      .group(monthGroup, 'Monthly Period Min')
      .valueAccessor((d) =>  {
          let avg = d.value.period.count ? d.value.period.avg : 0;
          console.log(avg);
        //return d.value.period.count;
        return avg;
      })
    // Stack additional layers with `.stack`. The first paramenter is a new group.
    // The second parameter is the series name. The third is a value accessor.
/*      .stack(monthGroup, 'Monthly Period Average', (d) => {
        //console.log("val " + d.value);
        return d.value.period.avg;
      })*/
    // Title can be called by any stack layer.
    /* .title(function (d) {
       var value = d.value.avg ? d.value.avg : d.value;
       if (isNaN(value)) {
       value = 0;
       }
       return dateFormat(d.key) + '\n' + numberFormat(value);
       });*/
/*      .stack(monthGroup, "Monthly Period Max", (d) => {
        return d.value.period.max;
      })*/
   return periodSLChart;
  }


  static initCharts() {
    const heightChart = barChart('#chart-height');
    const periodChart = barChart('#chart-period');
    const moveChart = lineChart('#chart-month-move');
    const periodSLChart = lineChart('#chart-period-stacked-line');

    const myCharts = {heightChart, periodChart, moveChart, periodSLChart}
    return myCharts;
  }


  resetChart(chartName) {

    let {heightChart, periodChart} = this.myCharts;

    switch (chartName) {
      case "height-chart":
        heightChart.filterAll();
        break;
      case "period-chart":
        periodChart.filterAll();
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
    const hMonthDim  = xwaves.dimension(pluck("month"));
    const pMonthDim = xwaves.dimension(pluck("month"));
    const xDims = { heightDim, periodDim, hMonthDim, pMonthDim};
    return xDims;
  }


  buildYGroups(wavesx, xDims){

    const {heightDim, periodDim, hMonthDim, pMonthDim} = xDims;

    // create groups (y-axis values)
    const heightGroup = heightDim.group();
    const periodGroup = periodDim.group();
    let hMonthGroup = hMonthDim.group();
    let pMonthGroup = pMonthDim.group();
    let reducer = reductio();
    reducer.value('height').count(true).sum('wvht').avg(true).min('wvht').max(true).median(true);
    reducer.value('period').count(true).sum('wvdp').avg(true).min('wvdp').max(true).median(true);
    reducer(hMonthGroup);
    reducer(pMonthGroup);

    //console.log(myMonthGroup.all());
       //map reduce functions
    let yGroups = {heightGroup, periodGroup, hMonthGroup, pMonthGroup};
    return yGroups;
  }
  //end of class
}
