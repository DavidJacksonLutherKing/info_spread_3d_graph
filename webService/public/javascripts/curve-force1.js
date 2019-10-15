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
            }))
        .on('dblclick.zoom', null);


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
        .attr("is_shown", "true")
        .selectAll("text")
        .data(tc.svg.nodes)
        .join("text")
        .attr("font-size", tc.svg.fontSize)
        .attr("stroke", "black")
        .attr("width", d => d.data.nickName.length * tc.svg.fontSize)
        .attr("height", 20)
        .text(d => d.data.nickName + "," + d.data.gender)
        .attr("id", d => d.data.customerID + "-nickname")
        .attr("class", "nickname");

    tc.svg.simulation.on("tick", () => {
        tc.svg.lineElements
            .attr("d", d => "M" + d.source.x + "," + d.source.y + " A" + tc.svg.pathRadius + "," + tc.svg.pathRadius + ",0,0,1," + d.target.x + "," + d.target.y)
            .attr("fill", "none");

        tc.svg.nameElements
            .attr("x", d => d.x - d.data.nickName.length * tc.svg.fontSize / 2)
            .attr("y", d => d.y + tc.svg.nodeRadius + tc.svg.fontSize * 1.5);

        tc.svg.nodeElements
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    console.log(tc.svg.svgElement);
    return tc.svg;
}


//Fetch Chain Data from JSON File and callback function to influence the data to d3 chart
d3.json('data/curve-tree-2.json').then(function (data, err) {
    console.log(data);
    console.log(err);
    
    
    tc.svg.treeData = data
    tc.svg.linkData = {
        nodes:tc.nodesFromTree(data),
        links:tc.treeToLink(data)
    };

    var resetButtonDiv = document.createElement("div");
    resetButtonDiv.setAttribute("id", "reset-div");
    var resetButton = document.createElement("button");
    resetButton.setAttribute("id", "chart-reset-btn");
    resetButton.innerText = "重置";
    resetButtonDiv.appendChild(resetButton);

    var chartSVG = tc.renderChart(tc.svg.treeData);
    document.getElementById("transmission-chain-chart").append(resetButtonDiv);
    resetButtonDiv.style.width = window.innerWidth + "px";

    var svgDiv = document.createElement("div")
    svgDiv.setAttribute("id", "chain-svg-div");
    document.getElementById("transmission-chain-chart").append(svgDiv);
    document.getElementById("chain-svg-div").append(chartSVG.svgElement.node());
    resetButton.addEventListener("click", function () {
        document.getElementById("chain-svg-div").innerHTML="";
        var chartSVG = tc.renderChart(tc.svg.treeData);
        document.getElementById("chain-svg-div").append(chartSVG.svgElement.node());
        tc.showNickName();
    });
    tc.showNickName();


});

tc.showNickName = function () {
    d3.selectAll("circle").on("click", function () {
        var textId = this.id.replace('-circle', '-nickname');
        var textDisplay = document.getElementById(textId).style.display;
        if (textDisplay == 'none' || textDisplay == '') {
            document.getElementById(textId).style.display = 'block';
        } else {
            document.getElementById(textId).style.display = 'none';
        }
    });
}

tc.nodesFromTree = function (tree) {
    var nodes = [];
    var node = Object.assign({}, tree);
    var children = Object.assign([], node.children);
    delete node.children;
    // console.log(node);
    nodes.push(node);

    var chidrenNode = [];
    if (children.length > 0) {
        for (key in children) {
            chidrenNode = chidrenNode.concat(tc.nodesFromTree(children[key]));
            // console.log(chidrenNode);
        }
    }
    return nodes.concat(chidrenNode);
}

tc.treeToLink = function (tree) {
    var node = Object.assign({}, tree);
    var children = Object.assign([], node.children);
    var links = [];
    var link = {};
    if (children.length > 0) {
        for (key in children) {
            link.customerID = node.customerID;
            link.forwardUserID = children[key].customerID;
            link.value = node.value;
            link.pageURL = "";
            link.pageName = "";
            links.push(link);
            links = links.concat(tc.treeToLink(children[key]));
        }
    }
    // console.log(links);
    return links;
}