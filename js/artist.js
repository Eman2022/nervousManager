var currentDrawing = {
	cx : 0,
	cy : 0,
	lastDate : "unknown"
}

function drawRadialStackedBarChart(dangerousEmployees){
	var highestDangerLevel = dangerousEmployees[0].dangerLevel;
	var maxValForWorkOutputBar = 100;
	var highestWorkOutput = 0;
	for(var i = 0; i < dangerousEmployees.length; i++){
		if(dangerousEmployees[i].workOutput > highestWorkOutput){
			highestWorkOutput = dangerousEmployees[i].workOutput;
		}
		if(dangerousEmployees[i].dangerLevel > 350){
			if(dangerousEmployees[i].criticalMessage.length == 0){
				dangerousEmployees[i].criticalMessage = " ALERT!";
			}
		}
	}
	
	dangerousEmployees = shuffleArray(dangerousEmployees);
	var boxSize = Math.min(screen.availWidth * 0.75, screen.availHeight);
	highestWorkOutput += 150;
	var maxValForDangerBar = 200;
	if(highestDangerLevel > 100) maxValForDisplay = highestDangerLevel + 50;
	document.getElementById("asterDiv").innerHTML = "";
	// set the dimensions and margins of the graph
	var margin = {top: 0, right: 0, bottom: 0, left: 0},
	    width = Math.floor(boxSize),
	    height = Math.floor(boxSize),
	    innerRadius = 120,
	    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border
	
	currentDrawing.cy = (height / 2);
	currentDrawing.cx = (width / 2);
	//var marginLeft = Math.floor(width * 0.25);
	// append the svg object
	var svg = d3.select("#asterDiv")
	  .append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    //.attr("style", "margin-left:" + 0 + "px")
	  .append("g")
	  .attr("id","radialStackedBar")
	  .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");
	
	//d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum.csv", function(data) {
	
	var data = dangerousEmployees;
	
	  // X scale: common for 2 data series
	  var x = d3.scaleBand()
	      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
	      .align(0)                  // This does nothing
	      .domain(data.map(function(d) { return d.id; })); // The domain of the X axis is the list of ids.
	
	  // Y scale outer variable
	  var y = d3.scaleRadial()
	      .range([innerRadius, outerRadius])   // Domain will be define later.
	      .domain([0, highestDangerLevel * 1.6]); // Domain of Y is from 0 to the max seen in the data
	
	  // Second barplot Scales
	  var ybis = d3.scaleRadial()
	      .range([innerRadius, 5])   // Domain will be defined later.
	      .domain([0, highestWorkOutput]);
	
	  var padAngle = 0.09;
	  //var ownedAngles = {};
	  // Add the bars
	  svg.append("g")
	    .selectAll("path")
	    .data(data)
	    .enter()
	    .append("path")
	      .attr("fill", function(d) { return getWedgeColor(d.dangerLevel);})
	      .attr("class", function(d){
	      	var thisDangerReports = d.compileRecentDangerReport();
	      	var classesToAdd = "dangerBar ";
	      	for(var i = 0; i < thisDangerReports.length; i++){
	      		classesToAdd += "pID"+thisDangerReports[i].punishID + " ";
	      	}
	      	return classesToAdd;
	      })
	      .attr("id", function(d) { return d.id; })
	      .attr("onmouseenter", function(d) { return "exploreDanger(" + d.id + ")"; })
	      .attr("dangerLevel", function(d) { return d.dangerLevel; })
	      .attr("onmouseleave", "hideToolbars()")
	      .attr("onclick", function(d) {
	      	//var toSpinto = ((x(d.id) + x.bandwidth() - x(d.id))) * 0.5 + x(d.id);
	      	//ownedAngles[d.id] = toSpinto;
	      	return "toggleFocused(" + d.id + ", " + (((x(d.id) + x.bandwidth() - x(d.id))) * 0.5 + x(d.id)) +")"; })//
	      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
	          .innerRadius(innerRadius)
	          .outerRadius(function(d) { return y(d.dangerLevel); })
	          .startAngle(function(d) { 
	          	return x(d.id); })
	          .endAngle(function(d) { 
	          	 return x(d.id) + x.bandwidth(); })
	          .padAngle(padAngle)
	          .padRadius(innerRadius));
	          
	          //console.log(ownedAngles);
	
	  // Add the labels
	  svg.append("g")
	      .selectAll("g")
	      .data(data)
	      .enter()
	      .append("g")
	        .attr("text-anchor", function(d) { return (x(d.id) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
	        .attr("transform", function(d) { return "rotate(" + ((x(d.id) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d.dangerLevel)+10) + ",0)"; })
	      .append("text")
	        .text(function(d){return(d.id + d.criticalMessage)})
	        .attr("transform", function(d) { return (x(d.id) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
	        .style("font-size", "11px")
	        .attr("alignment-baseline", "middle");
	
	  // Add the second series
	  svg.append("g")
	    .selectAll("path")
	    .data(data)
	    .enter()
	    .append("path")
	      .attr("fill", "#b2dbff")
	      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
	          .innerRadius( function(d) { return ybis(0) })
	          .outerRadius( function(d) { return ybis(d.workOutput); })
	          .startAngle(function(d) { return x(d.id); })
	          .endAngle(function(d) { return x(d.id) + x.bandwidth(); })
	          .padAngle(padAngle)
	          .padRadius(innerRadius));

}

function drawHorizontalBarChart(dangerReports, employeeID, isShowAll){
	//alert("got " + dangerousEmployees.length +" employees");
	
	var totalDanger = 0;
	var data = dangerReports;
	var maxValue = 100;
	for(var i = 0; i < dangerReports.length; i++){
		if(dangerReports[i].totalDanger > 100){
			maxValue = dangerReports[i].totalDanger;
		}
		totalDanger += dangerReports[i].totalDanger;
	}
	var showAllButton = "<button onclick='showAllDanger("+employeeID+")'>See all</button>";
	var title = "'s Recent Alerts    ";
	if(isShowAll){
		showAllButton = "";
		title = "'s Lifetime Alerts     ";
	}
	
	document.getElementById("barDiv").innerHTML = "<h4 style='position:absolute;top:30px;left:20px;z-index:50'>"
	+employeeID+ title +showAllButton+"</h4>";
	var margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 490 - margin.left - margin.right,
    height = 40 + 40 * dangerReports.length - margin.top - margin.bottom;

// append the svg object to the body of the page
	var svg = d3.select("#barDiv")
	  .append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .attr("style", "position:absolute; top:50px")
	  .append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")");


   
  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, maxValue])
    .range([ 0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.title + " " + (d.totalDanger / punishment[d.punishID].amount) + "x"; }))//d.title;
    .padding(.1);
  svg.append("g")
    .call(d3.axisLeft(y));
    
    var defaultColor = "#69b3a2";
    

    
    
  //Bars
  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )// + (d.totalDanger / punishment[d.punishID].amount) + "x")
    .attr("y", function(d) { return y(d.title + " " + (d.totalDanger / punishment[d.punishID].amount) + "x"); })
    .attr("id",function(d) { return "pID" + d.punishID; })
    .attr("class","alertBar")
    .attr("onmouseenter", function(d) { return "highlightAlerts('pID" + d.punishID + "')"})
    .attr("onmouseleave", function(d) { return "removeHightlights('pID" + d.punishID + "')"})
    .attr("width", function(d) { return x(d.totalDanger); })
    .attr("height", y.bandwidth())
    .attr("fill", function(d){
		return punishment[d.punishID].color;
    });
    

}


