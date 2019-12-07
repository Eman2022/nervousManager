function CheckIn(line){//for strings (NOT IN USE)
	this.id;
	this.day;
	this.checkin;
	this.checkout;
	if(typeof line !== "undefined"){
		var parts = line.split(",");
		this.id = parts[0];
		this.day = parts[1];
		this.checkin = parts[2];
		this.checkout = parts[3];
	}
}



function WorkReport(date, minutes, present){
	this.estDate = date;
	this.minutesWorked = minutes;
	this.present = present;
	this.workOutput = 0;
	this.failedLogins = 0;
	this.danger = 0;
	this.alerts = [];
	
	this.addDanger = function(amount){
		this.danger += amount;
		return this;
	}
	this.addReward = function(amount){
		this.workOutput += amount;
		return this;
	}
	
	this.addAlert = function(alert){
		this.alerts.push(alert);
	}
	
	this.getAlerts = function(){
		return this.alerts;
	}
}
