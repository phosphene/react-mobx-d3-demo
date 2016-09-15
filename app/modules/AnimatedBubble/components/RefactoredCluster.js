import * as d3 from 'd3';

export default class RefactoredCluster {


  constructor(el, props = {}) {
    console.log(props)
  }

  //and we call render here. this is not a react render. we could call it something else

  render() {

    const margin = this.getMargin()
    const {width, height, padding,clusterPadding,maxRadius} = this.getConfig();
    const {n, m, z} = this.getNodeConfig();
    const svg = this.buildSvg();

    let  clusters = new Array(m);


    const nodes = d3.range(200).map(() => {
      let i = Math.floor(Math.random() * m),
          radius = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
          d = {cluster: i, r: radius};
      if (!clusters[i] || (radius > clusters[i].r)) clusters[i] = d;
      return d;
    });

   let circles = svg.append('g')
                       .datum(nodes)
                       .selectAll('.circle')
                       .data(d => d)
                       .enter().append('circle')
                       .attr('r', (d) => d.r)
                       .attr('fill', (d) => z(d.cluster))
                       .attr('stroke', 'black')
                       .attr('stroke-width', 1);

    let simulation = this.forceSimulation(nodes,clusters,circles);

  }

  getMargin(){
    return {top: 100, right: 100, bottom: 100, left: 100};
  }

  getConfig(){
    return {width: 960, height: 500, padding: 1.5,  clusterPadding: 6, maxRadius: 12};
  }

  getNodeConfig(){

    return{ n: 200, m: 10, z: d3.scaleOrdinal(d3.schemeCategory20)};


  }


  // These are implementations of the custom forces.
  clustering(nodes, clusters) {
    let alpha = .5;
    nodes.forEach(function(d) {
      let cluster = clusters[d.cluster];
      if (cluster === d) return;
      let x = d.x - cluster.x,
          y = d.y - cluster.y,
          l = Math.sqrt(x * x + y * y),
          r = d.r + cluster.r;
      if (l !== r) {
        l = (l - r) / l * alpha;
        d.x -= x *= l;
        d.y -= y *= l;
        cluster.x += x;
        cluster.y += y;
      }
    });
  }


  buildSvg(){

    const {width, height, padding,clusterPadding,maxRadius} = this.getConfig();
    const svg = d3.select('#bubble')
                  .append('svg')
                  .attr('height', height)
                  .attr('width', width)
                  .append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    return svg;
  }


  collide(nodes) {
    let alpha = .5;
    const {width, height, padding,clusterPadding,maxRadius} = this.getConfig();
    var quadtree = d3.quadtree()
                     .x((d) => d.x)
                     .y((d) => d.y)
                     .addAll(nodes);

    nodes.forEach(function(d) {
      var r = d.r + maxRadius + Math.max(padding, clusterPadding),
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
      quadtree.visit(function(quad, x1, y1, x2, y2) {

        if (quad.data && (quad.data !== d)) {
          var x = d.x - quad.data.x,
              y = d.y - quad.data.y,
              l = Math.sqrt(x * x + y * y),
              r = d.r + quad.data.r + (d.cluster === quad.data.cluster ? padding : clusterPadding);
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.data.x += x;
            quad.data.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    });
  }



 forceSimulation(nodes,clusters,circles){


  let simulation = d3.forceSimulation(nodes)
                     .velocityDecay(0.2)
                     .force("x", d3.forceX().strength(.0005))
                     .force("y", d3.forceY().strength(.0005))
                     .force("collide", this.collide(nodes))
                     .force("cluster", this.clustering(nodes, clusters))
                     .on("tick", ticked);


   function ticked() {
     circles
       .attr('cx', (d) => d.x)
       .attr('cy', (d) => d.y);
   }



  return simulation;

}



}
