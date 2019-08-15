const height = window.innerHeight * 0.7;
const width = window.innerWidth;

chart = function (data) {
    const links = data.links.map(d => Object.create(d));
    const nodes = data.nodes.map(d => Object.create(d));
    console.log(links);
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(27));

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height]);

    const pattern = svg.append("defs")
        .selectAll("pattern")
        .data(nodes)
        .join("pattern")
        .select(function () {
            this.setAttribute("id", data.nodes[$(this).index()].id)
            this.setAttribute("width", "100%");
            this.setAttribute("height", "100%");
            this.setAttribute("patternContentUnits", "objectBoundingBox")
            var image = document.createElement("image")
            image.setAttribute("width", 1)
            image.setAttribute("height", 1)
            image.setAttribute("xlink:href", "http://userimg.yingyonghui.com/head/24/1458708838143/5426424.png-thumb");
            this.innerHTML = image.outerHTML;
        });

    const arrow_path = "M0,-5L10,0L0,5";
    const arrowMarker = svg.append("defs")
        .append("marker")  
        .attr("id","arrow")     
        .attr("markerUnits", "userSpaceOnUse")
        .attr("markerWidth", "12")
        .attr("markerHeight", "12")
        .attr("viewBox", "0 0 12 12")
        .attr("refX", "6")
        .attr("refY", "6")
        .attr("orient", "auto")
        .append("path")
        .attr("d", arrow_path)
        .attr("fill", "#000");


    const link = svg.append("g")
        .attr("stroke", "#333")
        .attr("stroke-opacity", 0.6)
        .selectAll("path")
        .data(links)
        .enter()
        .append("path")
        .attr("stroke-width", d => Math.sqrt(d.value))
        .attr("marker-end","url(#arrow)")
        // .select(function () {
        //     // this.setAttribute("mark-mid", "url(#" + data.links[$(this).index()].source + "-" + data.links[$(this).index()].target + ")");
        // });
       
    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 15)
        .attr("active", false)
        .select(function () {
            this.setAttribute("fill", "url(#" + data.nodes[$(this).index()].id + ")");
            this.setAttribute("id", data.nodes[$(this).index()].id + "-icon");
            return this;
        })
        .call(drag(simulation))


    const tooltip = svg.append("g")
        .attr("class", "tooltip-g")
        .append("rect")
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .attr("fill", "#eaeaea");

    const tooltip_text = svg.select("g.tooltip-g")
        .append("text")
        .attr("class", "tooltip-text tooltip")
        .attr("id", "tooltip-text")
        .attr("x", 50)
        .attr("y", 50)
        .style("font-size", 20)
        .text("none")








    node.append("title")
        .text(d => d.nickName);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => Math.max(30, Math.min(width - 30, d.x)))
            .attr("cy", d => Math.max(30, Math.min(height - 30, d.y)));
        d3.dispatch("centerchange");
    });
    return svg.node();
}

const showChildrenNode = function () {

}

const color = function () {
    const scale = d3.scaleOrdinal(d3.schemeCategory10);
    return d => scale(d.group);
}

const drag = simulation => {

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        var t1 = d3.transition().duration(500).ease(d3.easeBounceIn);
        var t2 = d3.transition().duration(700).ease(d3.easeQuadIn);
        var t3 = d3.transition().delay(700);
        d3.select(this).interrupt();
        d3.selectAll(".tooltip").interrupt();
        // if (d3.select(this).attr("r") == 15) {
        d3.selectAll("circle").transition(t1).attr("r", 15);
        d3.selectAll("circle").attr("active", false);
        d3.select(this).attr("active", true);
        d3.select(this).transition(t1).attr("r", 30);
        var radius = 15;
        var cx = parseInt(d3.select(this).attr("cx"));
        var cy = parseInt(d3.select(this).attr("cy"));
        var x = cx + 2.5 * radius;
        var y = cy - radius;
        d3.select("#tooltip").attr("x", x);
        d3.select("#tooltip").attr("y", y);
        d3.select("#tooltip-text").attr("x", x + 10);
        d3.select("#tooltip-text").attr("y", y + 1.5 * radius);
        d3.select("#tooltip-text").text(d3.select(this).text());
        d3.selectAll(".tooltip").style("display", "block");
        d3.selectAll(".tooltip").transition(t2).style("opacity", "1");
        var textLength = document.getElementsByClassName("tooltip-text")[0].getComputedTextLength();
        var textBoxWidth = textLength + 20;
        d3.select(".tooltip").style("width", textBoxWidth + "px");
        d3.select("#tooltip").style("z-index", 1000);
        d3.select("#tooltip-text").style("z-index", 1001);
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;

        var radius = 15;
        var cx = parseInt(d3.select(this).attr("cx"));
        var cy = parseInt(d3.select(this).attr("cy"));
        var x = cx + 2.5 * radius;
        var y = cy - radius;
        d3.select("#tooltip").attr("x", x);
        d3.select("#tooltip").attr("y", y);
        d3.select("#tooltip-text").attr("x", x + 10);
        d3.select("#tooltip-text").attr("y", y + 1.5 * radius);
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        // var t1 = d3.transition().duration(500).ease(d3.easeBounceIn);
        // var t2 = d3.transition().duration(700).ease(d3.easeQuadIn);
        // var t3 = d3.transition().delay(700);
        // // } else {
        // d3.select(this).transition(t1).attr("r", 15);
        // d3.select("#tooltip").transition(t2).style("opacity", "0");
        // d3.select("#tooltip").transition(t3).style("display", "none");
        // d3.select("#tooltip-text").transition(t2).style("opacity", "0");
        // d3.select("#tooltip-text").transition(t3).style("display", "none");
        setTimeout(function () {
            var radius = 15;
            var cx = parseInt(d3.select("circle[active=true]").attr("cx"));
            var cy = parseInt(d3.select("circle[active=true]").attr("cy"));
            var x = cx + 2.5 * radius;
            var y = cy - radius;
            var t1 = d3.transition().duration(500).ease(d3.easeBounceIn);
            var t2 = d3.transition().duration(300).ease(d3.easeQuadIn);
            var t3 = d3.transition().delay(700);
            d3.select("#tooltip").transition(t2).attr("x", x);
            d3.select("#tooltip").transition(t2).attr("y", y);
            d3.select("#tooltip-text").transition(t2).attr("x", x + 10);
            d3.select("#tooltip-text").transition(t2).attr("y", y + 1.5 * radius);
        }, 1500);
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

d3.json("data/nodes_routes.json").then(function (data) {
    var a = chart(data);
    // console.log(a);
    $("body>div").append(a);
});