import * as d3 from 'd3';
import * as dc from 'dc'
import {crossfilter, units, geoChoroplethChart, bubbleChart, renderAll, redrawAll, filterAll, pieChart, barChart, dataCount, dataTable, pluck} from 'dc';
import * as colorbrewer from "colorbrewer";
import reductio from "reductio";
//we can call export at the top of the class declaration
export default class ThrashDashDC {

  constructor(el, props = {}) {
    //we initiate charts in constructor
    this.myCharts = ThrashDashDC.initCharts();
  }

  render() {
    //de-structure myCharts object
    let {SFHBubbleChart, SFQBubbleChart, SFCBubbleChart,
           QFBarChart, HFBarChart, crowdFactorChart,
           funFactorChart, yearChart, monthChart, dayChart} = this.myCharts;

    d3.json('data/thrashtown.json', (error, data) => {
      //format the data
      const surfData = this.formatData(data);
      const ttx = crossfilter(surfData);
      // build the x dimensions
      const xDims = this.buildXDimensions(ttx);
      //destructure the xDims object
      const {qualityFactorDim, hollowFactorDim, crowdFactorDim,
             funFactorDim, yearDim, monthDim, dayDim,
             stickDimQuality, stickDimCrowd, stickDimHollow} = xDims;
      //build the Y groups
      const yGroups = this.buildYGroups(ttx, xDims);
      //de-structure they yGroups object
      const {all, countPerQualityFactor, countPerHollowFactor, countPerCrowdFactor,
             countPerFunFactor, countPerYear, countPerMonth,countPerDay,
             stickGroup} = yGroups;

   SFQBubbleChart = this.buildBubbleChart(SFQBubbleChart, stickDimQuality, stickGroup, "quality", "fun");
   SFHBubbleChart = this.buildBubbleChart(SFHBubbleChart, stickDimHollow, stickGroup, "hollow", "fun");
   SFCBubbleChart = this.buildBubbleChart(SFCBubbleChart, stickDimCrowd, stickGroup, "crowd", "fun");
   QFBarChart = this.buildBarChart(QFBarChart, qualityFactorDim, countPerQualityFactor,"metric", "quality", "sessions");
   HFBarChart = this.buildBarChart(HFBarChart, hollowFactorDim, countPerHollowFactor,"metric", "hollow", "sessions");
/*      qualityFactorChart
        .width(300)
        .height(180)
        .dimension(qualityFactorDim)
        .group(countPerQualityFactor)
        .x(d3.scale.linear().domain([0,5.2]))
        .elasticY(true)
        .centerBar(true)
        .barPadding(5)
        .xAxisLabel('Quality Factor')
        .yAxisLabel('Sessions')
      qualityFactorChart.xAxis().tickValues([0,1,2,3,4,5]);

      hollowFactorChart
        .width(300)
        .height(180)
        .dimension(hollowFactorDim)
        .group(countPerHollowFactor)
        .x(d3.scale.linear().domain([0,5.2]))
        .elasticY(true)
        .centerBar(true)
        .barPadding(5)
        .xAxisLabel('Hollow Factor')
        .yAxisLabel('Sessions')
      hollowFactorChart.xAxis().tickValues([0,1,2,3,4,5]);*/

      crowdFactorChart
        .width(300)
        .height(180)
        .dimension(crowdFactorDim)
        .group(countPerCrowdFactor)
        .x(d3.scale.linear().domain([0,5.2]))
        .elasticY(true)
        .centerBar(true)
        .barPadding(5)
        .xAxisLabel('Crowd Factor')
        .yAxisLabel('Sessions')
      crowdFactorChart.xAxis().tickValues([0,1,2,3,4,5]);

      funFactorChart
        .width(300)
        .height(180)
        .dimension(funFactorDim)
        .group(countPerFunFactor)
        .x(d3.scale.linear().domain([0,5.2]))
        .elasticY(true)
        .centerBar(true)
        .barPadding(5)
        .xAxisLabel('Fun Factor')
        .yAxisLabel('Sessions')
      funFactorChart.xAxis().tickValues([0, 1, 2, 3, 4, 5]);

      yearChart
        .width(150)
        .height(150)
        .dimension(yearDim)
        .group(countPerYear)
        .innerRadius(20);

      monthChart
        .width(150)
        .height(150)
        .dimension(monthDim)
        .group(countPerMonth)
        .innerRadius(20)
        .ordering((d) => {
          const order = {
            'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4,
            'may': 5, 'jun': 6, 'jul': 7, 'aug': 8,
            'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
          };
          return order[d.key];
        });

      dayChart
        .width(150)
        .height(150)
        .dimension(dayDim)
        .group(countPerDay)
        .innerRadius(20)
        .ordering((d) => {
          const order = {
            'mon': 0, 'tue': 1, 'wed': 2, 'thu': 3,
            'fri': 4, 'sat': 5, 'sun': 6
          }
          return order[d.key];
        });


      //draw the viz!
      renderAll();

    });
  }


