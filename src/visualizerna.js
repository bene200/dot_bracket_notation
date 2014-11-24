function visRnaForce(nodes, links){
	d3.select("svg")
       .remove();
	var width = 1500;
	var height = 1200;

	var rnaSvg = d3.select("body").append("svg")
	  .attr("width", width)
	  .attr("height", height);

	var force = d3.layout.force()
	  .charge(-1000)
	  .gravity(0.3)
	  .linkDistance(function(d) {
	  	if(d.type === "hbond") {
	  	  return 7.5;
	  	}
	  	else {
	  	  return 2.5;
	  	}
	  })
	  .linkStrength(function(d) {
	  	if(d.type === "hbond") {
	  	  return 1.5;
	  	}
	  	else {
	  	  return 2.8;
	  	}
	  })
	  .size([width, height]);

	force
	  .nodes(d3.values(nodes))
	  .links(links)
	  .on("tick", tick)
	  .start();

	setTimeout(function() {
	      first = 0;
	      force.start();
	    }, 6000); 

	rnaSvg.append("defs").selectAll("marker")
	  .data(["phosphodiester", "hbond"])
	.enter().append("marker")
	  .attr("id", function(d) {return d; })
	  .attr("viewBox", "0 -5 10 10")
	  .attr("refX", 15)
	  .attr("refY", -1.5)
	  .attr("markerWidth", 6)
	  .attr("markerHeight", 6)
	  .attr("orient", "auto")
	.append("path")
	  .attr("d", "M0,-5L10,0L0,5");

	var bonds = rnaSvg.append("g").selectAll("path")
	  .data(force.links())
	.enter().append("path")
	  .attr("class", function(d) { return "link " + d.type; });
	 
	var rNucleotide = rnaSvg.append("g").selectAll("circle")
	  .data(force.nodes())
	.enter().append("circle")
	  .attr("r", function(d) { return 15; })
	  .style("fill", function(d){ 
	  	if(d.name === "A") { 
	  	  return "#64F73F"; 
	  	}
	  	else if(d.name === "U") {
	  	  return "#3C88EE";
	  	}
	  	else if(d.name === "C") {
	  	  return "#FFB340";
	  	}
	  	else {
	  	  return "#EB413C";
	  	}
	  })
	  .call(force.drag);

	var nucName = rnaSvg.append("g").selectAll("text")
	  .data(force.nodes())
	.enter().append("text")
	  .attr("x", -6)
	  .attr("y", ".31em")
	  .text(function(d) {return d.name; });

	function tick() {
	  bonds.attr("d", linkArc);
	  rNucleotide.attr("transform", transform);
	  nucName.attr("transform", transform);
	}

	function linkArc(d) {
	  var dx = d.target.x - d.source.x,
	      dy = d.target.y - d.source.y,
	      dr = Math.sqrt(dx * dx + dy * dy);
	  return "M" + d.source.x   + " " + d.source.y + " " + d.target.x + " " + d.target.y;
	}

	function transform(d) {
	  return "translate(" + d.x + "," + d.y + ")";
	}
}

function visRnaCytoscape(graph) {
	var div_id = "cytoscapeweb";
	var networkJson = toJson(graph);
    var options = getVisOpts();
    var visualStyle = getVisualStyle();

    // init and draw
    var vis = new org.cytoscapeweb.Visualization(div_id, options);

    vis.ready(function() {
        // set the style programmatically
        document.getElementById("color").onclick = function(){
        visualStyle.global.backgroundColor = "F6F6F6";
        vis.visualStyle(visualStyle);
        };
    });

    var rnaForce =  getLayout();

    var drawOptions = {
        network: networkJson,          
        edgeLabelsVisible: false,
        layout: rnaForce,
        visualStyle: visualStyle,
        panZoomControlVisible: false 
    };

    vis.draw(drawOptions);

}

function getVisOpts() {
	var options = {
        // where you have the Cytoscape Web SWF
        swfPath: "lib/cytoscape/swf/CytoscapeWeb",
        // where you have the Flash installer SWF
        flashInstallerPath: "lib/cytoscape/swf/playerProductInstall"
    };
    return options;
}

function getVisualStyle() {
	var visualStyle = {
        global: {
            backgroundColor: "#F6F6F6"
        },
        nodes: {
            shape: "ELLIPSE",
            borderWidth: 3,
            borderColor: "#383838",
            size: {
                defaultValue: 25,
                continuousMapper: { attrName: "weight", minValue: 25, maxValue: 75 }
            },
            color: {
                discreteMapper: {
                    attrName: "label",
                    entries: [
                        { attrValue: "A", value: "#64F73F" },
                        { attrValue: "U", value: "#3C88EE" },
                        { attrValue: "C", value: "#FFB340" },
                        { attrValue: "G", value: "#EB413C"}
                        ]
                    }
                },
            labelHorizontalAnchor: "center"
        },
        edges: {
            width: 3,
            color: {
            	discreteMapper: {
            		attrName: "label",
            		entries: [
            			{ attrValue: "hbond", value: "3A9AD9"},
            			{ attrValue: "phosphodiester", value: "#101010"}
            		]
            	}
            }
        }
    };
    return visualStyle;
}

function getLayout() {
	var forceOpts = { 
		//weightAttr: "weight",
		mass: 1,
        iterations:    500, 
        restLength: 30,
        maxTime:       10000,
        gravitation: -10000,
        autoStabilize: true,
        //minWeight: 1,
        //maxWeight: 2
    }; 

    rnaForce = {
    	name: "ForceDirected",
    	options: forceOpts
    };

    return rnaForce;
}
