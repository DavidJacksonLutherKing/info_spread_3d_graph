//Define Namespace as tc for transmission chain application object.
var tc = new Object();


//Fetch Chain Data from JSON File and callback function to influence the data to d3 chart
d3.json('data/curve-tree.json').then(function (data, err) {
    console.log(data);
    console.log(err);
    var legends = svg.legends.create();
    console.log(legends);
    var resetButton = document.createElement("button");
    resetButton.setAttribute("id", "chart-reset-btn");
    resetButton.innerText = "重置";
    var chartSVG = tc.renderChart(data);
    document.getElementById("transmission-chain-chart").append(resetButton);
    document.getElementById("transmission-chain-chart").append(legends);
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
    rootRadius: 30,
    lineDistance: 80,
    lineStroke: 3,
    pathRadius: 104,
    circleBorderWidth: 5,
    fontSize: 12,
    manybodyStrength: -1000,
    legends: {
        elments: new Object(),
        create: new Function()
    },
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
        .attr("viewBox", [-svg.width / 2, -svg.height / 2, svg.width, svg.height])
        .call(d3.zoom()
            .scaleExtent([0.1, 5])
            // .extent([
            //     [0, 0],
            //     [width, height]
            // ])
            .on("zoom", function () {
                svg.nodeElements.attr("transform", d3.event.transform);
                svg.lineElements.attr("transform", d3.event.transform);
                svg.nameElements.attr("transform", d3.event.transform);
            }));


    svg.lineElements = svg.svgElement.append("g")
        .attr("class", "line")
        .selectAll("path")
        .data(svg.links)
        .join("path")
        .attr("stroke", "#999")
        .attr("stroke-width", svg.lineStroke)
        .attr("stroke-opacity", 0.6)

    svg.nodeElements = svg.svgElement.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(svg.nodes)
        .join("circle")
        .attr("r", svg.nodeRadius)
        .attr("fill", d => "url(#" + d.data.customerID + "-img)")
        .attr("id", d => d.data.customerID + "-circle)")
        .attr("stroke", "yellow")
        .attr("stroke-width", svg.circleBorderWidth)
        .call(svg.drag(svg.simulation));

    svg.imgElements = svg.svgElement.append("defs")
        .selectAll("pattern")
        .data(svg.nodes)
        .join("pattern")
        .attr("id", d => d.data.customerID + "-img")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("width", 1)
        .attr("height", 1)
        .attr("xlink:href", d => d.data.img)

    svg.nameElements = svg.svgElement.append("g")
        .attr("class", "text")
        .selectAll("text")
        .data(svg.nodes)
        .join("text")
        .attr("font-size", svg.fontSize)
        .attr("stroke", "black")
        .attr("width", d => d.data.nickName.length * svg.fontSize)
        .attr("height", 20)
        .text(d => d.data.nickName+","+d.data.gender)
        .attr("id", d => d.data.customerID + "-nickName")
    svg.simulation.on("tick", () => {
        svg.lineElements
            .attr("d", d => "M" + d.source.x + "," + d.source.y + " A" + svg.pathRadius + "," + svg.pathRadius + ",0,0,1," + d.target.x + "," + d.target.y)
            .attr("fill", "none");

        svg.nameElements
            .attr("x", d => d.x - d.data.nickName.length * svg.fontSize / 2)
            .attr("y", d => d.y + svg.nodeRadius + svg.fontSize * 1.5);

        svg.nodeElements
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });


    console.log(svg.svgElement);
    return svg;
}


svg.legends.create = function () {
    svg.legends.elments = document.createElement("div");
    svg.legends.elments.setAttribute("id", "legends");
    svg.legends.elments.setAttribute("width", "100%");
    svg.legends.elments.setAttribute("height", "100%");
    var json = [{
        color: "#0090DA",
        text: "根节点",
        id: "root-level"
    }, {
        color: "#A4CE4E",
        text: "一级节点",
        id: "first-level"
    }, {
        color: "#DB0A5B",
        text: "二级节点",
        id: "second-level"
    }, {
        color: "#00ACA0",
        text: "三级节点",
        id: "third-level"
    }, {
        color: "#5F259F",
        text: "四级节点",
        id: "fourth-level"
    }, {
        color: "#FFC600",
        text: "五级节点",
        id: "fifth-level"
    }];
    for (key in json) {
        var legendSample = createLegendSample(json[key]);
        svg.legends.elments.appendChild(legendSample);
    }
    return svg.legends.elments;
}

function createLegendSample(json) {
    var legendSample = document.createElement("div");
    legendSample.setAttribute("id", json.id);
    legendSample.setAttribute("class", "level");
    var legendSampleColor = document.createElement("div");
    legendSampleColor.style.backgroundColor = json.color;
    legendSampleColor.setAttribute("class", json.id + " level-circle")
    var legendSampleText = document.createElement("div");
    legendSampleText.innerText = json.text;
    legendSampleText.style.fontFamily = "simsun";
    legendSampleText.style.fontSize = svg.fontSize + 2 + "px";
    legendSampleText.style.lineHeight = svg.fontSize + 2 + "px";
    legendSampleText.style.paddingTop = "4px";
    legendSampleText.setAttribute("class", json.id + " level-text");
    legendSample.appendChild(legendSampleColor);
    legendSample.appendChild(legendSampleText);
    return legendSample;
}