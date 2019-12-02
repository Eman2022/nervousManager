
	//Nervous Manager
	
	//my goal： 抓住员工1487
function NervousManager (name){
	
	this.name = name; //name of this manager
	totalEmployees = 0;
	employees = {};
	employeeIDList = [];
	
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
		for (let [key, value] of Object.entries(dangerousEmployees)) {
			var employii = value;
		  for (let [key2, value2] of Object.entries(employii.workReports)) {
			console.log(employii.id + "'s failed logins: " + value2.failedLogins + " on " + value2.estDate);
		  }
		}
		
		return dangerousEmployees.reverse();
	}
	
}



