<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
	</head>
	
	<script src="js/punishment.js" type="text/javascript" charset="utf-8"></script>
	<script src="dep/d3.v4.js" type="text/javascript"></script>
	<script src="dep/scaleRadial.js" type="text/javascript"></script>
	
	<script src="js/model.js" type="text/javascript" charset="utf-8"></script>
	<script src="js/artist.js" type="text/javascript"></script>
	<script src="js/server.js" type="text/javascript"></script>
	<script src="js/employee.js" type="text/javascript" charset="utf-8"></script>
	
	
	<script src="js/nervousManager.js" type="text/javascript" charset="utf-8"></script>
	
	<link rel="stylesheet" href="css/asterstyle.css" />
	<body>
		<div id="buttonLine">
			<button id='loadday1' onclick="loadCSVforDay(1)">1</button>
			<button id='loadday2' onclick="loadCSVforDay(2)">2</button>
			<button id='loadday3' onclick="loadCSVforDay(3)">3</button>
			<button id='loadday4' onclick="loadCSVforDay(4)">4</button>
			<button id='loadday5' onclick="loadCSVforDay(5)">5</button>
			<button id='loadday6' onclick="loadCSVforDay(6)">6</button>
			<button id='loadday7' onclick="loadCSVforDay(7)">7</button>
			<button id='loadday8' onclick="loadCSVforDay(8)">8</button>
			<button id='loadday9' onclick="loadCSVforDay(9)">9</button>
			<button id='loadday10' onclick="loadCSVforDay(10)">10</button>
			
			<button id='loadday11' onclick="loadCSVforDay(11)">11</button>
			<button id='loadday12' onclick="loadCSVforDay(12)">12</button>
			<button id='loadday13' onclick="loadCSVforDay(13)">13</button>
			<button id='loadday14' onclick="loadCSVforDay(14)">14</button>
			<button id='loadday15' onclick="loadCSVforDay(15)">15</button>
			<button id='loadday16' onclick="loadCSVforDay(16)">16</button>
			<button id='loadday17' onclick="loadCSVforDay(17)">17</button>
			<button id='loadday18' onclick="loadCSVforDay(18)">18</button>
			<button id='loadday19' onclick="loadCSVforDay(19)">19</button>
			<button id='loadday20' onclick="loadCSVforDay(20)">20</button>
			
			<button id='loadday21' onclick="loadCSVforDay(21)">21</button>
			<button id='loadday22' onclick="loadCSVforDay(22)">22</button>
			<button id='loadday23' onclick="loadCSVforDay(23)">23</button>
			<button id='loadday24' onclick="loadCSVforDay(24)">24</button>
			<button id='loadday25' onclick="loadCSVforDay(25)">25</button>
			<button id='loadday26' onclick="loadCSVforDay(26)">26</button>
			
			<button id='loadday27' onclick="loadCSVforDay(27)">27</button>
			<button id='loadday28' onclick="loadCSVforDay(28)">28</button>
			
			<button id='loadday29' onclick="loadCSVforDay(29)">29</button>
			<button id='loadday30' onclick="loadCSVforDay(30)">30</button>
			
			<button onclick="triggerFindDangerousEmployees()">Draw</button>
			
			
			  <input type="range" min="10" max="150" value="20" class="rangeSlider" id="sliderRange">
                  
			<label class="switch" style="float: right;">
			  <input id="randomYesNo" type="checkbox" onchange="triggerFindDangerousEmployees()">
			  <span class="slider"></span>
			</label>
		</div>
		<div id="d3Parent">
			<div id="asterDiv" onclick="removeHightlights()" class=""></div>
		</div>
		<div id="backgroundDiv"></div>
		<div id="floaterParent">
			<div id="barDiv"></div>
		</div>
		<div id="secondaryExplore">
			
		</div>
		<div id="tertiaryExplore">
			
		</div>
	</body>
	
	<script type="text/javascript">
		//MAIN:
		var manager = new NervousManager("Erich");

		var rangeslider = document.getElementById("sliderRange"); 
 

		  
		rangeslider.oninput = function() { 
		  triggerFindDangerousEmployees(this.value); 
		} 

		function triggerFindDangerousEmployees(numberToFind){
			if(!numberToFind){
				numberToFind = document.getElementById("sliderRange").value;
			}
			
			drawRadialStackedBarChart(manager.findDangerousEmployees(numberToFind));
		}
		
		function loadCSVforDay(day){
			document.getElementById("barDiv").innerHTML = "";
			document.getElementById("backgroundDiv").innerHTML = "";
			hideToolbars();
			if(!manager.managerBusy){
				manager.managerBusy = true;
			//document.getElementById("statush").innerHTML = "loading...";
				if(day > 1){
					if(day !== manager.lastDayExamined){
						manager.relaxTension();
					}
				}
				var child = document.getElementById("loadday" + day);
				var parent = document.getElementById("buttonLine");
				
				parent.removeChild(child);
				
				manager.loadCheckingCSV(day)
				manager.loadEmailCSV(day);
				manager.loadLoginCSV(day);
				manager.loadTCPLogCSV(day);
				manager.loadWebLogCSV(day);
				manager.lastDayExamined = day;
				
			}
		}
		
		function highlightAlerts(classID){
			if(currentDrawing.textOverridden){
				removeHightlights();
			}
			
			currentDrawing.saveOldText = {};
			var elems = document.getElementsByClassName("radTextSegment");
			var punishID = parseInt(classID.substring(3, classID.length));
			
			for(var i = 0; i < elems.length; i++){
				currentDrawing.saveOldText[elems[i].id] = elems[i].innerHTML;
				elems[i].innerHTML = manager.getEmployee(elems[i].id.substring(0, 4)).countRecentPunishments(punishID);
			}

			var elemsd3 = d3.selectAll("." + classID);
			elemsd3.style('fill', punishment[punishID].color);
			currentDrawing.textOverridden = true;
		}
		
		function removeHightlights(classID){
			if(!currentDrawing.keepSecondary){
				document.getElementById("secondaryExplore").innerHTML = "";
			} else {
				currentDrawing.keepSecondary = false;
			}
			
			if(currentDrawing.textOverridden){
				var toRemove = "dangerBar";
				if(classID) toRemove = classID;
				
				for (let [key, value] of Object.entries(currentDrawing.saveOldText)) {
					var elem = document.getElementById(key);
					if(elem) elem.innerHTML = value;
				}
				
				var elemsd3 = d3.selectAll("." + toRemove);
				
				elemsd3.each(function(){
					var d3Elem = d3.select(this);
					var dangerLevel = parseInt(d3Elem.attr("dangerLevel"));
					d3Elem.style('fill', getWedgeColor(dangerLevel));
				});
				currentDrawing.textOverridden = false;
				
			}
		}
		
		function toggleFocused(id, angle){ //员工被选上的反应方法
			
			hideToolbars();
			currentDrawing.examiningLifeTime = false;
			rotateCBG(-1 * angle * 57.2957795);
			var elem = document.getElementById(id +"tx");
			elem.classList.add("arcTextSelected");

			var isShowingAll = false;
			drawHorizontalBarChart(manager.getEmployee(id).compileRecentDangerReport(), id, isShowingAll);
			
			drawLineGraph(id,"danger")//"danger"
		}
		
		function showAllDanger(id){ //让bar chart显示所有警告信息
			var isShowingAll = true;
			currentDrawing.examiningLifeTime = true;
			drawHorizontalBarChart(manager.getEmployee(id).compileCompleteDangerReport(), id, isShowingAll);
		}
		
		function hideToolbars(){
			if(currentDrawing.textOverridden){
				removeHightlights();
			}
			document.getElementById("barDiv").innerHTML = "";
			document.getElementById("secondaryExplore").innerHTML = "";
		}
	</script>
</html>
	
