///////////////////////////////////////////////
////////////////////HEAT MAP///////////////////
///////////////////////////////////////////////

// Load json data
d3.json("../../data/heatmap.json", function (data) {

  // Set the dimensions of heatmap
  var widthHeatmap = 500;
  var heightHeatmap = 250;

  // Create SVG into heatmap
  var svg = d3.select('.heatmap')
    .append('svg')
    .attr("viewBox", "0 0 500 500")
    .attr('width', widthHeatmap)
    .attr('height', heightHeatmap)

  // Scale the range of the data
  var xscale = d3.scale.linear()
    .domain([-1, 10])
    .range([0, 500]);

  // Scale the range of the data
  var yscale = d3.scale.linear()
    .domain([-1, 10])
    .range([0, 500]);

  // Get minimum delay minutes from the data
  var minDelay = d3.min(data, function (d) {
    return d.min;
  })

  // Get Maximum delay minute from the data
  var maxDelay = d3.max(data, function (d) {
    return d.min;
  })

  // Set min and max circle size
  var size = d3.scaleSqrt()
    .domain([minDelay, maxDelay])
    .range([4, 13])

  //////////////////////////////ADD TOOLTIP AND BUBBLES////////////////////////////

  // Create a tooltip div(default:hidden)
  var tooltip = d3.select(".heatmap")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")

  // Create 3 functions to show / move(locate) / hide the tooltip

  // 1.Show tooltip
  var showTooltip = function (d) {
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("<b>" + d.station + "</b>" + "<br><br>" + "total mins: " + d.min)
      .style("left", "15px")
      .style("top", "-1px")
  }
  // 2.Tooltip location
  var moveTooltip = function (d) {
    tooltip
      .style("left", "15px")
      .style("top", "-1px")
  }
  // 3.Hide tooltip
  var hideTooltip = function (d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  // Add bubbles and postion markers for each subway station
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "bubbles")
    .style("fill", "rgb(190, 10, 49)")
    .attr("fill-opacity", .7)
    .attr("cx", function (d) { return xscale(d.x); })
    .attr("cy", function (d) { return yscale(d.y); })
    .attr("r", function (d) { return size(d.min); })
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);

  ///////////////////////////////////ADD LEGEND///////////////////////////////////

  //  Create an array for a legend (10, 200, 500 minute bubble size)
  var vaulesToDisplay = [10, 200, 500];

  // Adjust the location of a legend
  var xCircle = 690;
  var xLabel = 725;
  var yCircle = 300;

  // Drawing legend and position the legend
  svg
    .selectAll("legend")
    .data(vaulesToDisplay)
    .enter()
    .append("circle")
    .attr("cx", xCircle)
    .attr("cy", function (d) { return yCircle - size(d); })
    .attr("r", function (d) { return size(d) })
    .style("fill", "red")
    .style("stroke", "black")
    .style("margin", "0")
    .attr("fill-opacity", .2)

  // Add legend segments and position the segments
  svg
    .selectAll("legend")
    .data(vaulesToDisplay)
    .enter()
    .append("line")
    .attr("x1", function (d) { return xCircle + size(d) })
    .attr("x2", xLabel)
    // Adjusting the segment line(---)location height  
    .attr("y1", function (d) { return heightHeatmap - size(d) + 50 })
    .attr("y2", function (d) { return heightHeatmap - size(d) + 50 })
    .attr("stroke", "black")
    .style("stroke-dasharray", ('2,2'))

  // Add legend labels and position the labels of segments
  svg
    .selectAll("legend")
    .data(vaulesToDisplay)
    .enter()
    .append("text")
    .attr("x", xLabel)
    // Adjusting the label location height  
    .attr("y", function (d) { return heightHeatmap - size(d) + 50 })
    .text(function (d) { return d })
    .style("font-size", "0.57rem")
    .style("font-weight", "bold")
    .attr("alignment-baseline", "alphabetic")

  // Add legend title of the legend
  svg
    .append("text")
    .attr("x", xCircle - 21)
    .attr("y", heightHeatmap + 65)
    .text("Delay minutes")
    .attr("text-anchor", "start")
    .style("font-size", ".65rem")
    .style("font-weight", "bold")
});
