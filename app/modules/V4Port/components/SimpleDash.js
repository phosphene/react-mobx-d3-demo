import * as d3 from 'd3';

export default class SimpleDash {


  constructor(el, props = {}) {
    console.log(props)
    this.data = this.getMe();
  }

getMe()  {
  let freqData=[
    {State:'AL',freq:{low:4786, mid:1319, high:249}}
    ,{State:'AZ',freq:{low:1101, mid:412, high:674}}
    ,{State:'CT',freq:{low:932, mid:2149, high:418}}
    ,{State:'DE',freq:{low:832, mid:1152, high:1862}}
    ,{State:'FL',freq:{low:4481, mid:3304, high:948}}
    ,{State:'GA',freq:{low:1619, mid:167, high:1063}}
    ,{State:'IA',freq:{low:1819, mid:247, high:1203}}
    ,{State:'IL',freq:{low:4498, mid:3852, high:942}}
    ,{State:'IN',freq:{low:797, mid:1849, high:1534}}
    ,{State:'KS',freq:{low:162, mid:379, high:471}}
  ];
return freqData;
}
  render() {

    function dashboard(id, fData){
      var barColor = 'steelblue';
      const segColor = c => { return {low:"#807dba", mid:"#e08214",high:"#41ab5d"}[c]; }

      // compute total for each state.
      fData.forEach( d => { d.total=d.freq.low+d.freq.mid+d.freq.high; console.log(d);});

      const histoGram = (fD) => {

      // set the dimensions and margins of the graph
      const margin = {top: 20, right: 20, bottom: 30, left: 40},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      // set the ranges
      let x = d3.scaleBand()
                .range([0, width])
                .padding(0.1);
      let y = d3.scaleLinear()
                .range([height, 0]);

      // append the svg object to the body of the page
      // append a 'group' element to 'svg'
      // moves the 'group' element to the top left margin
      let svg = d3.select("body").append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");



        //fD.foreach(([a, b]) => console.log(a+' '+b));
        let data = fD;
        data.forEach(a => console.log(a));
        x.domain(data.map(function(d) { return d.salesperson; }));
        y.domain([0, d3.max(data, function(d) { return d.sales; })]);

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
           .data(data)
           .enter().append("rect")
           .attr("class", "bar")
           .attr("x", function(d) { return x(d[0]); })
           .attr("width", x.bandwidth())
           .attr("y", function(d) { return y(d[1]); })
           .attr("height", function(d) { return height - y(d[1]); });

        // add the x Axis
        svg.append("g")
           .attr("transform", "translate(0," + height + ")")
           .call(d3.axisBottom(x));

        // add the y Axis
        svg.append("g")
           .call(d3.axisLeft(y));


        function mouseover(d){  // utility function to be called on mouseover.
          // filter for selected state.
       //   var st = fData.filter(function(s){ return s.State == d[0];})[0],
        //      nD = d3.keys(st.freq).map(function(s){ return {type:s, freq:st.freq[s]};});

          // call update functions of pie-chart and legend.
        //  pC.update(nD);
        //  leg.update(nD);
        }

        function mouseout(d){    // utility function to be called on mouseout.
          // reset the pie-chart and legend.
          pC.update(tF);
          leg.update(tF);
        }

        // create function to update the bars. This will be used by pie-chart.
        hG.update = function(nD, color){
          // update the domain of the y-axis map to reflect change in frequencies.
          y.domain([0, d3.max(nD, function(d) { return d[1]; })]);

          // Attach the new data to the bars.
          var bars = hGsvg.selectAll(".bar").data(nD);

          // transition the height and color of rectangles.
          bars.select("rect").transition().duration(500)
              .attr("y", function(d) {return y(d[1]); })
              .attr("height", function(d) { return hGDim.h - y(d[1]); })
              .attr("fill", color);

          // transition the frequency labels location and change value.
          bars.select("text").transition().duration(500)
              .text(function(d){ return d3.format(",")(d[1])})
              .attr("y", function(d) {return y(d[1])-5; });
        }
        return hG;
      }

      // function to handle pieChart.
      function pieChart(pD){
        var pC ={},    pieDim ={w:250, h: 250};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

        // create svg for pie chart.
        var piesvg = d3.select(id).append("svg")
                       .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
                       .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");

        // create function to draw the arcs of the pie slices.
        var arc = d3.arc().outerRadius(pieDim.r - 10).innerRadius(0);

        // create a function to compute the pie slice angles.
        var pie = d3.pie().sort(null).value(function(d) { return d.freq; });

        // Draw the pie slices.
        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
              .each(function(d) { this._current = d; })
              .style("fill", function(d) { return segColor(d.data.type); })
              .on("mouseover",mouseover).on("mouseout",mouseout);

        // create function to update pie-chart. This will be used by histogram.
        pC.update = function(nD){
          piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
        }
        // Utility function to be called on mouseover a pie slice.
        function mouseover(d){
          // call the update function of histogram with new data.
        //  hG.update(fData.map(function(v){
          //  return [v.State,v.freq[d.data.type]];}),segColor(d.data.type));
        }
        //Utility function to be called on mouseout a pie slice.
        function mouseout(d){
          // call the update function of histogram with all data.
       //   hG.update(fData.map(function(v){
      //      return [v.State,v.total];}), barColor);
       }
        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        function arcTween(a) {
          var i = d3.interpolate(this._current, a);
          this._current = i(0);
          return function(t) { return arc(i(t));    };
        }
        return pC;
      }

      // function to handle legend.
      function legend(lD){
        var leg = {};

        // create table for legend.
        var legend = d3.select(id).append("table").attr('class','legend');

        // create one row per segment.
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

        // create the first column for each segment.
        tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
          .attr("width", '16').attr("height", '16')
          .attr("fill",function(d){ return segColor(d.type); });

        // create the second column for each segment.
        tr.append("td").text(function(d){ return d.type;});

        // create the third column for each segment.
        tr.append("td").attr("class",'legendFreq')
          .text(function(d){ return d3.format(",")(d.freq);});

        // create the fourth column for each segment.
        tr.append("td").attr("class",'legendPerc')
          .text(function(d){ return getLegend(d,lD);});

        // Utility function to be used to update the legend.
        leg.update = function(nD){
          // update the data attached to the row elements.
          var l = legend.select("tbody").selectAll("tr").data(nD);

          // update the frequencies.
          l.select(".legendFreq").text(function(d){ return d3.format(",")(d.freq);});

          // update the percentage column.
          l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});
        }

        function getLegend(d,aD){ // Utility function to compute percentage.
          return d3.format("%")(d.freq/d3.sum(aD.map(function(v){ return v.freq; })));
        }

        return leg;
      }

      // calculate total frequency by segment for all state.
      var tF = ['low','mid','high'].map(function(d){
        return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))};
      });

      // calculate total frequency by state for all segment.
     const sF = fData.map(function(d){return [d.State,d.total];});
     sF.forEach(a => console.log(a));

      var hG = histoGram(sF), // create the histogram.
          pC = pieChart(tF), // create the pie-chart.
          leg= legend(tF);  // create the legend.
    }

    dashboard('#dashboard',this.data);

  }

}
