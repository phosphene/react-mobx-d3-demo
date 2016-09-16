import * as d3 from 'd3';
import {crossfilter, units, geoChoroplethChart, bubbleChart, renderAll, redrawAll, filterAll, pieChart, barChart, dataCount, dataTable, pluck} from 'dc';
import * as colorbrewer from "colorbrewer";
//we can call export at the top of the class declaration
export default class ThrashDashDC {

  constructor(el, props = {}) {
    //we initiate charts in constructor
    this.stickFunHollowBubbleChart = bubbleChart('#chart-bubble-stick-fun-hollow');
    this.stickFunQualityBubbleChart = bubbleChart('#chart-bubble-stick-fun-quality');
    this.stickFunCrowdBubbleChart = bubbleChart('#chart-bubble-stick-fun-crowd');
    this.qualityFactorChart = barChart('#chart-bar-quality-factor');
    this.hollowFactorChart = barChart('#chart-bar-hollow-factor');
    this.crowdFactorChart = barChart('#chart-bar-crowd-factor');
    this.funFactorChart = barChart('#chart-bar-fun-factor');
    this.yearChart = pieChart('#chart-ring-year');
    this.monthChart = pieChart('#chart-ring-month');
    this.dayChart = pieChart('#chart-ring-day');
  }

  render() {
    const stickFunHollowBubbleChart = this.stickFunHollowBubbleChart;
    const stickFunQualityBubbleChart = this.stickFunQualityBubbleChart;
    const stickFunCrowdBubbleChart = this.stickFunCrowdBubbleChart;
    const qualityFactorChart = this.qualityFactorChart;
    const hollowFactorChart = this.hollowFactorChart;
    const crowdFactorChart = this.crowdFactorChart;
    const funFactorChart = this.funFactorChart;
    const yearChart = this.yearChart;
    const monthChart = this.monthChart;
    const dayChart = this.dayChart;

    d3.json('data/thrashtown.json', (error, data) => {

      const surfData = this.formatData(data);

      const ttx = crossfilter(surfData);
      //console.log(ttx.size());

      const {qualityFactorDim, hollowFactorDim, crowdFactorDim,
             funFactorDim, yearDim, monthDim, dayDim,
             stickDimQuality, stickDimCrowd, stickDimHollow} = this.buildXDimensions(ttx);



      // create groups (y-axis values)
      const all = ttx.groupAll();
      const countPerQualityFactor = qualityFactorDim.group().reduceCount();
      const countPerHollowFactor = hollowFactorDim.group().reduceCount();
      const countPerCrowdFactor = crowdFactorDim.group().reduceCount();
      const countPerFunFactor = funFactorDim.group().reduceCount();
      const countPerYear = yearDim.group().reduceCount();
      const countPerMonth = monthDim.group().reduceCount();
      const countPerDay = dayDim.group().reduceCount();
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

      const stickGroupHollow = stickDimHollow.group().reduce(
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

  resetChart(chartName) {

    switch (chartName) {
      case "chart-ring-year":
        this.yearChart.filterAll();
        break;
      case "chart-ring-month":
        this.monthChart.filterAll();
        break;
      case "chart-ring-day":
        this.dayChart.filterAll();
        break;
      case "chart-bar-fun-factor":
        this.funFactorChart.filterAll();
        break;
      case "chart-bar-crowd-factor":
        this.crowdFactorChart.filterAll();
        break;
      case "chart-bar-hollow-factor":
        this.hollowFactorChart.filterAll();
        break;
      case "chart-bar-quality-factor":
        this.qualityFactorChart.filterAll();
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
    const qualityFactorDim  = ttx.dimension(pluck("waveQuality"));
    const hollowFactorDim  = ttx.dimension(pluck("hollowness"));
    const crowdFactorDim  = ttx.dimension(pluck("crowdedness"));
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

    return { qualityFactorDim, hollowFactorDim, crowdFactorDim,
             funFactorDim, yearDim, monthDim, dayDim,
             stickDimQuality, stickDimCrowd, stickDimHollow };

  }


}
