import * as d3 from 'd3';


export default class StGrD3 {

  constructor(el, props = {}) {
    this.layersObj = StGrD3.buildLayers();
    this.coordsObj = StGrD3.buildCoords(this.layersObj);
  }

  render() {
    let {layers0, layers1, m} = this.layersObj;
    let {width, height, x, y, area} = this.coordsObj;

    let color = d3.scale.linear()
                  .range(["#aad", "#556"]);

    let svg = d3.select("#streamgraph").append("svg")
                .attr("width", width)
                .attr("height", height);

    svg.selectAll("path")
       .data(layers0)
       .enter().append("path")
       .attr("d", area)
       .style("fill", function() { return color(Math.random()); });
  }

  static buildLayers() {
    let n = 20, // number of layers
        m = 200, // number of samples per layer
        stack = d3.layout.stack().offset("wiggle"),
        layers0 = stack(d3.range(n).map(function() { return StGrD3.bumpLayer(m); })),
        layers1 = stack(d3.range(n).map(function() { return StGrD3.bumpLayer(m); }));

    return {layers0, layers1, m};

  }


  transition () {
    let {layers0, layers1, m} = this.layersObj;
    let {width, height, x, y, area} = this.coordsObj;
    d3.selectAll("path")
      .data(function() {
        var d = layers1;
        layers1 = layers0;
        return layers0 = d;
      })
      .transition()
      .duration(2500)
      .attr("d", area);
  }


  static buildCoords(layers){
    let width = 960,
        height = 500;

    let {layers0, layers1, m} = layers;

    let x = d3.scale.linear()
              .domain([0, m - 1])
              .range([0, width]);

    let y = d3.scale.linear()
              .domain([0, d3.max(layers0.concat(layers1), function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); })])
              .range([height, 0]);

    let area = d3.svg.area()
                 .x(function(d) { return x(d.x); })
                 .y0(function(d) { return y(d.y0); })
                 .y1(function(d) { return y(d.y0 + d.y); });

    return {width, height, x, y, area};

  }

  //test data generator.
  static bumpLayer(n) {

    let bump = (a) => {
      let x = 1 / (.1 + Math.random()),
          y = 2 * Math.random() - .5,
          z = 10 / (.1 + Math.random());
      for (let i = 0; i < n; i++) {
        let w = (i / n - y) * z;
        a[i] += x * Math.exp(-w * w);
      }
    }

    let a = [], i;
    for (i = 0; i < n; ++i) a[i] = 0;
    for (i = 0; i < 5; ++i) bump(a);
    return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
  }
  //endofile
}
