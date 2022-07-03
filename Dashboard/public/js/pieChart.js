///////////////////////////////////////////////
////////////////////PIE CHART//////////////////
///////////////////////////////////////////////
var divPie = d3.select("#pieChart").append("div").attr("class", "toolTipPie");
var dataset = [
    { category: 'Track', total: 824, percent: 19.5 },
    { category: 'Signals', total: 967, percent: 22.9 },
    { category: 'Subway Car', total: 810, percent: 19.1 },
    { category: 'Police', total: 660, percent: 15.6 },
    { category: 'Medical', total: 560, percent: 13.2 },
    { category: 'Other', total: 410, percent: 9.7 },
];

var widthPie = 225,
    heightPie = 225,
    radius = Math.min(widthPie, heightPie) / 2;

var chartPie = d3.select("div#pieChart").append("div")
    .attr("viewBox", "0 0 250 250")

var color = d3.scale.ordinal()
    .range(["#83b4b0", "#808080", "#ccec73", "#309bdd", "#d8f1ff", "#ff8585"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

var pie = d3.layout.pie()
    .sort(null)
    .startAngle(1.1 * Math.PI)
    .endAngle(3.1 * Math.PI)
    .value(function (d) { return d.total; });

var svgPie = d3.select("#pieChart").append("svg")
    .attr("width", widthPie)
    .attr("height", heightPie)
    .append("g")
    .attr("transform", "translate(" + widthPie / 2 + "," + heightPie / 2 + ")");

var gPie = svgPie.selectAll(".arc")
    .data(pie(dataset))
    .enter().append("g")
    .attr("class", "arc");

gPie.append("path")
    .style("fill", function (d) { return color(d.data.category); })
    .transition().delay(function (d, i) {
        return i * 500;
    }).duration(500)
    .attrTween('d', function (d) {
        var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
        return function (t) {
            d.endAngle = i(t);
            return arc(d)
        }
    });
gPie.append("text")
    .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .transition()
    .delay(1000)
    .text(function (d) { return d.data.category; });

d3.selectAll("path").on("mousemove", function (d) {
    divPie.style("left", d3.event.pageX - 18 + "px");
    divPie.style("top", d3.event.pageY - 230 + "px");
    divPie.style("display", "inline-block");
    divPie.html((d.data.category) + "<br>" + (d.data.total) + "<br>" + (d.data.percent) + "%");
});

d3.selectAll("path").on("mouseout", function (d) {
    divPie.style("display", "none");
});

function type(d) {
    d.total = +d.total;
    return d;
}