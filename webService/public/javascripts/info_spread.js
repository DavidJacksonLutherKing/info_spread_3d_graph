const height = window.innerHeight;
const width = window.innerWidth;

chart = function(data) {
    const root = d3.hierarchy(data);
    const links = root.links();
    const nodes = root.descendants();

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(200).strength(1))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

    const svg = d3.create("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)        
        .join("line");

    const node = svg.append("g")
        .attr("fill", "#fff")
        .attr("stroke", "#000")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .each(function(nodeList,index){    
            this.setAttribute("fill","url(#"+nodes[index].data.name+")");
        })
        .attr("stroke", d => d.children ? null : "#fff")
        .attr("r", 20)        
        .call(drag(simulation))
        .on("mousedown",function(){
            
            var t = d3.transition().duration(500).ease(d3.easeBounceIn);
            d3.select(this).interrupt();
            if(d3.select(this).attr("r")==20){      
                d3.selectAll("circle").transition(t).attr("r",20);              
                d3.select(this).transition(t).attr("r",30);                
            }else{                           
                d3.select(this).transition(t).attr("r",20);
            } 
        });
        
    const pattern =svg.append("defs")        
        .selectAll("pattern")
        .data(nodes)
        .join("pattern")
        .each(function(nodeList,index){
            this.setAttribute("id",nodes[index].data.name)
            this.setAttribute("width","100%");
            this.setAttribute("height","100%");
            this.setAttribute("patternContentUnits","objectBoundingBox")
        })
        .append("image")         
        .attr("xlink:href","http://userimg.yingyonghui.com/head/24/1458708838143/5426424.png-thumb")
        .attr("width",1)
        .attr("height",1);
    node.append("title")
    .text(d => d.data.name);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
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

d3.json("data/flare.json").then(function (data) {
    var a = chart(data);
    console.log(a);
    $("body>div").append(a);
});