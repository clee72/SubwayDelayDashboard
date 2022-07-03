///////////////////////////////////////////////
///////////////////LINE GRAPH//////////////////
///////////////////////////////////////////////

// Width and Height of the whole line graph visualization
var marginLine = { top: 20, right: 30, bottom: 5, left: 40 },
  widthLine = 630 - marginLine.left - marginLine.right,
  heightLine = 240 - marginLine.top - marginLine.bottom;

// Append SVG into "#lineChart"
var svg = d3.select("div#lineChart")
  .append("div")
  .classed("svg-containerLine", true)
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 630 280")
  .classed("svg-content-responsive", true)

// Create g (group) to the SVG
// g will contain line graph elements
var g = svg.append("g")
  .attr("transform", "translate(" + marginLine.left + "," + marginLine.top + ")");

// Define 'div' for tooptips
var div = d3.select("div#lineChart")
  .append("div")
  .attr("class", "lineTooltip")
  .style("opacity", 0)

// Load the csv data
d3.csv("/../../data/linegraph.csv", function (error, data) {
  // Convert the date string to a Date object
  // e.g., {date: Tue Jan 01 2019 00:00:00 GMT-0500 (Eastern Standard Time), BD_total_delay_minute: 100}
  var parseTime = d3.timeParse("%d/%m/%Y");
  var timeFormat = d3.time.format("%b");

  // Construct a new array of data
  data.map(function (d) {
    d.BD_total_delay_minute = parseInt(d.BD_total_delay_minute);
    d.YUS_total_delay_minute = parseInt(d.YUS_total_delay_minute);
    d.date = parseTime(d.date);
    // console.log(d.YUS_total_delay_minute);
  })

  // Get a maximum value of 'BD_total_delay_minute' and 'YUS_total_delay_minute' in data
  var line1Max = d3.max(data, function (d) { return parseInt(d.BD_total_delay_minute) });
  var line2Max = d3.max(data, function (d) { return parseInt(d.YUS_total_delay_minute) });

  // Get maximum value from 'line1Max' and 'line2Max' to set the scale of the line graph. 
  var max = line1Max > line2Max ? line1Max : line2Max;

  // Scale the range of the data
  var yscaleLine = d3.scaleLinear()
    .domain([0, max])
    .range([heightLine, 0]);

  // Scale the range of the data
  var xscaleLine = d3.scaleTime()
    .rangeRound([0, widthLine]);

  xscaleLine.domain(d3.extent(data, function (d) { return d.date; }));

  // Create a shape of the line graph according to the data value
  var line1 = d3.line()
    .x(function (d) { return xscaleLine(d.date); })
    .y(function (d) { return yscaleLine(d.BD_total_delay_minute); });

  var line2 = d3.line()
    .x(function (d) { return xscaleLine(d.date); })
    .y(function (d) { return yscaleLine(d.YUS_total_delay_minute); });

  // Append group and insert x-axis (to show each month in data)
  g.append("g")
    .attr("transform", "translate(0," + (heightLine) + ")")
    .call(d3.axisBottom(xscaleLine))

  // Append group and insert x-axis ( to show the total_delay_minute in data)
  g.append("g")
    .call(d3.axisLeft(yscaleLine))

  // Append a line to 'g(group)' elements
  var svgLine = g.append("line")
    .attr("class", "linedot")
    .style("stroke-dasharray", ("3, 10"))
    .attr("x1", 100)
    .attr("x2", 400)
    .attr("y1", 200)
    .attr("y2", 200)
    .style("display", "None")

  // Add data to draw a line for BD
  g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#83b4b0")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 2.5)
    .attr("d", line1)

  // Add data to draw a line for YUS
  g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#003e62")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 2.5)
    .attr("d", line2);

  // Add data to circle dots in the line graph and trainsition to place(1.BD, 2.YUS)
  // 1.Add dots for BD
  g.selectAll("dot").data(data)
    .enter()
    .append("circle")
    .attr("r", 8)
    .attr("cx", function (d) { return xscaleLine(d.date) })
    .attr("cy", function (d) { return yscaleLine(d.BD_total_delay_minute); })
    .attr("class", "dot")
    .on("mouseover", function (d) {
      d3.select(this).transition().duration(100)
        .style("fill", "black")
        .attr("r", 7);
      div.transition()
        .duration(200)
        .style("opacity", .8);
      div.html(d.BD_total_delay_minute)
        .style("left", xscaleLine(d.date) + 80 + "px")
        .style("top", yscaleLine(d.BD_total_delay_minute) + 95 + "px");
      svgLine.transition().duration(10)
        .style("display", "block")
        .attr("x1", xscaleLine(d.date))
        .attr("y1", yscaleLine(d.BD_total_delay_minute))
        .attr("x2", xscaleLine(d.date))
        .attr("y2", heightLine)
    })
    .on("mouseout", function (d) {
      d3.select(this).transition().duration(100)
        .style("fill", "grey")
        .attr("r", 5);
      div.transition()
        .duration(500)
        .style("opacity", 0);
      svgLine.style("display", "None")
    });

  // 2. Add dots for YUS
  g.selectAll("dot").data(data)
    .enter()
    .append("circle")
    .attr("r", 8)
    .attr("cx", function (d) { return xscaleLine(d.date) })
    .attr("cy", function (d) { return yscaleLine(d.YUS_total_delay_minute); })
    .attr("class", "dot")
    .on("mouseover", function (d) {
      d3.select(this).transition().duration(100)
        .style("fill", "black")
        .attr("r", 7);
      div.transition()
        .duration(200)
        .style("opacity", .8);
      div.html(d.YUS_total_delay_minute)
        .style("left", xscaleLine(d.date) + 71 + "px")
        .style("top", yscaleLine(d.YUS_total_delay_minute) + 80 + "px");
      svgLine.transition().duration(10)
        .style("display", "block")
        .attr("x1", xscaleLine(d.date))
        .attr("y1", yscaleLine(d.YUS_total_delay_minute))
        .attr("x2", xscaleLine(d.date))
        .attr("y2", heightLine)
    })
    .on("mouseout", function (d) {
      d3.select(this).transition().duration(100)
        .style("fill", "grey")
        .attr("r", 5);
      div.transition()
        .duration(500)
        .style("opacity", 0);
      svgLine.style("display", "None")
    });

  // Add labels for y-axis
  g.append("text")
    .attr("transform", "translate(-35,-12)")
    .text("minutes")
    .style("font-size", "0.7rem")
    .style("font-weight", "bold")
    .style("fill", "#343a40");
})


// select the svg area
var svgLineLabel = d3.select("#my-legend-line")

// Handmade legend
svgLineLabel.append("circle").attr("cx", 7).attr("cy", 8).attr("r", 6).style("fill", "#1162AB")
svgLineLabel.append("circle").attr("cx", 90).attr("cy", 8).attr("r", 6).style("fill", "#83b4b0")
svgLineLabel.append("text").attr("x", 15).attr("y", 8).text("Line 1").style("font-size", "15px").attr("alignment-baseline", "middle")
svgLineLabel.append("text").attr("x", 98).attr("y", 8).text("Line 2").style("font-size", "15px").attr("alignment-baseline", "middle")