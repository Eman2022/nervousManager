function Server(ip){
	this.ip = ip;
	
	this.mostRecentUsers = [];
	this.activityReports = {};
	
	this.addLoginReport = function(login){
		//proto, dip, dport, sip, sport, state, time, user
		var dateparts = login.time.split(" ");	
		var accessDate = dateparts[0];
		if(!(accessDate in this.activityReports)){
			this.activityReports[accessDate] = new ServerLog(accessDate);
		}
		this.activityReports[accessDate].accesses += 1;
		this.mostRecentUsers.push(new LoginToServer(login));
	}
	
	this.addTCPReport = function(report){
		//stime, dtime, proto, dip, dport, sip, sport, uplink_length, downlink_length
		if(report){
			if(manager){
				if(!isCompanyServer(report.dip) && !isEmployeeIP(report.dip)){//确认不是发给内部人
					var dateparts = report.stime.split(" ");	
					var accessDate = dateparts[0];
					if(!(accessDate in this.activityReports)){
						this.activityReports[accessDate] = new ServerLog(accessDate);
					}
					this.activityReports[accessDate].dataLeavingCompany += Math.floor(report.uplink_length / 1000);
					if(report.uplink_length > 1000000){
						var likelyUser = this.getMostRecentUser(report.stime);
						//console.log("preparing to blame " + likelyUser + " for sharing data");
						if(likelyUser !== "?"){
							if(manager){
								var employee = manager.getEmployee(likelyUser);
								if(employee){
									employee.addDataSent(accessDate, report.uplink_length, report.sip);
								}
							}
						}
						//if(this.ip === "10.50.50.26") console.log("BIG DATA GOING OUT TO " + report.dip + " from " + likelyUser);
					}
				}
			}
		}
		//console.log("adding a tcp report for interal server " + this.ip);
	}
	
	this.getMostRecentUser = function(dateTime){
		var timeOfTransfer = new Date(dateTime);
		//if(this.ip === "10.50.50.26") console.log(dateTime + " access of " + this.ip + " scanning: ");
		var closestDifference = 1070001;
		var likelyUser = "?";
		for(var i = 0; i < this.mostRecentUsers.length; i++){
			var difference = timeOfTransfer - this.mostRecentUsers[i].time;
			if(difference < 2500) continue;
			if(difference > 1000000) continue;
			//if(this.ip === "10.50.50.26") console.log(this.mostRecentUsers[i].time + ": " + (timeOfTransfer - this.mostRecentUsers[i].time));
			
			
			if(difference < closestDifference){
				closestDifference = difference;
				likelyUser = this.mostRecentUsers[i].user;
			}
			
		}
		if(closestDifference > 600000 || closestDifference === 1070001) likelyUser = "?";
		//if(this.ip === "10.50.50.26") console.log("found "+likelyUser + " out of "+ this.mostRecentUsers.length + " recent logins. time diff: " + closestDifference);
		return likelyUser;
	}
}
