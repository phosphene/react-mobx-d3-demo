import * as d3 from 'd3';
import * as dc from 'dc'
import {crossfilter, units, geoChoroplethChart, bubbleChart, renderAll, redrawAll, filterAll, pieChart, barChart, dataCount, dataTable, pluck} from 'dc';
import * as colorbrewer from "colorbrewer";
//we can call export at the top of the class declaration
export default class ThrashDashDC {

  constructor(el, props = {}) {
    //we initiate charts in constructor
    this.myCharts = ThrashDashDC.initCharts();
  }

  render() {
    //de-structure myCharts object
    const {stickFunHollowBubbleChart, stickFunQualityBubbleChart, stickFunCrowdBubbleChart,
           qualityFactorChart, hollowFactorChart , crowdFactorChart,
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
             stickGroupQuality, stickGroupCrowd, stickGroupHollow} = yGroups;
      //dc.js Charts chained configuration
      stickFunQualityBubbleChart
        .width(400)
        .height(250)
        .transitionDuration(1500)
        .margins({top:10, right:50, bottom:30, left:40})
        .dimension(stickDimQuality)
        .group(stickGroupQuality)
        .ordinalColors(colorbrewer.Spectral[7])
        .colorAccessor((p) => {
          return p.value.board;
        })
        .keyAccessor((p) => {
          return p.value.avgWaveQuality;
        })
        .valueAccessor((p) => {
          return p.value.avgFunFactor;
        })
        .radiusValueAccessor((p) => {
          return p.value.count;
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
        .xAxisLabel('Quality')
        .yAxisLabel('Fun')
        .yAxis().tickFormat(function (v) {
          return v + '%';
        });

      stickFunHollowBubbleChart
        .width(400)
        .height(250)
        .transitionDuration(1500)
        .margins({top:10, right:50, bottom:30, left:40})
        .dimension(stickDimHollow)
        .group(stickGroupHollow)
        .ordinalColors(colorbrewer.Spectral[7])
        .colorAccessor((p) => {
          return p.value.board;
        })
        .keyAccessor((p) => {
          return p.value.avgHollowness;
        })
        .valueAccessor((p) => {
          return p.value.avgFunFactor;
        })
        .radiusValueAccessor((p) => {
          return p.value.count;
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
        .xAxisLabel('Hollow')
        .yAxisLabel('Fun')
        .yAxis().tickFormat(function (v) {
          return v + '%';
        });

      stickFunCrowdBubbleChart
        .width(400)
        .height(250)
        .transitionDuration(1500)
        .margins({top:10, right:50, bottom:30, left:40})
        .dimension(stickDimCrowd)
        .group(stickGroupCrowd)
        .ordinalColors(colorbrewer.Spectral[7])
        .colorAccessor((p) => {
          return p.value.board;
        })
        .keyAccessor((p) => {
          return p.value.avgCrowdedness;
        })
        .valueAccessor((p) => {
          return p.value.avgFunFactor;
        })
        .radiusValueAccessor((p) => {
          return p.value.count;
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
        .xAxisLabel('Crowd')
        .yAxisLabel('Fun')
        .yAxis().tickFormat(function (v) {
          return v + '%';
        });


      qualityFactorChart
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
      hollowFactorChart.xAxis().tickValues([0,1,2,3,4,5]);

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
    const stickFunHollowBubbleChart = bubbleChart('#chart-bubble-stick-fun-hollow');
    const stickFunQualityBubbleChart = bubbleChart('#chart-bubble-stick-fun-quality');
    const stickFunCrowdBubbleChart = bubbleChart('#chart-bubble-stick-fun-crowd');
    const qualityFactorChart = barChart('#chart-bar-quality-factor');
    const hollowFactorChart = barChart('#chart-bar-hollow-factor');
    const crowdFactorChart = barChart('#chart-bar-crowd-factor');
    const funFactorChart = barChart('#chart-bar-fun-factor');
    const yearChart = pieChart('#chart-ring-year');
    const monthChart = pieChart('#chart-ring-month');
    const dayChart = pieChart('#chart-ring-day');

    const myCharts = {stickFunHollowBubbleChart, stickFunQualityBubbleChart, stickFunCrowdBubbleChart,
                      qualityFactorChart, hollowFactorChart , crowdFactorChart,
                      funFactorChart, yearChart, monthChart, dayChart};


    return myCharts;
  }


  resetChart(chartName) {

    let {stickFunHollowBubbleChart, stickFunQualityBubbleChart, stickFunCrowdBubbleChart,
         qualityFactorChart, hollowFactorChart , crowdFactorChart,
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
        hollowFactorChart.filterAll();
        break;
      case "chart-bar-quality-factor":
        qualityFactorChart.filterAll();
        break;
      default:
        //Statements executed when none of the values match the value of the expression
        break;
    }

    redrawAll();
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
    const stickGroupQuality = this.buildStickGQ(stickDimQuality);
    const stickGroupCrowd = this.buildStickGC(stickDimCrowd);
    const stickGroupHollow = this.buildStickGH(stickDimHollow);

    const yGroups = {all, countPerQualityFactor, countPerHollowFactor, countPerCrowdFactor,
                     countPerFunFactor, countPerYear, countPerMonth, countPerDay,
                     stickGroupQuality, stickGroupCrowd, stickGroupHollow};

    return yGroups;

  }


  //map reduce
  buildStickGH(stickDimHollow){
    const stickGH = stickDimHollow.group().reduce(
      (p, v) => {
                    ++p.count;
        p.board = v.board.name;
        p.hollowness += v.hollowness;
        p.funFactor += v.funFactor;
        p.avgHollowness = p.hollowness / p.count;
        p.avgFunFactor = p.funFactor / p.count;
        return p;
      },
      (p, v) => {
        p.hollowness -= v.hollowness;
        p.funFactor -= v.funFactor;
        p.avgHollowness = p.count ? v.hollowness / p.count : 0;
        p.avgFunFactor = p.count ? p.funFactor / p.count : 0;
                        --p.count;
        return p
      },
      () => {
        return {
          board:0,
          count:0,
          hollowness:0,
          funFactor:0,
          avgFunFactor:0,
          avgCrowdedness:0,
          avgFunToCrowd:0,
        };
      }
    );
    return stickGH;
  }


  buildStickGQ(stickDimQuality){
    const stickGroupQuality = stickDimQuality.group().reduce(
      (p, v) => {
                    ++p.count;
        p.board = v.board.name;
        p.funFactor += v.funFactor;
        p.waveQuality += v.waveQuality;
        p.avgFunFactor = p.funFactor / p.count;
        p.avgWaveQuality = p.waveQuality / p.count;
        return p;
      },
      (p, v) => {
        p.funFactor -= v.funFactor;
        p.waveQuality -= v.waveQuality;
        p.avgFunFactor = p.count ? p.funFactor / p.count : 0;
        p.avgWaveQuality = p.count ? p.waveQuality / p.count : 0;
                          --p.count;
        return p
      },
      () => {
        return {
          board:0,
          count:0,
          waveQuality:0,
          funFactor:0,
          avgFunFactor:0,
          avgWaveQuality:0,
        };
      }
    );
    return stickGroupQuality;
  }

  buildStickGC(stickDimCrowd){
    const stickGroupCrowd = stickDimCrowd.group().reduce(
      (p, v) => {
                    ++p.count;
        p.board = v.board.name;
        p.crowdedness += v.crowdedness;
        p.funFactor += v.funFactor;
        p.avgCrowdedness = p.crowdedness / p.count;
        p.avgFunFactor = p.funFactor / p.count;
        return p;
      },
      (p, v) => {
        p.crowdedness -= v.crowdedness;
        p.funFactor -= v.funFactor;
        p.avgCrowdedness = p.count ? v.crowdedness / p.count : 0;
        p.avgFunFactor = p.count ? p.funFactor / p.count : 0;
                        --p.count;
        return p
      },
      () => {
        return {
          board:0,
          count:0,
          crowdedness:0,
          funFactor:0,
          avgFunFactor:0,
          avgCrowdedness:0,
          avgFunToCrowd:0,
        };
      }
    );
    return stickGroupCrowd;
  }

  //end of class
}
