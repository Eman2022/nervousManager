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
}
