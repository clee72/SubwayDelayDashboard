///////////////////////////////////////////////
////////SMALL CHARTS FOR DELAY REASON//////////
///////////////////////////////////////////////

d3.tsv('/../../data/category_graph.tsv')
    .row(function (r) {
        return {
            year: Number(r.year),
            category: r.category,
            min: Number(r.min)
        }
    }).get(function (data) {

        console.log(data + "data")
        var nested = d3.nest()
            .key(function (k) { return k.category })
            .entries(data);


        var yExtent = fc.extentLinear()
            .accessors([function (d) { return d.min; }])
            .include([0]);

        var xExtent = fc.extentLinear()
            .accessors([function (d) { return d.year; }]);

        var area = fc.seriesSvgArea()
            .crossValue(function (d) { return d.year; })
            .mainValue(function (d) { return d.min; })

        var line = fc.seriesSvgLine()
            .crossValue(function (d) { return d.year; })
            .mainValue(function (d) { d.min })

        var gridlines = fc.annotationSvgGridline()
            .xTicks(0)
            .yTicks(3)

        var multi = fc.seriesSvgMulti()
            .series([area, line, gridlines])
            .mapping(function (data, index, series) {
                return data.values;
            });

        // Create a chart
        var chartCategory = fc.chartSvgCartesian(
            d3.scaleLinear(),
            d3.scaleLinear())
            .yDomain(yExtent(data))
            .xDomain(xExtent(data))
            .xLabel(function (d) { return d.key; })
            .yTicks(3)
            .xTicks(2)
            .xTickFormat(d3.format('0'))
            .yOrient('left')
            .plotArea(multi);

        //render
        d3.select("#multiple-charts")
            .selectAll("div")
            .data(nested)
            .enter()
            .append("div")
            .call(chartCategory)
    });
