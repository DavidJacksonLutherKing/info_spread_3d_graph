//Define Namespace as tc for transmission chain application object.
var tc = new Object();


//Fetch Chain Data from JSON File and callback function to influence the data to d3 chart
d3.json('data/curve-tree.json').then(function (data, err) {
    console.log(data);
    console.log(err);
    var chartSVG = tc.renderChart(data);
    document.getElementById("transmission-chain-chart").append(chartSVG.svgElement.node());
});

var svg = window.svg || {
    height: window.innerHeight,
    width: window.innerWidth,
    maxNodeSize: 500,
    x_browser: 20,
    y_browser: 25,
    root: undefined,
    links: undefined,
    nodes: undefined,
    nodeRadius: 20,
    lineDistance: 80,
    lineStroke: 3,
    pathRadius: 104,
    circleBorderWidth: 5,
    manybodyStrength: -1000,
    simulation: undefined,
    svgElement: undefined,
    imgElements: undefined,
    drag: function (simulation) {
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
}
//Define renderChart Function
tc.renderChart = function (data) { 
    //Define SVG Size
    svg.root = d3.hierarchy(data);
    svg.links = svg.root.links();
    svg.nodes = svg.root.descendants();
    console.log(svg);
    svg.simulation = d3.forceSimulation(svg.nodes)
        .force("link", d3.forceLink(svg.links).id(d => d.data.customerID).distance(svg.lineDistance).strength(1))
        .force("charge", d3.forceManyBody().strength(svg.manybodyStrength))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

    svg.svgElement = d3.create("svg")
        .attr("viewBox", [-svg.width / 2, -svg.height / 2, svg.width, svg.height]);

    svg.lineElements = svg.svgElement.append("g")
        .attr("class", "line")
        .selectAll("path")
        .data(svg.links)
        .join("path")
        .attr("stroke", "#999")
        .attr("stroke-width", svg.lineStroke)
        .attr("stroke-opacity", 0.6)
    // .attr("d","M0,-5L10,0L0,5")

    svg.nodeElements = svg.svgElement.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(svg.nodes)
        .join("circle")
        .attr("r", svg.nodeRadius)
        .attr("fill", d=>"url(#"+d.data.customerID+"-img)")
        .attr("stroke", "yellow")
        .attr("stroke-width", svg.circleBorderWidth)
        .call(svg.drag(svg.simulation));
    svg.imgElements =svg.svgElement.append("defs")
        .selectAll("pattern")
        .data(svg.nodes)
        .join("pattern")
        .attr("id",d=>d.data.customerID+"-img")
        .attr("width","100%")
        .attr("height","100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("width",1)
        .attr("height",1)
        .attr("xlink:href",d=>d.data.img)

    svg.svgElement.append("g")
        .selectAll("text")
        .data(svg.nodes)
        .join("text")
        .text(d => d.data.nickName)
        .attr("id", d => d.data.customerID + "-nickName")

    svg.simulation.on("tick", () => {
        // svg.lineElements
        //     .attr("x1", d => d.source.x)
        //     .attr("y1", d => d.source.y)
        //     .attr("x2", d => d.target.x)
        //     .attr("y2", d => d.target.y);
        svg.lineElements
            .attr("d", d=>"M" + d.source.x + "," + d.source.y + " A" + svg.pathRadius + "," + svg.pathRadius + ",0,0,1," + d.target.x + "," + d.target.y)
            .attr("fill","none");
        svg.nodeElements
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });


    console.log(svg.svgElement);
    return svg;
}