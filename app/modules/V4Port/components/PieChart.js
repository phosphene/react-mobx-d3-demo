import * as d3 from 'd3';

export default class PieChart {


  constructor(el, props = {}) {
    console.log(props)
  }


  render() {

    var width = 960,
          height = 500,
          radius = Math.min(width, height) / 2;


    const color = d3.scaleOrdinal()
                  .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    const pie = d3.pie()
                  .value(function(d) { return d.apples; })
                  //.value( d => { return d.apples })
                  .sort(null);

    const arc = d3.arc()
                  .innerRadius(radius - 100)
                  .outerRadius(radius - 20);

    const svg = d3.select("body").append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .append("g")
                  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    d3.tsv("data/aando.tsv", type, function(error, data) {
      if (error) throw error;

      var path = svg.datum(data).selectAll("path")
                    .data(pie)
                    .enter().append("path")
                    .attr("fill", function(d, i) { console.log(i); console.log(color(i)); return color(i);  })
                    .attr("d", arc)
                    .each(function(d) { console.log(d); this._current = d; }); // store the initial angles

      d3.selectAll("input")
        .on("change", change);

      var timeout = setTimeout(function() {
        d3.select("input[value=\"oranges\"]").property("checked", true).each(change);
      }, 2000);
      /*
       *       function change() {
       *         var value = this.value;
       *         clearTimeout(timeout);
       *         pie.value(function(d) { return d[value]; }); // change the value function
       *         path = path.data(pie); // compute the new angles
       *         path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
       *       }*/
      let change = ()  => {
        let value = this.value;
        clearTimeout(timeout);
        pie.value(function(d) { return d[value]; }); // change the value function
        path = path.data(pie); // compute the new angles
        path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
      }
    });

    let type = d => {
      d.apples = +d.apples;
      d.oranges = +d.oranges;
      return d;
    }

    // Store the displayed angles in _current.
    // Then, interpolate from _current to the new angles.
    // During the transition, _current is updated in-place by d3.interpolate.
    let arcTween = a => {
      let i = d3.interpolate(this._current, a);
      this._current = i(0);
      return t => arc(i(t));
    }

    /*
     *
     *     function type(d) {
     *       d.apples = +d.apples || 0;
     *       d.oranges = +d.oranges || 0;
     *       return d;
     *     }
     *
     *     // Store the displayed angles in _current.
     *     // Then, interpolate from _current to the new angles.
     *     // During the transition, _current is updated in-place by d3.interpolate.
     *     function arcTween(a) {
     *       var i = d3.interpolate(this._current, a);
     *       this._current = i(0);
     *       return function(t) {
     *         return arc(i(t));
     *       };
     *     }
     *
     * */


  }

}
