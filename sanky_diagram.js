var item = document.getElementById("sanky_diagram");

var margin = {left: parseInt(window.getComputedStyle(item,null).getPropertyValue("width"),10)*0.2, right: parseInt(window.getComputedStyle(item,null).getPropertyValue("width"),10)*0.2},
    width = parseInt(window.getComputedStyle(item,null).getPropertyValue("width"),10)- margin.left - margin.right,
    height = parseInt(window.getComputedStyle(item,null).getPropertyValue("height"),10);

var svg = d3.select("svg").attr("transform", 
    "translate(" + margin.left + "," + 0 + ")");

// var formatNumber = d3.format(",.0f"),
//     format = function(d) { return formatNumber(d) + " times"; };
var color = d3.scaleOrdinal(d3.schemeCategory20);

var sankey = d3.sankey()
    .nodeWidth(40)
    .nodePadding(5)
    //.extent([[1, 1], [width - 1, height - 6]]); //fast to find the mini and the max from the range 
    .size([width,height]);

var link = svg.append("g")
    .attr("class", "links")
    .attr("fill", "none")
    .attr("stroke", "#000")
    //.attr("stroke-opacity", 0.1)
    .selectAll("path");

var node = svg.append("g")
    .attr("class", "nodes")
    .attr("font-family", "sans-serif")
    .attr("font-size", 14)
  .selectAll("g");

d3.json("data/data.json", function(error, energy) {
    if (error) throw error;

    sankey(energy);

    link = link
        .data(energy.links)
        .enter().append("path")
        .attr("class",function(d) { 
            var target = d.target.id.replace(/ /g,"-");
            target = target.replace(/,/g,"-")
            var classname = d.source.id+" "+target.replace(/&/g,"-") ;
            return classname ;
        })
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke-width", function(d) { return Math.max(5, d.width); })
        .attr("stroke-opacity", 0.2)
        .attr("opacity", 0.2); // return the stroke width range[1,d.width]

    link.append("title")
        .text(function(d) { return d.source.id + " → " + d.target.id + "\n" + d.value; });

    node = node
        .data(energy.nodes)
        .enter().append("g").attr("class", "nodes");

    node.append("rect")
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("fill", function(d) { return color(d.id.replace(/ .*/, "")); })
        .attr("stroke", "#000");

    node.append("text")
        .attr("x", function(d) { return d.x0 - 6; })
        .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(function(d) { return d.id; })
        .filter(function(d) { return d.x0 < width / 2; })
        .attr("x", function(d) { return d.x1 + 6; })
        .attr("text-anchor", "start");

    node.append("title")
        .text(function(d) { return d.id; });
    
    projection_node = svg.selectAll("rect")
                        .on("click",click);
    projection_path = svg.selectAll("path");
});

function click(d)
{
    projection_path.style("opacity",0.2);
    str = '.'+ d.id.replace(/ /g,"-");
    str = str.replace(/,/g,"-");
    highlight = svg.selectAll(str.replace(/&/g,"-")).style("opacity",1);
}