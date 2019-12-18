import vegaEmbed from 'vega-embed'
import * as d3 from "d3"
import {scaleLinear} from "d3-scale";
let csvSource = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT3z3v1MQZnr6dIUNYaBWEkRZWVtx-TP9I6BOxe9nAmzLGjBV0rqcuTEpz2dpLqq7UQiBfvGp_uxF6V/pubhtml"



let initCorrelogram = () => {
    d3.csv(csvSource, function(error, rows) {
        var data = [];
  
        rows.forEach(function(d) {
          console.log(d)
          var x = d[""];
          delete d[""];
          for (prop in d) {
            var y = prop,
              value = d[prop];
            data.push({
              x: x,
              y: y,
              value: +value
            });
          }
        });
  
        var margin = {
            top: 25,
            right: 80,
            bottom: 25,
            left: 25
          },
          width = 300 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom,
          domain = d3.set(data.map(function(d) {
            return d.x
          })).values(),
          num = Math.sqrt(data.length),
          color = d3.scale.linear()
            .domain([-1, 0, 1])
            .range(["#B22222", "#fff", "#000080"]);
  
        var x = d3.scale
          .ordinal()
          .rangePoints([0, width])
          .domain(domain),
        y = d3.scale
          .ordinal()
          .rangePoints([0, height])
          .domain(domain),
        xSpace = x.range()[1] - x.range()[0],
        ySpace = y.range()[1] - y.range()[0];
  
        var svg = d3.select("body")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
        var cor = svg.selectAll(".cor")
          .data(data)
          .enter()
          .append("g")
          .attr("class", "cor")
          .attr("transform", function(d) {
            return "translate(" + x(d.x) + "," + y(d.y) + ")";
          });
          
        cor.append("rect")
          .attr("width", xSpace)
          .attr("height", ySpace)
          .attr("x", -xSpace / 2)
          .attr("y", -ySpace / 2)
  
        cor.filter(function(d){
            var ypos = domain.indexOf(d.y);
            var xpos = domain.indexOf(d.x);
            for (var i = (ypos + 1); i < num; i++){
              if (i === xpos) return false;
            }
            return true;
          })
          .append("text")
          .attr("y", 5)
          .text(function(d) {
            if (d.x === d.y) {
              return d.x;
            } else {
              return d.value.toFixed(2);
            }
          })
          .style("fill", function(d){
            if (d.value === 1) {
              return "#000";
            } else {
              return color(d.value);
            }
          });
  
          cor.filter(function(d){
            var ypos = domain.indexOf(d.y);
            var xpos = domain.indexOf(d.x);
            for (var i = (ypos + 1); i < num; i++){
              if (i === xpos) return true;
            }
            return false;
          })
          .append("circle")
          .attr("r", (width / (num * 2) - 5))
          .style("fill", function(d){
            if (d.value === 1) {
              return "#000";
            } else {
              return color(d.value);
            }
          });
          
      var aS = d3.scale
        .linear()
        .range([-margin.top + 5, height + margin.bottom - 5])
        .domain([1, -1]);
  
      var yA = d3.svg.axis()
        .orient("right")
        .scale(aS)
        .tickPadding(7);
  
      var aG = svg.append("g")
        .attr("class", "y axis")
        .call(yA)
        .attr("transform", "translate(" + (width + margin.right / 2) + " ,0)")
  
      var iR = d3.range(-1, 1.01, 0.01);
      var h = height / iR.length + 3;
      iR.forEach(function(d){
          aG.append('rect')
            .style('fill',color(d))
            .style('stroke-width', 0)
            .style('stoke', 'none')
            .attr('height', h)
            .attr('width', 10)
            .attr('x', 0)
            .attr('y', aS(d))
        });
      });
/*
var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 430 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom

// Create the svg area
var svg = d3.select("#correlogram")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

console.log("Created SVG")

d3.csv(csvSource, function(error, rows) {
  // Going from wide to long format
  var data = [];
  rows.forEach(function(d) {
    var x = d[""];
    delete d[""];
    for (prop in d) {
      var y = prop,
        value = d[prop];
      data.push({
        x: x,
        y: y,
        value: +value
      });
    }
  });

 console.log("Read CSV")

  // List of all variables and number of them
  var domain = d3.set(data.map(function(d) { return d.x })).values()
  var num = Math.sqrt(data.length)


console.log("Listed variables")

  // Create a color scale
  var color = d3.scaleLinear()
    .domain([-1, 0, 1])
    .range(["#B22222", "#fff", "#000080"]);

console.log("Created color scale")

  // Create a size scale for bubbles on top right. Watch out: must be a rootscale!
  var size = d3.scaleSqrt()
    .domain([0, 1])
    .range([0, 9]);



console.log("Created size scale on bubbles")

  // X scale
  var x = d3.scalePoint()
    .range([0, width])
    .domain(domain)

console.log("Scaled X")

  // Y scale
  var y = d3.scalePoint()
    .range([0, height])
    .domain(domain)

console.log("Scaled Y")

  // Create one 'g' element for each cell of the correlogram
  var cor = svg.selectAll(".cor")
    .data(data)
    .enter()
    .append("g")
      .attr("class", "cor")
      .attr("transform", function(d) {
        return "translate(" + x(d.x) + "," + y(d.y) + ")";
      });

console.log("Created G element for each cell")

  // Low left part + Diagonal: Add the text with specific color
  cor
    .filter(function(d){
      var ypos = domain.indexOf(d.y);
      var xpos = domain.indexOf(d.x);
      return xpos <= ypos;
    })
    .append("text")
      .attr("y", 5)
      .text(function(d) {
        if (d.x === d.y) {
          return d.x;
        } else {
          return d.value.toFixed(2);
        }
      })
      .style("font-size", 11)
      .style("text-align", "center")
      .style("fill", function(d){
        if (d.x === d.y) {
          return "#000";
        } else {
          return color(d.value);
        }
      });


console.log("Low left part")


  // Up right part: add circles
  cor
    .filter(function(d){
      var ypos = domain.indexOf(d.y);
      var xpos = domain.indexOf(d.x);
      return xpos > ypos;
    })
    .append("circle")
      .attr("r", function(d){ return size(Math.abs(d.value)) })
      .style("fill", function(d){
        if (d.x === d.y) {
          return "#000";
        } else {
          return color(d.value);
        }
      })
      .style("opacity", 0.8)

})
   
console.log("Add circles")
*/
}

export {
    initCorrelogram
}