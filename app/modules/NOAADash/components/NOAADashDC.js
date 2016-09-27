import * as d3 from 'd3';
import {crossfilter, units, geoChoroplethChart, bubbleChart, renderAll, redrawAll, filterAll, pieChart, barChart, dataCount, dataTable, pluck} from 'dc';
import * as colorbrewer from "colorbrewer";
//we can call export at the top of the class declaration
export default class NOAADashDC {

  constructor(el, props = {}) {
    //we initiate charts in constructor
    this.myCharts = NOAADashDC.initCharts();
  }

  render() {
    //de-structure myCharts object
    const {stickFunHollowBubbleChart} = this.myCharts;

    d3.json('data/thrashtown.json', (error, data) => {
      //format the data
      const surfData = this.formatData(data);
      const ttx = crossfilter(surfData);
      // build the x dimensions
      const xDims = this.buildXDimensions(ttx);
      //destructure the xDims object
      const {stickDimHollow} = xDims;
      //build the Y groups
      const yGroups = this.buildYGroups(ttx, xDims);
      //de-structure they yGroups object
      const {stickGroupHollow} = yGroups;
      //dc.js Charts chained configuration

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

      //draw the viz!
      renderAll();

    });
  }

  static initCharts() {
    const stickFunHollowBubbleChart = bubbleChart('#chart-bubble-stick-fun-hollow');

    const myCharts = {stickFunHollowBubbleChart}


    return myCharts;
  }


  resetChart(chartName) {

    let {stickFunHollowBubbleChart} = this.myCharts;

    switch (chartName) {
      case "chart-bubble-stick-fun-hollow":
        stickFunHollowBubbleChart.filterAll();
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
    const stickDimHollow  = ttx.dimension(pluck("board", (x,i) => {
      return x.name;
    }));

    const xDims = { stickDimHollow };
    return xDims;

  }


  buildYGroups(ttx, xDims){

    const {stickDimHollow} = xDims;

    // create groups (y-axis values)
    //map reduce functions
    const stickGroupHollow = this.buildStickGH(stickDimHollow);

    const yGroups = {stickGroupHollow};

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



  //end of class
}
