// custom javascript
var width = 1000;
var height = 800;
var format = d3.format(",d");
var color = d3.scale.category20();
var sizeOfRadius = d3.scale.pow().domain([0.0,5.2]).range([10,90]);
var bubble = d3.layout.pack()
    .sort(null)
    .size([width, height])
    .padding(1)
    .radius(function(d) { return 27 + (sizeOfRadius(d)); });

var murderGraph = d3.select(".wpd3-83-0").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "bubble");

var tooltip = d3.select("#content")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "rgba(0,0,0,0.75)")
    .style("border-radius", "6px")
    .style("font", "12px sans-serif")
    .html("tooltip");

//get the data
d3.json("http://theunchartedblog.net/wp-content/uploads/2014/11/murder_rate.json", function(error, countries) {
    var node = murderGraph.selectAll(".node")
            .data(bubble.nodes(countries)
            .filter(function(d) { return !d.children; }))
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"});

    node.append("circle")
        .attr("r", function(d) {return d.r; })
        .style("fill", function(d) {return color(d.Country); })

        .on("mouseover", function(d) {
            tooltip.html("Murders per 100,000 people: " + d["value"] + "<br />" + 
                "Murders 5 Years Ago: " + d["5 Years Ago"] + "<br />" + 
                "Murders 10 Years Ago: " + d["10 Years Ago"] + "<br />" + 
                "Murders 20 Years Ago: " + d["20 Years Ago"] + "<br />" +
                "GINI Coefficient: " + d["GINI Coefficient"]);
            tooltip.style("visibility", "visible");
        })
        .on("mousemove", function() {
            return tooltip.style("top", (d3.event.pageY-10)+"px").style("left", (d3.event.pageX+10)+"px");
        })
        .on("mouseout", function() {
            return tooltip.style("visibility", "hidden");
        });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .text(function(d) { return d.Country; });
});


