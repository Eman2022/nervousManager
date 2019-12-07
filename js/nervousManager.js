	//Nervous Manager
	
	//my goal： 抓住员工1487 
	//1487 logged into accounts 1211, 1080, 1228
function NervousManager (name){
	
	this.name = name; //name of this manager
	totalEmployees = 0;
	employees = {};
	this.lastDayExamined = 0;


	
	this.findEmployeeByMainIp = function(ip){
		var empsWithThisMainIP = [];
		var bestGuess;
		for (let [key, employee] of Object.entries(employees)) {
			if(employee.mainIP === ip){
				empsWithThisMainIP.push(employee);
			}
		}
		if(empsWithThisMainIP.length === 1){
			return empsWithThisMainIP[0];
		} else if (empsWithThisMainIP.length > 1){
			//console.log("THIS FUNCTION WAS USEFUL");
			bestGuess = empsWithThisMainIP[0];
			for(var i = 1; i < empsWithThisMainIP; i++){
				var thisEmpl = empsWithThisMainIP[i];
				var ipUses = thisEmpl.ipUse[ip];
				if(ipUses > bestGuess.ipUse[ip]){
					bestGuess = thisEmpl;
				}
			}
			return bestGuess;
		}
	}
	
	this.relaxTension = function(){ //衰退危险
		for (let [key, employee] of Object.entries(employees)) {
			if(employee.dangerLevel > 0){
				//console.log("relaxing danger value of " + employee.id + " from " + employee.dangerLevel);
				var danger = employee.dangerLevel;
				var workOutput = employee.workOutput;
				danger = Math.floor(danger * 0.60);
				if(danger < 40) danger -= 10;
				if(danger < 0) danger = 0;
				
				workOutput = Math.floor(workOutput * 0.50);
				if(workOutput < 40) workOutput -= 10;
				if(workOutput < 0) workOutput = 0;
				
				employees[key].dangerLevel = danger;
				employees[key].workOutput = workOutput;
;				employee.criticalMessage = "";
				//console.log(" to: " + employees[key].dangerLevel);
			}
		}
	}
	
	function examineEmployeeID(id){//确定一个员工是存在的。不存在的话：创建
		if(typeof id !== "undefined"){
			if(id.length === 4){
				if(typeof this.employees[id] === "undefined"){ 
					employees[id] = new Employee(id);
					totalEmployees++;
					//console.log("making new employee with id of " + employees[id].id);
				}
			}
		}
	}

	function examineEmail(email){
		//time, proto, sip, sport, dip, dport, from, to, subject
		//console.log("got email from " +email.from + " emails");
		
		var fromParts = email.from.split("@");
		if(!isNaN(fromParts[0])){
			examineEmployeeID(fromParts[0]);
			employees[fromParts[0]].addEmailReport(email);
		}
	}


	function examineClockInReport(clockIn){ //分析一条打卡日志 
		//id, day, checkin, checkout
		var id = clockIn.id;
		examineEmployeeID(id);
		var wasAtWork = (clockIn.checkin !== "0" && clockIn.checkout !== "0");
		var minutesAtWork = 0;
		
		if(wasAtWork){
			//example:11/1/2017  6:22:15 AM
			var checkin = new Date(clockIn.checkin);
			var checkout = new Date(clockIn.checkout);
			var timeDiff = checkout.getTime() - checkin.getTime();
			timeDiff = (timeDiff / 1000) / 60;
			minutesAtWork = timeDiff;
		}
		var workReport = new WorkReport(clockIn.day,minutesAtWork,wasAtWork);
		employees[id].addWorkReport(workReport);
	}
	
	function examineLogin(login){
		//proto, dip, dport, sip, sport, state, time, user
		if(login){
			if(login.user.charAt(0) !== "r" && !isNaN(login.user)){//ignore root
				//console.log(" not ignoring " + login.user);
				examineEmployeeID(login.user);
				employees[login.user].addLoginReport(login);
			}
		}
	}
	
	this.loadLoginCSV = function(day){
		var dayString = "0";
		if(typeof day !== "undefined"){
			if(day < 10){
				dayString = dayString + day;
			} else {
				dayString = day;
			}
			d3.csv("csv/2017-11-"+dayString+"/login.csv", function(data) {
				data.forEach(function(d){
					examineLogin(d);
				});
			});

		}
	}
	
	this.loadEmailCSV = function(day){
		var dayString = "0";
		if(typeof day !== "undefined"){
			if(day < 10){
				dayString = dayString + day;
			} else {
				dayString = day;
			}
			d3.csv("csv/2017-11-"+dayString+"/email.csv", function(data) {
				data.forEach(function(d){
					examineEmail(d);
				});
			});
		}
		return this;
	}

	this.loadCheckingCSV = function(day){//加载打卡日志CSV
		var dayString = "0";
		if(typeof day !== "undefined"){
			if(day < 10){
				dayString = dayString + day;
			} else {
				dayString = day;
			}
			d3.csv("csv/2017-11-"+dayString+"/checking.csv", function(data) {
				data.forEach(function(d){
					examineClockInReport(d);
				});
			});
		}
		return this;
	};
	
	this.loadTCPLogCSV = function(day){
		var dayString = "0";
		if(typeof day !== "undefined"){
			if(day < 10){
				dayString = dayString + day;
			} else {
				dayString = day;
			}
			d3.csv("csv/2017-11-"+dayString+"/tcpLog.csv", function(data) {
				data.forEach(function(d){
					//TODO: finish
				});
			});
		}
		return this;
	}

	this.takeCheckingString = function(line){//接受一条新的打卡日志(NOT IN USE)
		var checkinObject = new CheckIn(line);
		examineClockInReport(checkinObject);
		return this;
	}

	this.getEmployee = function(id){
		return employees[id];
	}
	
	this.getTotalEmployees = function(){
		return totalEmployees;
	}
	
	this.findDangerousEmployees = function(num){
		var numberToFind = 20;
		if(typeof num !== "undefined"){
			numberToFind = num;
		}
		var dangerousEmployees = [];
		for (let [key, value] of Object.entries(employees)) {
		  if(value.dangerLevel > 0){
			dangerousEmployees.push(value);
			//console.log("dangerous employee: " + value.id + " : " + value.dangerLevel);
		  }
		}
		dangerousEmployees.sort(function(a, b){
			return a.dangerLevel - b.dangerLevel;
		});

		if(dangerousEmployees.length > numberToFind){
			dangerousEmployees = dangerousEmployees.slice((dangerousEmployees.length - numberToFind),dangerousEmployees.length);
		}
		return dangerousEmployees.reverse();
	}
	
	this.printOutFailedLogins = function(employees){
		for (let [key, value] of Object.entries(employees)) {
			var employii = value;
		  for (let [key2, value2] of Object.entries(employii.workReports)) {
			console.log(employii.id + "'s failed logins: " + value2.failedLogins + " on " + value2.estDate);
		  }
		}
	}
	
}
