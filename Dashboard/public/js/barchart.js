///////////////////////////////////////////////
////////////////////BAR CHART///////////////////
///////////////////////////////////////////////

var bothLinesData = [
    {
        "subway_line_type": "BD",
        "year": "2014",
        "total_delay_minutes": "5.1"
    },
    {
        "subway_line_type": "YUS",
        "year": "2014",
        "total_delay_minutes": "8.7"
    },
    {
        "subway_line_type": "BD",
        "year": "2015",
        "total_delay_minutes": "20.8"
    },
    {
        "subway_line_type": "YUS",
        "year": "2015",
        "total_delay_minutes": "13.5"
    },
    {
        "subway_line_type": "BD",
        "year": "2016",
        "total_delay_minutes": "6.6"
    },
    {
        "subway_line_type": "YUS",
        "year": "2016",
        "total_delay_minutes": "35.8"
    },
    {
        "subway_line_type": "BD",
        "year": "2017",
        "total_delay_minutes": "3.9"
    },
    {
        "subway_line_type": "YUS",
        "year": "2017",
        "total_delay_minutes": "24.7"
    },
    {
        "subway_line_type": "BD",
        "year": "2018",
        "total_delay_minutes": "50"
    },
    {
        "subway_line_type": "YUS",
        "year": "2018",
        "total_delay_minutes": "5.0"
    },
    {
        "subway_line_type": "BD",
        "year": "2019",
        "total_delay_minutes": "20.3"
    },
    {
        "subway_line_type": "YUS",
        "year": "2019",
        "total_delay_minutes": "30.4"
    },
    {
        "subway_line_type": "BD",
        "year": "2020",
        "total_delay_minutes": "7.1"
    },
    {
        "subway_line_type": "YUS",
        "year": "2020",
        "total_delay_minutes": "34.7"
    }
];

var yusData = [];
var bdData = [];

// Add data to each subway lines 
for (var i = 0; i < bothLinesData.length; i++) {
    if (bothLinesData[i]["subway_line_type"] === "YUS") {
        yusData.push(bothLinesData[i]);
    } else {
        bdData.push(bothLinesData[i]);
    }
}

// Functions for radio buttons between data
function change(value) {
    console.log("valu" + value)
    if (value === 'BD') {
        update(bdData);
    } else if (value === 'YUS') {
        update(yusData);
    } else {
        update(bothLinesData);
    }
}

// Update barchart color for BD, YUS
function update(data) {
    // Set domain for the x-axis
    xChart.domain(data.map(function (d) { return d.year; }));
    // Set domain for y-axis
    yChart.domain([0, d3.max(data, function (d) { return +d.total_delay_minutes; })]);

    // Get the width of each bar 
    var barWidth = widthBar / data.length;

    // Select all bars on the graph, take them out, and exit the previous data set
    // and then add/enter the new data set
    var bars = chart.selectAll(".bar")
        .remove()
        .exit()
        .data(data)

    // Store each bar(rect) with the corresponding data
    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .style("display", d => { return d.total_delay_minutes === null ? "none" : null })
        .attr("x", function (d, i) { return i * barWidth + 1 })
        .attr("y", function (d) { return yChart(d.total_delay_minutes); })
        .attr("height", function (d) { return heightBar - yChart(d.total_delay_minutes); })
        .transition()
        .duration(70)
        .delay(function (d, i) {
            return i * 150
        })
        .attr("width", barWidth - 1)
        .attr("fill", function (d) {
            if (d.subway_line_type === "BD") {
                return "#83b4b0"
            } else {
                return "#003e62"
            }
        });

    //  Drawing the y-Axis
    chart.select('.y')
        .call(yAxis)
    // Drawing the x-axis
    chart.select('.xAxis')
        .attr("transform", "translate(0," + heightBar + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function (d) {
            return "rotate(-65)";
        });

}//end update function

// Set the dimension of Bar Chart
var marginBar = { top: 40, right: 20, bottom: 50, left: 50 };
var widthBar = 340 - marginBar.left - marginBar.right;
var heightBar = 220 - marginBar.top - marginBar.bottom;

// Select '#barChart' to show Bar Chart
var chart = d3.select("div#barChart")
    .append("div")
    .classed("svg-containerBar", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 340 220")
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform", "translate(" + marginBar.left + "," + marginBar.top + ")");

// Set the range of each label for x-axis, y-axis
var xChart = d3.scaleBand()
    .range([0, widthBar]);
var yChart = d3.scaleLinear().nice()
    .range([heightBar, 0]);

// Create  axes for y, x axis
var xAxis = d3.axisBottom(xChart);
var yAxis = d3.axisLeft(yChart);

// Set up axes for left(y) and bottom axis(x)
chart.append("g")
    .attr("class", "y axis")
    .call(yAxis)

chart.append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + heightBar + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function (d) {
        return "rotate(-65)";
    });

// Add labels for axes
chart
    .append("text")
    .attr("transform", "translate(-35," + (heightBar + marginBar.bottom) / 1.3 + ") rotate(-90)")
    .text("% of total subway delay minutes")
    .style("font-size", "0.7rem")
    .style("font-weight", "bold")
    .style("fill", "#343a40");

chart
    .append("text")
    .attr("transform", "translate(" + (widthBar / 2) + "," + (heightBar + marginBar.bottom - 5) + ")")
    .text("Year")
    .style("font-size", "0.7rem")
    .style("font-weight", "bold")
    .style("fill", "#343a40");


update(bothLinesData);


// select the svg area
var svgBarLabel = d3.select("#my-legend-bar")

// Handmade legend
svgBarLabel.append("circle").attr("cx", 7).attr("cy", 8).attr("r", 6).style("fill", "#1162AB")
svgBarLabel.append("circle").attr("cx", 90).attr("cy", 8).attr("r", 6).style("fill", "#83b4b0")
svgBarLabel.append("text").attr("x", 15).attr("y", 8).text("Line 1").style("font-size", "15px").attr("alignment-baseline", "middle")
svgBarLabel.append("text").attr("x", 98).attr("y", 8).text("Line 2").style("font-size", "15px").attr("alignment-baseline", "middle")