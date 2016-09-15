import * as d3 from 'd3';
import crossfilter from 'crossfilter2';

export default class StackedBarExample {


  constructor(el, props = {}) {
    console.log(props);
    this.xf = {};
  }



  render (){

    const margin = this.buildMargin();

    const {svg, width, height, g} = this.buildSVG(margin);

    const x = this.buildXaxis(width);

    const y = this.buildYAxis(height);



    const z = d3.scaleOrdinal()
                .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    const stack = d3.stack();

    d3.csv("data/stackdata.csv", this.type, data => {
      this.xf = crossfilter(data);
      x.domain(data.map(function(d) { return d.State; }));
      y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
      z.domain(data.columns.slice(1));

      g.selectAll(".serie")
       .data(stack.keys(data.columns.slice(1))(data))
       .enter().append("g")
       .attr("class", "serie")
       .attr("fill", function(d) { return z(d.key); })
       .selectAll("rect")
       .data(function(d) { return d; })
       .enter().append("rect")
       .attr("x", function(d) { return x(d.data.State); })
       .attr("y", function(d) { return y(d[1]); })
       .attr("height", function(d) { return y(d[0]) - y(d[1]); })
       .attr("width", x.bandwidth());

      g.append("g")
       .attr("class", "axis axis--x")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x));

      g.append("g")
       .attr("class", "axis axis--y")
       .call(d3.axisLeft(y).ticks(10, "s"))
       .append("text")
       .attr("x", 2)
       .attr("y", y(y.ticks(10).pop()))
       .attr("dy", "0.35em")
       .attr("text-anchor", "start")
       .attr("fill", "#000")
       .text("Population");

      const legend = this.buildLegend(data, width, g, z);
    });


  }


  type(d, i, columns) {
    let t = 0;
    for (i = 1; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    //for (let i of columns){ t += d[i] = +d[i]; console.log(i);}
    d.total = t;
    return d;
  }


  buildMargin(){

    return {top: 20, right: 20, bottom: 30, left: 40};

  }



  buildSVG(margin) {

    const svg = d3.select("svg");
    const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    return {svg, width, height, g};

  }

  buildXaxis(width) {

    const x = d3.scaleBand()
                .rangeRound([0, width])
                .padding(0.1)
                .align(0.1);
    return x;
  }

  buildYAxis(height) {

    const y = d3.scaleLinear()
                .rangeRound([height, 0]);

    return y;
  }


  buildLegend(data, width, g, z) {

    const legend =   g.selectAll(".legend")
                      .data(data.columns.slice(1).reverse())
                      .enter().append("g")
                      .attr("class", "legend")
                      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
                      .style("font", "10px sans-serif");

    legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .attr("fill", z);

    legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .attr("text-anchor", "end")
          .text(function(d) { return d; });

    return legend;

  }

 buildBrush(width,height,x,y){
  const brush = d3.brushX()
                .extent([
                  [0, 0],
                  [width, height]
                ])
                .on("end", function() {

		  const s = d3.event.selection;
                  xScale.domain([navXScale.invert(s[0]), navXScale.invert(s[1])]);

                  console.log("domain modified");

                  svg.select(".x").call(x);
                  console.log("x axis modified");

                  svg.select(".y").call(y);
                  console.log("y modified");
                });

   return brush;

 }



buildBrushTwo(){
  let brush = d3.brushX()
                .extent([[0, 0], [width, height]])
                .on("end", brushended);


}


brushEnded(brush) {
    if (!d3.event.sourceEvent) return; // Only transition after input.
    if (!d3.event.selection) return; // Ignore empty selections.
    var domain0 = d3.event.selection.map(x.invert),
        domain1 = domain0.map(d3.timeDay.round);

    // If empty when rounded, use floor & ceil instead.
    if (domain1[0] >= domain1[1]) {
      domain1[0] = d3.timeDay.floor(domain0[0]);
      domain1[1] = d3.timeDay.ceil(domain0[1]);
    }

    d3.select(this)
      .transition()
      .call(brush.move, domain1.map(x));
  }


}
