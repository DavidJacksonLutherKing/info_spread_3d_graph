//Define Namespace as tc for transmission chain application object.
var tc = new Object();
tc.temp = tc.temp || {
    removedNodes: {},
    removedLinks: {},
    nodes: [],
    links: []
};

tc.history = tc.history || {
    rootData: new Object(),
    historyRecord: new Array(),
    maxHistoryNodeNum :10,
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
    rootCircleBorderWidth: 7,
    fontSize: 12,
    manybodyStrength: -1000,
    personIconBase64: "data:image/png;base64,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",
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

//Define updateSvg Function
tc.updateSvg = function (data) {
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
                tc.svg.childCountElements.attr("transform", d3.event.transform);
            }))
        .on('dblclick.zoom', null);


    tc.svg.lineElements = tc.svg.svgElement.append("g")
        .attr("class", "line")
        .selectAll("line")
        .data(tc.svg.links)
        .join("line")
        .attr("id", d => d.source.data.customerID + "-" + d.target.data.customerID + "-line")
        .attr("name", d => d.target.data.customerID + "-line")
        .attr("class", "link-line")
        .attr("end", d => d.target.data.customerID)
        .attr("is_shown", "true")
        .attr("stroke", "#333")
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
        .attr("r", d => (d.parent != null ? tc.svg.nodeRadius : tc.svg.rootRadius))
        .attr("fill", d => "url(#" + d.data.customerID + "-img)")
        .attr("id", d => d.data.customerID + "-circle")
        .attr("stroke", d => (d.parent != null ? "yellow" : "black"))
        .attr("stroke-width", d => (d.parent != null ? tc.svg.circleBorderWidth : tc.svg.rootCircleBorderWidth))
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
        .text(d => d.data.nickName)
        .attr('encryptedNickname', d => d.data.nickName)
        .attr('gender', d => d.data.gender)
        .attr("id", d => d.data.customerID + "-nickname")
        .attr("class", "nickname");

    tc.svg.childCountElements = tc.svg.svgElement.append("g")
        .attr("class", "childCount")
        .selectAll("text")
        .data(tc.svg.nodes)
        .join("text")
        .attr("font-size", tc.svg.fontSize)
        .attr("stroke", "black")
        .text(d => d.data.childCount)
        .attr("id", d => d.data.customerID + "-childCount")
    tc.svg.simulation.on("tick", () => {
        tc.svg.lineElements
            // .attr("d", d => "M" + d.source.x + "," + d.source.y + " A" + tc.svg.pathRadius + "," + tc.svg.pathRadius + ",0,0,1," + d.target.x + "," + d.target.y)
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
            .attr("stroke", "black");

        tc.svg.nameElements
            .attr("x", d => d.x - d.data.nickName.length * tc.svg.fontSize / 2)
            .attr("y", d => d.y + tc.svg.nodeRadius + tc.svg.fontSize * 1.5);

        tc.svg.childCountElements
            .attr("x", d => (d.parent != null ? d.x + tc.svg.nodeRadius : d.x + tc.svg.rootRadius))
            .attr("y", d => (d.parent != null ? d.y + tc.svg.nodeRadius : d.y + tc.svg.rootRadius));

        tc.svg.nodeElements
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    // console.log(tc.svg.svgElement);
    return tc.svg;
}


//Fetch Chain Data from JSON File and callback function to influence the data to d3 chart
d3.json('data/curve-force-1000-node-tree.json').then(function (data, err) {
    console.log(data);
    console.log(err);
    tc.svg.treeData = data;
    tc.svg.linkData = {
        nodes: tc.nodesFromTree(data),
        links: tc.treeToLink(data)
    };
    tc.history.historyRecord = [tc.svg.treeData];
    tc.renderChart(tc.svg.treeData);


});

tc.renderChart = function (data) {
    document.getElementById("transmission-chain-chart").innerHTML = "";
    var resetButtonDiv = document.createElement("div");
    resetButtonDiv.setAttribute("id", "reset-div");
    var resetButton = document.createElement("button");
    resetButton.setAttribute("id", "chart-reset-btn");
    resetButton.innerText = "重置";
    resetButtonDiv.appendChild(resetButton);
    var chartSVG = tc.updateSvg(data);
    document.getElementById("transmission-chain-chart").append(resetButtonDiv);
    // resetButtonDiv.style.width = window.innerWidth + "px";

    var historyBar = document.createElement("div");
    historyBar.setAttribute("id", "history-bar-div");
    var historyRec = Object.assign([], tc.history.historyRecord);
    tc.generateNewHistoryBar(historyBar, historyRec);

    document.getElementById("transmission-chain-chart").append(historyBar);

    var svgDiv = document.createElement("div")
    svgDiv.setAttribute("id", "chain-svg-div");
    document.getElementById("transmission-chain-chart").append(svgDiv);
    document.getElementById("chain-svg-div").innerHTML = "";
    document.getElementById("chain-svg-div").append(chartSVG.svgElement.node());
    resetButton.addEventListener("click", function () {
        document.getElementById("chain-svg-div").innerHTML = "";
        tc.history.historyRecord = [tc.svg.treeData];

        var historyBar = document.getElementById("history-bar-div");
        historyBar.innerHTML = "";
        var historyRec = Object.assign([], tc.history.historyRecord)
        tc.generateNewHistoryBar(historyBar, historyRec);

        var chartSVG = tc.updateSvg(tc.svg.treeData);
        document.getElementById("chain-svg-div").append(chartSVG.svgElement.node());
        tc.showNickName();
        tc.showChildNodeTree()
    });
    tc.showNickName();
    tc.showChildNodeTree();
}


tc.generateNewHistoryBar = function (historyBar, historyRec) {
    for (key in historyRec) {
        var aLink = document.createElement("a");
        aLink.setAttribute("history-seq", key);
        aLink.setAttribute("class", "historyClickNode");
        aLink.addEventListener("click", function () {
            var index = this.getAttribute("history-seq");
            console.log(index);
            var data = tc.history.historyRecord[index];
            tc.history.historyRecord = tc.history.historyRecord.slice(0, parseInt(index) + 1);
            console.log(tc.history);
            console.log(data);
            tc.renderChart(data);
        });
        var image = document.createElement("img");
        image.setAttribute("src", historyRec[key].img == "" ? tc.svg.personIconBase64 : historyRec[key].img);

        var arrow = document.createElement("div");
        arrow.setAttribute("class", 'history-path');
        arrow.innerText = ">";

        aLink.append(image);
        historyBar.append(aLink);
        historyBar.append(arrow);        
        // console.log(aLink);
        // console.log(historyRec[key].img);
    }
}

tc.showChildNodeTree = function () {
    d3.selectAll("circle").on("click", function (d) {
        // console.log(d);
        if (tc.history.historyRecord[tc.history.historyRecord.length - 1].customerID != d.data.customerID) {
            tc.history.historyRecord.push(d.data);
            if(tc.history.historyRecord.length>tc.history.maxHistoryNodeNum){
                tc.history.historyRecord = tc.history.historyRecord.slice(tc.history.historyRecord.length-tc.history.maxHistoryNodeNum);
                console.log(tc.history.historyRecord);
            }
            tc.renderChart(d.data);
        }
    });
}

tc.showNickName = function () {
    d3.selectAll("circle").on("click", function (d) {
        // d.children = null;
        // var textId = this.id.replace('-circle', '-nickname');
        // var text = document.getElementById(textId);
        // var encryptedNickname = text.getAttribute("encryptedNickname").trim();
        // d3.text("http://localhost:8080/rsa-encryption/unencrypt/nickname/" + encryptedNickname).then(function (data) {
        //     text.innerHTML = data + "," + text.getAttribute("gender");
        //     var textDisplay = document.getElementById(textId).style.display;
        //     if (textDisplay == 'none' || textDisplay == '') {
        //         text.style.display = 'block';
        //     } else {
        //         text.style.display = 'none';
        //     }
        // });
    });
}

tc.getRootTreeData = function (d) {
    var node = Object.assign({}, d)
    if (node.parent != null) {
        result = this.getRootTreeData(node.parent);
    } else {
        console.log(node.parent);
        console.log(node.data);
        result = node.data;
    }
    return result;
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
            chidrenNode = chidrenNode.concat(this.nodesFromTree(children[key]));
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
            links = links.concat(this.treeToLink(children[key]));
        }
    }
    // console.log(links);
    return links;
}

function convertImgToBase64(url, callback, outputFormat) {
    var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        canvas = null;
    };
    img.src = url;
}

//图片地址 
var imagePath = '/images/image.png';
convertImgToBase64(imagePath, function (base64Img) {
    // console.log(base64Img);
});