function rotateCBG(amount){ //旋转原型的图标
	var svg = d3.select("g");
        svg.transition()
        .duration(2500) //translate(' + (currentDrawing.cx / 2) + "," + (currentDrawing.cy / 2) + ")"
        .attr('transform' , 'rotate('+amount+', '+currentDrawing.cx+','+currentDrawing.cy +') translate('+ currentDrawing.cy +','+ currentDrawing.cx+ ')');
        //' + (currentDrawing.cx) + ',' + (currentDrawing.cy) +')' );
}


function getWedgeColor(danger){
	if(danger < 85) return "#808080";//gray
	var ratio = (danger / 100);
	var red =  Math.floor(ratio * 255);
	var blue = Math.floor(36 - (ratio * 36));
	var green = Math.floor(250 - (ratio * 250));
	return 'rgb(' + [red, green, blue].join(',') + ')';
}


function shuffleArray(arr) { // 把array里头的东西随机化
  const result = [];
  for (let i = arr.length-1; i >= 0; i--) {
    // picks an integer between 0 and i:
    const r = Math.floor(Math.random()*(i+1));   // NOTE: use a better RNG if cryptographic security is needed
    // inserts the arr[i] element in the r-th free space in the shuffled array:
    for(let j = 0, k = 0; j <= arr.length-1; j++) {
      if(result[j] === undefined) {
        if(k === r) {
          result[j] = arr[i];    // NOTE: if array contains objects, this doesn't clone them! Use a better clone function instead, if that is needed. 
          break;
        }
        k++;
      }
    }
  }
  return result;
}
