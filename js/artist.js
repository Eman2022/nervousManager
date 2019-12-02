function AsterWedge(employee, iter){
	this.id = employee.id;
	this.order = iter;
	this.score = employee.dangerLevel;
	this.weight = 0.5;
	this.color = getWedgeColor(employee.dangerLevel);
	this.label = employee.id;
	
	//console.log("got: " + employee.id);

}

function getWedgeColor(danger){
	var ratio = (danger / 100);
	var red =  Math.floor(ratio * 255);
	var blue = Math.floor(36 - (ratio * 36));
	var green = Math.floor(250 - (ratio * 250));
	return 'rgb(' + [red, green, blue].join(',') + ')';
}

function drawAsterPlot(dangerousEmployees){
	var wedges = [];
	if(typeof dangerousEmployees !== "undefined"){
		for(var i = 0; i < dangerousEmployees.length; i++){
			wedges.push(new AsterWedge(dangerousEmployees[i], i))
		}
	}
	
	var width = 750,
	    height = 750,
	    radius = Math.min(width, height) / 2,
	    innerRadius = 0.3 * radius;
	
	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d.width; });
	
	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([0, 0])
	  .html(function(d) {
	    return d.data.label + ": <span style='color:red'>" + d.data.score + "</span>";
	  });
	
	var arc = d3.svg.arc()
	  .innerRadius(innerRadius)
	  .outerRadius(function (d) { 
	    return (radius - innerRadius) * (d.data.score / 100.0) + innerRadius; 
	  });
	
	var outlineArc = d3.svg.arc()
	        .innerRadius(innerRadius)
	        .outerRadius(radius);
	document.getElementById("asterDiv").innerHTML = "";
	var svg = d3.select("#asterDiv").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	
	svg.call(tip);

	//d3.csv("https://gist.githubusercontent.com/bbest/2de0e25d4840c68f2db1/raw/52757de7e4584a6ff8cefbd2f8cea8a0d7cc2f0c/aster_data.csv", function(error, data) {
	
		data = wedges;
	  data.forEach(function(d) {
	    //d.id     =  d.id;
	    //d.order  = +d.order;
	    //d.color  =  d.color;
	    //d.weight = +d.weight;
	    //d.score  = +d.score;
	    d.width  = +d.weight;
	    //d.label  =  d.label;
	  });

	  
	  var path = svg.selectAll(".solidArc")
	      .data(pie(data))
	    .enter().append("path")
	      .attr("fill", function(d) { return d.data.color; })
	      .attr("class", "solidArc")
	      .attr("stroke", "gray")
	      .attr("d", arc)
	      .on('mouseover', tip.show)
	      .on('mouseout', tip.hide);
	
	  var outerPath = svg.selectAll(".outlineArc")
	      .data(pie(data))
	    .enter().append("path")
	      .attr("fill", "none")
	      .attr("stroke", "gray")
	      .attr("class", "outlineArc")
	      .attr("d", outlineArc);  
	
	
	  // calculate the weighted mean score
	  var score = 
	    data.reduce(function(a, b) {
	      //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
	      return a + (b.score * b.weight); 
	    }, 0) / 
	    data.reduce(function(a, b) { 
	      return a + b.weight; 
	    }, 0);
	
	  svg.append("svg:text")
	    .attr("class", "aster-score")
	    .attr("dy", ".35em")
	    .attr("text-anchor", "middle") // text-align: right
	    .text(Math.round(score));

}