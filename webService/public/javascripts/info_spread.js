const height = window.innerHeight * 0.7;
const width = window.innerWidth;

chart = function (data) {
    const links = data.links.map(d => Object.create(d));
    const nodes = data.nodes.map(d => Object.create(d));

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(27));

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height]);

    const link = svg.append("g")
        .attr("stroke", "#333")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 15)
        .on("mousedown", function () {
            var t1 = d3.transition().duration(500).ease(d3.easeBounceIn);
            var t2 = d3.transition().duration(700).ease(d3.easeQuadIn);
            d3.select(this).interrupt();
            if (d3.select(this).attr("r") == 15) {
                d3.selectAll("circle").transition(t1).attr("r", 15);
                d3.select(this).transition(t1).attr("r", 30);
                d3.select(".tooltip-text").text(d3.select(this).text());
                d3.select(".tooltip").style("display", "block");
                d3.select(".tooltip").transition(t2).style("opacity", "1");
                d3.select(".tooltip").style("z-index", 1000);
                var radius = 15;
                var cx = parseInt(d3.select(this).attr("cx"));
                var cy = parseInt(d3.select(this).attr("cy"));
                var x = cx + 2.5*radius;
                var y = cy - radius;
                d3.select(".tooltip").attr("x",x);
                d3.select(".tooltip").attr("y",y);
            } else {
                d3.select(this).transition(t1).attr("r", 15);
                d3.select(".tooltip").text("");
                d3.select(".tooltip").transition(t2).style("opacity", "0");
                d3.select(".tooltip").delay(700).style("display", "none");
            }
        })
        .select(function () {
            this.setAttribute("fill", "url(#" + data.nodes[$(this).index()].id + ")");
            return this;
        })
        .call(drag(simulation));

    const tooltip = svg.append("g")
        .append("rect")
        .attr("class", "tooltip")
        .attr("fill","#eaeaea")
        .append("text")
        .attr("class","tooltip-text")
        .attr("x",50)
        .attr("y",50)
        .style("font-size",20)
        .text("none")
    

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
    });
    return svg.node();
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

d3.json("data/nodes_routes.json").then(function (data) {
    var a = chart(data);
    console.log(a);
    $("body>div").append(a);
});