import * as d3 from 'd3';

export default class BarChartBrushExample {


  constructor(el, props = {}) {
    console.log(props)
  }



  render() {

    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 960 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const brushYearStart = 1848;
    const brushYearEnd = 1905;

    // Scales
    const x = d3.scaleOrdinal().range([0, width - 60], .1);
    const y = d3.scaleLinear().range([height, 0]);

    // Prepare the barchart canvas
    const barchart = d3.select("body").append("svg")
                       .attr("class", "barchart")
                       .attr("width", "100%")
                       .attr("height", height + margin.top + margin.bottom)
                       .attr("y", height - height - 100)
                       .append("g");

    const z = d3.scaleOrdinal().range(["steelblue", "indianred"]);

    const brushYears = barchart.append("g")
    brushYears.append("text")
                               .attr("id", "brushYears")
                               .classed("yearText", true)
                               .text(brushYearStart + " - " + brushYearEnd)
                               .attr("x", 35)
                               .attr("y", 12);
    const yearParse = d3.timeParse("%Y");

    d3.csv("data/yearcount.csv", function (error, post) {

      // Coercion since CSV is untyped
      post.forEach(function (d) {
        d["frequency"] = +d["frequency"];
        d["frequency_discontinued"] = +d["frequency_discontinued"];
        d["year"] = yearParse(d["year"]).getFullYear();
        //console.log(d["year"]);
      });

      let stack = d3.stack().keys(["frequency", "frequency_discontinued"]);
      let fData = (["frequency", "frequency_discontinued"].map(function (type) {
        return post.map(function (d) {
          return {
            x: d["year"],
            y: +d[type]
          };
        });
      }));
      let freqs = stack(fData);

      console.log(freqs);
      x.domain(freqs[0].map(function (d) {
        return d.x;
      }));
      y.domain([0, d3.max(freqs[freqs.length - 1], function (d) {
        return d.y0 + d.y;
      })]);

      // Axis variables for the bar chart
      let x_axis = d3.axisBottom(x).tickValues([1850, 1855, 1860, 1865, 1870, 1875, 1880, 1885, 1890, 1895, 1900]);
      let y_axis = d3.axisRight(y).scale();

      // x axis
      barchart.append("g")
              .attr("class", "x axis")
              .style("fill", "#000")
              .attr("transform", "translate(0," + height + ")")
              .call(x_axis);

      // y axis
      barchart.append("g")
              .attr("class", "y axis")
              .style("fill", "#000")
              .attr("transform", "translate(" + (width - 85) + ",0)")
              .call(y_axis);

      // Add a group for each cause.
      let freq = barchart.selectAll("g.freq")
                         .data(freqs)
                         .enter().append("g")
                         .attr("class", "freq")
                         .style("fill", function (d, i) {
                           return z(i);
                         })
                         .style("stroke", "#CCE5E5");

      // Add a rect for each date.
      let rect = freq.selectAll("rect")
                     .data(Object)
                     .enter().append("rect")
                     .attr("class", "bar")
                     .attr("x", function (d) {
                       return x(d.x);
                     })
                     .attr("y", function (d) {
                       return y(d.y0) + y(d.y) - height;
                     })
                     .attr("height", function (d) {
                       return height - y(d.y);
                     })
                     .attr("width", x.rangeBand())
                     .attr("id", function (d) {
                       return d["year"];
                     });

      // Draw the brush
      let brush = d3.svg.brush()
                    .x(x)
                    .on("brush", brushmove)
                    .on("brushend", brushend);

      let arc = d3.svg.arc()
                  .outerRadius(height / 15)
                  .startAngle(0)
                  .endAngle(function(d, i) { return i ? -Math.PI : Math.PI; });

      let brushg = barchart.append("g")
                           .attr("class", "brush")
                           .call(brush);

      brushg.selectAll(".resize").append("path")
            .attr("transform", "translate(0," +  height / 2 + ")")
            .attr("d", arc);

      brushg.selectAll("rect")
            .attr("height", height);

    });


  }



 brushmove() {
    y.domain(x.range()).range(x.domain());
    b = brush.extent();

    const localBrushYearStart = (brush.empty()) ? brushYearStart : Math.ceil(y(b[0])),
          localBrushYearEnd = (brush.empty()) ? brushYearEnd : Math.ceil(y(b[1]));

    // Snap to rect edge
    d3.select("g.brush").call((brush.empty()) ? brush.clear() : brush.extent([y.invert(localBrushYearStart), y.invert(localBrushYearEnd)]));

    // Fade all years in the histogram not within the brush
    d3.selectAll("rect.bar").style("opacity", function(d, i) {
      return d.x >= localBrushYearStart && d.x < localBrushYearEnd || brush.empty() ? "1" : ".4";
    });
  }

  brushend() {

    const localBrushYearStart = (brush.empty()) ? brushYearStart : Math.ceil(y(b[0])),
          localBrushYearEnd = (brush.empty()) ? brushYearEnd : Math.floor(y(b[1]));

    d3.selectAll("rect.bar").style("opacity", function(d, i) {
      return d.x >= localBrushYearStart && d.x <= localBrushYearEnd || brush.empty() ? "1" : ".4";
    });

    // Additional calculations happen here...
    // filterPoints();
    // colorPoints();
    // styleOpacity();

    // Update start and end years in upper right-hand corner of the map
    d3.select("#brushYears").text(localBrushYearStart == localBrushYearEnd ? localBrushYearStart : localBrushYearStart + " - " + localBrushYearEnd);

  }

  resetBrush() {
    brush
      .clear()
      .event(d3.select(".brush"));
  }

}
