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
    let {heightChart, periodChart, heightSLChart, periodSLChart} = this.myCharts;

    d3.csv('data/fullyear_wv_dec_cc.csv', (error, data) => {
      //format the data
      const buoyData = this.formatData(data);
      let wavesx = crossfilter(buoyData);
      // build the x dimensions
      let xDims = this.buildXDimensions(wavesx);
      //destructure the xDims object
      let {heightDim, periodDim, monthDim, windDim} = xDims;
      //build the Y groups
      let yGroups = this.buildYGroups(wavesx, xDims);
      //de-structure they yGroups object
      let {heightGroup, periodGroup, hMonthGroup, pMonthGroup, windGroup} = yGroups;
      //call number format
      const numberFormat =  this.numberFormat();
      //dc.js Charts chained configuration

      heightSLChart = this.buildSLChart(heightSLChart, data, monthDim, hMonthGroup, periodSLChart, 'Height');
      periodSLChart = this.buildSLChart(periodSLChart, data, monthDim, pMonthGroup, heightSLChart, 'Period');
      heightChart = this.buildBarChart(heightChart, heightDim, heightGroup, numberFormat, 'ft');
      periodChart = this.buildBarChart(periodChart, periodDim, periodGroup, numberFormat, 'sec');
      //draw the viz!
      renderAll();

    });
  }

  buildBarChart(chart, dim, group, format, metric){
    //dc.barChart("#period-chart")
    chart
      .width(300)
      .height(180)
      .margins({top: 10, right: 50, bottom: 30, left: 40})
      .dimension(dim)
      .group(group)
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
    /*  .filterPrinter(function (filters) {
        var filter = filters[0], s = "";
        s += format(filter[0]) + "sec" + format(filter[1]) + "sec";
        return s;
      });*/
    // Customize axis
    chart.xAxis().tickFormat(
      (v) => {return v +" "+metric;});
    chart.yAxis().ticks(5);
    return chart;
  }

  buildSLChart(chart, data, dim, group, range, dimension){
    chart
      .renderArea(true)
      .width(990)
      .height(200)
      .transitionDuration(1000)
      .margins({top: 30, right: 50, bottom: 25, left: 40})
      .dimension(dim)
      .mouseZoomable(true)
      .rangeChart(range)
    //.x(d3.time.scale().domain([new Date(2004, 0, 1), new Date(2012, 11, 31)]))
      .x(d3.time.scale().domain(d3.extent(data, (d) => { return d.dd; })))  //use extent to auto scale the axis
      .round(d3.time.month.round)
      .xUnits(d3.time.months)
      .elasticY(true)
      .renderHorizontalGridLines(true)
      .legend(legend().x(800).y(5).itemHeight(5).gap(10))
      .brushOn(false)
      .group(group, 'Monthly '+dimension+' Min')
      .valueAccessor((d) =>  {
          return d.value.count ? d.value.min : 0;
      })
      .stack(group, 'Monthly '+dimension+' Average', (d) => {
          return d.value.count ? d.value.avg : 0;
      })
    // Title can be called by any stack layer.
    /* .title(function (d) {
       var value = d.value.avg ? d.value.avg : d.value;
       if (isNaN(value)) {
       value = 0;
       }
       return dateFormat(d.key) + '\n' + numberFormat(value);
       });*/
      .stack(group, 'Monthly '+dimension+' Max', (d) => {
          return d.value.count ? d.value.max : 0;
      })
   return chart;
  }

  static initCharts() {
    const heightChart = barChart('#chart-bar-height');
    const periodChart = barChart('#chart-bar-period');
    const heightSLChart = lineChart('#chart-stacked-line-height');
    const periodSLChart = lineChart('#chart-stacked-line-period');
    const myCharts = {heightChart, periodChart, heightSLChart, periodSLChart};
    return myCharts;
  }

  resetChart(chartName) {

    let {heightChart, periodChart, heightSLChart, periodSLChart} = this.myCharts;

    switch (chartName) {
      case "chart-bar-height":
        heightChart.filterAll();
        break;
      case "chart-bar-period":
        periodChart.filterAll();
        break;
      case "chart-stacked-line-height":
        heightSLChart.filterAll();
        break;
      case "chart-stacked-line-period":
        periodSLChart.filterAll();
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
      d.wvht = d3.round((+d.wvht * 3.2)); //convert to feet
      d.wndir = +d.wndir;
    });
    return buoyData;
  }

  numberFormat(){
    return d3.format(".2f");
  }

  buildXDimensions(xwaves){
    const heightDim  = xwaves.dimension(pluck("wvht"));
    const periodDim  = xwaves.dimension(pluck("wvdp"));
    const monthDim  = xwaves.dimension(pluck("month"));
    const windDim  = xwaves.dimension(pluck("wndir"));
    const xDims = {heightDim, periodDim, monthDim, windDim};
    return xDims;
  }


  buildYGroups(wavesx, xDims){
    const {heightDim, periodDim, monthDim, windDim} = xDims;
    const heightGroup = heightDim.group();
    const periodGroup = periodDim.group();
    const windGroup = windDim.group();
    let hMonthGroup = monthDim.group();
    let pMonthGroup = monthDim.group();
    let hReducer = reductio();
    let pReducer = reductio();
    hReducer.count(true).sum('wvht').avg(true).min('wvht').max(true).median(true);
    pReducer.count(true).sum('wvdp').avg(true).min('wvdp').max(true).median(true);
    hReducer(hMonthGroup);
    pReducer(pMonthGroup);
    let yGroups = {heightGroup, periodGroup, hMonthGroup, pMonthGroup, windGroup};
    return yGroups;
  }
  //end of class
}
