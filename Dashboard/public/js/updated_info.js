////////////////////////////////////////////////////////
////SHOW TOTAL DELAY MINUTES FROM THE HEATMAP(BD+YUS)///
////////////////////////////////////////////////////////

// Load json data
d3.json("/../../data/heatmap.json", function (data) {
    var total_heatmap_delay_minute = d3.sum(data, function (d) {
        return d.min;
    })
    document.getElementById("total-min").innerHTML = "Total Daily Delay <br>" + formatNumber(total_heatmap_delay_minute)
        + " min";
});
//total daily incident
d3.json("/../../data/incident.json", function (data) {
    var total_daily_incident_number = d3.sum(data, function (d) {
        return d.nummonthly;
    })
    document.getElementById("total-daily-incident").innerHTML = "Total Incident <br>" + formatNumber(total_daily_incident_number)

});

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}