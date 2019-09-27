//Define Namespace as tc for transmission chain application object.
var tc = new Object();
tc.temp = tc.temp || {
    removedNodes: {},
    removedLinks: {},
    nodes: [],
    links: []
};

tc.svg = tc.svg || {
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
    tc.svg.root = d3.hierarchy(data);
    tc.svg.links = tc.svg.root.links();
    tc.svg.nodes = tc.svg.root.descendants();
    tc.svg.simulation = d3.forceSimulation(tc.svg.nodes)
        .force("link", d3.forceLink(tc.svg.links).id(d => d.data.customerID).distance(tc.svg.lineDistance).strength(1))
        .force("charge", d3.forceManyBody().strength(tc.svg.manybodyStrength))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

    tc.svg.svgElement = d3.create("svg")
        .attr("viewBox", [-tc.svg.width / 2, -tc.svg.height / 2, tc.svg.width, tc.svg.height])
        .call(d3.zoom()
            .scaleExtent([0.1, 5])
            .on("zoom", function () {
                tc.svg.nodeElements.attr("transform", d3.event.transform);
                tc.svg.lineElements.attr("transform", d3.event.transform);
                tc.svg.nameElements.attr("transform", d3.event.transform);
            }));


    tc.svg.lineElements = tc.svg.svgElement.append("g")
        .attr("class", "line")
        .selectAll("path")
        .data(tc.svg.links)
        .join("path")
        .attr("id", d => d.source.data.customerID + "-" + d.target.data.customerID + "-line")
        .attr("name", d => d.target.data.customerID + "-line")
        .attr("class", "link-line")
        .attr("end", d => d.target.data.customerID)
        .attr("is_shown", "true")
        .attr("stroke", "#999")
        .attr("stroke-width", tc.svg.lineStroke)
        .attr("stroke-opacity", 0.6);

    tc.svg.nodeElements = tc.svg.svgElement.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(tc.svg.nodes)
        .join("circle")
        .attr("class", "node-circle")
        .attr("is_shown", "true")
        .attr("children_shown", "true")
        .attr("r", tc.svg.nodeRadius)
        .attr("fill", d => "url(#" + d.data.customerID + "-img)")
        .attr("id", d => d.data.customerID + "-circle")
        .attr("stroke", "yellow")
        .attr("stroke-width", tc.svg.circleBorderWidth)
        .call(tc.svg.drag(tc.svg.simulation));

    tc.svg.imgElements = tc.svg.svgElement.append("defs")
        .selectAll("pattern")
        .data(tc.svg.nodes)
        .join("pattern")
        .attr("id", d => d.data.customerID + "-img")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("width", 1)
        .attr("height", 1)
        .attr("xlink:href", d => d.data.img);

    tc.svg.nameElements = tc.svg.svgElement.append("g")
        .attr("class", "text")
        .selectAll("text")
        .data(tc.svg.nodes)
        .join("text")
        .attr("font-size", tc.svg.fontSize)
        .attr("stroke", "black")
        .attr("width", d => d.data.nickname.length * tc.svg.fontSize)
        .attr("height", 20)
        .text(d => d.data.nickname + "," + d.data.gender)
        .attr("id", d => d.data.customerID + "-nickname")
        .attr("class", "nickname");

    tc.svg.simulation.on("tick", () => {
        tc.svg.lineElements
            .attr("d", d => "M" + d.source.x + "," + d.source.y + " A" + tc.svg.pathRadius + "," + tc.svg.pathRadius + ",0,0,1," + d.target.x + "," + d.target.y)
            .attr("fill", "none");

        tc.svg.nameElements
            .attr("x", d => d.x - d.data.nickname.length * tc.svg.fontSize / 2)
            .attr("y", d => d.y + tc.svg.nodeRadius + tc.svg.fontSize * 1.5);

        tc.svg.nodeElements
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    tc.svg.events = tc.svg.nodeElements.on("click", function () {
        var currentClickRoot = this.id.replace("-circle", "");
        var result = tc.checkChildrenNodes(currentClickRoot, tc.svg.linkData);
        tc.hideOrShowChildren(currentClickRoot, tc.svg.linkData, this);
        console.log(result);
    });

    console.log(tc.svg.svgElement);
    return tc.svg;
}


tc.svg.legends.create = function () {
    tc.svg.legends.elments = document.createElement("div");
    tc.svg.legends.elments.setAttribute("id", "legends");
    tc.svg.legends.elments.setAttribute("width", "100%");
    tc.svg.legends.elments.setAttribute("height", "100%");
    var json = [{
        color: "#0090DA",
        text: "根",
        id: "root-level"
    }, {
        color: "#A4CE4E",
        text: "一级",
        id: "first-level"
    }, {
        color: "#DB0A5B",
        text: "二级",
        id: "second-level"
    }, {
        color: "#00ACA0",
        text: "三级",
        id: "third-level"
    }, {
        color: "#5F259F",
        text: "四级",
        id: "fourth-level"
    }, {
        color: "#FFC600",
        text: "五级",
        id: "fifth-level"
    }];
    for (key in json) {
        var legendSample = tc.createLegendSample(json[key]);
        tc.svg.legends.elments.appendChild(legendSample);
    }
    return tc.svg.legends.elments;
}

tc.createLegendSample = function (json) {
    var legendSample = document.createElement("div");
    legendSample.setAttribute("id", json.id);
    legendSample.setAttribute("class", "level");
    var legendSampleColor = document.createElement("div");
    legendSampleColor.style.backgroundColor = json.color;
    legendSampleColor.setAttribute("class", json.id + " level-circle")
    var legendSampleText = document.createElement("div");
    legendSampleText.innerText = json.text;
    legendSampleText.style.fontFamily = "simsun";
    legendSampleText.style.fontSize = tc.svg.fontSize + 2 + "px";
    legendSampleText.style.lineHeight = tc.svg.fontSize + 2 + "px";
    legendSampleText.style.paddingTop = "4px";
    legendSampleText.setAttribute("class", json.id + " level-text");
    legendSample.appendChild(legendSampleColor);
    legendSample.appendChild(legendSampleText);
    return legendSample;
}

//Fetch Chain Data from JSON File and callback function to influence the data to d3 chart
d3.json('data/curve-tree.json').then(function (data, err) {
    console.log(data);
    console.log(err);
    tc.svg.treeData = data.treeData;
    tc.svg.linkData = data.linkData;
    var legends = tc.svg.legends.create();
    console.log(legends);
    var resetButtonDiv = document.createElement("div");
    resetButtonDiv.setAttribute("id", "reset-div");
    var resetButton = document.createElement("button");
    resetButton.setAttribute("id", "chart-reset-btn");
    resetButton.innerText = "重置";
    resetButtonDiv.appendChild(resetButton);
    var chartSVG = tc.renderChart(tc.svg.treeData);
    document.getElementById("transmission-chain-chart").append(resetButtonDiv);
    resetButtonDiv.style.width = window.innerWidth + "px";
    document.getElementById("transmission-chain-chart").append(legends);
    document.getElementById("transmission-chain-chart").append(chartSVG.svgElement.node());

    //Custom Event
    tc.svg.customEvents = {};
    tc.svg.customEvents.hidenodes = document.createEvent("HTMLEvents");
    tc.svg.customEvents.hidenodes.initEvent("hidenodes", false, false);
    tc.svg.customEvents.shownodes = document.createEvent("HTMLEvents");
    tc.svg.customEvents.shownodes.initEvent("shownodes", false, false);
    tc.temp.nodes = document.getElementsByClassName("node-circle");
    tc.temp.links = document.getElementsByClassName("link-line");
    tc.temp.nodeNicknames = document.getElementsByClassName("nickname");
    for (nodeKey in tc.temp.nodes) {
        if (nodeKey.match(/[0-9]{1,}/)) {
            tc.temp.nodes[nodeKey].addEventListener("hidenodes", function (event) {
                var nodeId = "#" + this.getAttribute("id");
                d3.select(nodeId).style("display", "none");
                this.setAttribute("is_shown", "false");
            });
            tc.temp.nodes[nodeKey].addEventListener("shownodes", function () {
                var nodeId = "#" + this.getAttribute("id");
                d3.select(nodeId).style("display", "block");
                this.setAttribute("is_shown", "true");
            });
            tc.temp.nodeNicknames[nodeKey].addEventListener("hidenodes", function (event) {
                var nodeId = "#" + this.getAttribute("id");
                d3.select(nodeId).style("display", "none");
                this.setAttribute("is_shown", "false");
            });
            tc.temp.nodeNicknames[nodeKey].addEventListener("shownodes", function () {
                var nodeId = "#" + this.getAttribute("id");
                d3.select(nodeId + "-nickname").style("display", "block");
                this.setAttribute("is_shown", "true");
            });
        }
    }
    for (linkKey in tc.temp.links) {
        if (linkKey.match(/[0-9]{1,}/)) {
            tc.temp.links[linkKey].addEventListener("hidenodes", function (event) {
                var linkId = "#" + this.getAttribute("id");
                d3.select(linkId).style("display", "none");
                this.setAttribute("is_shown", "false");
            });
            tc.temp.links[linkKey].addEventListener("shownodes", function () {
                var linkId = "#" + this.getAttribute("id");
                d3.select(linkId).style("display", "block");
                this.setAttribute("is_shown", "true");
            });
        }
    }
});

tc.hideOrShowChildren = function (rootID, linkData, domObject) {
    var childrenData = tc.checkChildrenNodes(rootID, linkData);
    var nodeArray = [];
    var nodes = childrenData.nodes;
    var links = childrenData.links;
    //show hide
    var show = d3.select(domObject).attr("children_shown");
    for (key in nodes) {
        if (key.match(/[0-9]{1,}/)) {
            var nodeCircle = document.getElementById(nodes[key].trim() + "-circle");
            var nodeNickname = document.getElementById(nodes[key].trim() + "-nickname");
            var link = document.getElementsByName(nodes[key].trim() + "-line")[0];
            // var show = true
            if (show == "true") {
                tc.svg.customEvents.hidenodes.rootDom = domObject;
                tc.svg.customEvents.hidenodes.rootDom.setAttribute("children_shown", "false");
                // console.log( tc.svg.customEvents.hidenodes.rootDom);
                nodeCircle.dispatchEvent(tc.svg.customEvents.hidenodes);
                nodeNickname.dispatchEvent(tc.svg.customEvents.hidenodes);
                link.dispatchEvent(tc.svg.customEvents.hidenodes);
            } else {
                tc.svg.customEvents.shownodes.rootDom = domObject;
                tc.svg.customEvents.shownodes.rootDom.setAttribute("children_shown", "true");
                // console.log( tc.svg.customEvents.shownodes.rootDom);
                nodeCircle.dispatchEvent(tc.svg.customEvents.shownodes);
                nodeNickname.dispatchEvent(tc.svg.customEvents.shownodes);
                link.dispatchEvent(tc.svg.customEvents.shownodes);
            }
        }
    }
}

tc.checkChildrenNodes = function (rootID, linkData) {
    var result = {};
    result.nodes = [];
    result.links = [];
    var children = [];
    var level = 0;
    children[level] = [rootID];
    var links = linkData.links;
    for (linkKey in links) {
        for (level = 0; level < 6; level++) {
            for (childrenKey in children[level]) {
                rootID = children[level][childrenKey];
                if (rootID == links[linkKey].source) {
                    result.links.push(links[linkKey].source + "-" + links[linkKey].target);
                    result.nodes.push(links[linkKey].target);
                    if (!children[level + 1]) {
                        children[level + 1] = []
                    }
                    children[level + 1].push(links[linkKey].target);
                    // console.log("result");
                    // console.log(result);
                    // console.log("children");
                    // console.log(children);
                }
            }
        }
    }
    return result;
}