  static initCharts() {
    const SFHBubbleChart = bubbleChart('#chart-bubble-stick-fun-hollow');
    const SFQBubbleChart = bubbleChart('#chart-bubble-stick-fun-quality');
    const SFCBubbleChart = bubbleChart('#chart-bubble-stick-fun-crowd');
    const QFBarChart = barChart('#chart-bar-quality-factor');
    const HFBarChart = barChart('#chart-bar-hollow-factor');
    const crowdFactorChart = barChart('#chart-bar-crowd-factor');
    const funFactorChart = barChart('#chart-bar-fun-factor');
    const yearChart = pieChart('#chart-ring-year');
    const monthChart = pieChart('#chart-ring-month');
    const dayChart = pieChart('#chart-ring-day');

    const myCharts = {SFHBubbleChart, SFQBubbleChart, SFCBubbleChart,
                      QFBarChart, HFBarChart, crowdFactorChart,
                      funFactorChart, yearChart, monthChart, dayChart};


    return myCharts;
  }


  resetChart(chartName) {

    let {SFHBubbleChart, SFQBubbleChart, SFCBubbleChart,
         QFBarChart, HFBarChart, crowdFactorChart,
         funFactorChart, yearChart, monthChart, dayChart} = this.myCharts;

    switch (chartName) {
      case "chart-ring-year":
        yearChart.filterAll();
        break;
      case "chart-ring-month":
        monthChart.filterAll();
        break;
      case "chart-ring-day":
        dayChart.filterAll();
        break;
      case "chart-bar-fun-factor":
        funFactorChart.filterAll();
        break;
      case "chart-bar-crowd-factor":
        crowdFactorChart.filterAll();
        break;
      case "chart-bar-hollow-factor":
        HFBarChart.filterAll();
        break;
      case "chart-bar-quality-factor":
        QFBarChart.filterAll();
        break;
      default:
        //Statements executed when none of the values match the value of the expression
        break;
    }

    redrawAll();
  }

buildBarChart(chart, dim, group, metric, x, y){
    //dc.barChart("#period-chart")
    chart
      .width(300)
      .height(180)
      .dimension(dim)
      .group(group)
      .x(d3.scale.linear().domain([0, 5.2]))
      .elasticY(true)
      .centerBar(true)
      .barPadding(5)
      .xAxisLabel(x)
      .yAxisLabel(y)
    return chart;
  }


  buildBubbleChart(chart, dim, group, x, y){
        //console.log(group.top(2));
      chart
        .width(400)
        .height(250)
        .transitionDuration(1500)
        .margins({top:10, right:50, bottom:30, left:40})
        .dimension(dim)
        .group(group)
        .ordinalColors(colorbrewer.Spectral[7])
        .colorAccessor((p) => {
          return p.key;
        })
        .keyAccessor((p) => {
          //return p.value.quality.avg;
          return p.value[x].avg;
        })
        .valueAccessor((p) => {
          return p.value[y].avg;
        })
        .radiusValueAccessor((p) => {
          return p.value.fun.count;
        })
        .maxBubbleRelativeSize(0.2)
        .x(d3.scale.linear().domain([0, 5]))
        .y(d3.scale.linear().domain([0, 5]))
        .r(d3.scale.linear().domain([0, 100]))
        .elasticY(false)
        .elasticX(false)
        .yAxisPadding(100)
        .xAxisPadding(500)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .xAxisLabel(x)
        .yAxisLabel(y)
        .yAxis().tickFormat(function (v) {
          return v + '%';
        });
    return chart;
  }

  formatData(data){

    const surfData = data;

    const fullDateFormat = d3.time.format("%a, %d %b %Y %X %Z");
    const yearFormat = d3.time.format('%Y');
    const monthFormat = d3.time.format('%b');
    const dayFormat = d3.time.format('%a');

    surfData.forEach(d=>{
      let dateObj  = new Date(d.sessionDate);
      d.sessionDateFormatted = fullDateFormat(dateObj);
      d.sessionYear = +yearFormat(dateObj);
      d.sessionMonth = monthFormat(dateObj);
      d.sessionDay = dayFormat(dateObj);
    });

    return surfData;
  }



  buildXDimensions(ttx){
    // create dimensions (x-axis values)
    const qualityFactorDim  = ttx.dimension(dc.pluck("waveQuality"));
    const hollowFactorDim  = ttx.dimension(dc.pluck("hollowness"));
    const crowdFactorDim  = ttx.dimension(dc.pluck("crowdedness"));
    const funFactorDim  = ttx.dimension(pluck("funFactor"));
    const yearDim  = ttx.dimension(pluck("sessionYear"));
    const monthDim  = ttx.dimension(pluck("sessionMonth"));
    const dayDim  = ttx.dimension(pluck("sessionDay"));
    const stickDimQuality  = ttx.dimension(pluck("board", (x,i) => {
      return x.name;
    }));
    const stickDimCrowd  = ttx.dimension(pluck("board", (x,i) => {
      return x.name;
    }));
    const stickDimHollow  = ttx.dimension(pluck("board", (x,i) => {
      return x.name;
    }));

    const xDims = { qualityFactorDim, hollowFactorDim, crowdFactorDim,
                    funFactorDim, yearDim, monthDim, dayDim,
                    stickDimQuality, stickDimCrowd, stickDimHollow };
    return xDims;

  }


  buildYGroups(ttx, xDims){

    const {qualityFactorDim, hollowFactorDim, crowdFactorDim,
           funFactorDim, yearDim, monthDim, dayDim,
           stickDimQuality, stickDimCrowd, stickDimHollow} = xDims;

    // create groups (y-axis values)
    const all = ttx.groupAll();
    const countPerQualityFactor = qualityFactorDim.group().reduceCount();
    const countPerHollowFactor = hollowFactorDim.group().reduceCount();
    const countPerCrowdFactor = crowdFactorDim.group().reduceCount();
    const countPerFunFactor = funFactorDim.group().reduceCount();
    const countPerYear = yearDim.group().reduceCount();
    const countPerMonth = monthDim.group().reduceCount();
    const countPerDay = dayDim.group().reduceCount();
    //map reduce functions
    let stickGroup = stickDimQuality.group();
    let bReducer = reductio();
    bReducer.value("quality").count(true).sum((d)=>{return d.waveQuality;}).avg(true);
    bReducer.value("fun").count(true).sum((d)=>{return d.funFactor}).avg(true);
    bReducer.value("crowd").count(true).sum((d)=>{return d.crowdedness}).avg(true);
    bReducer.value("hollow").count(true).sum((d)=>{return d.hollowness}).avg(true);
    bReducer(stickGroup);

    const yGroups = {all, countPerQualityFactor, countPerHollowFactor, countPerCrowdFactor,
                     countPerFunFactor, countPerYear, countPerMonth, countPerDay,
                     stickGroup};

    return yGroups;

  }


  //end of class
}
