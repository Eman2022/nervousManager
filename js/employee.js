function Employee(id){
	this.id = id;
	this.daysKnown = 0;
	this.daysAtWork = 0;
	this.totalMinutesWorked = 0;
	this.totalWorkOutput = 0.0;
	this.dangerLevel = 0.0;
	this.workReports = {};
	this.ipUse = {};
	this.talksTo = {};
	
	this.getDaysWorked = function(){
		return this.daysAtWork;
	}
	
	this.examineUsedIP = function(ip){
		if((ip in this.ipUse)){ //记录用的IP地址
			this.ipUse[ip] += 1;
		} else {
			this.ipUse[ip] = 1;
			this.dangerLevel += punishment.usedNewIP;
		}
	}
	
	this.addLoginReport = function(login){
		//proto, dip, dport, sip, sport, state, time, user
		this.examineUsedIP(login.sip);
		
		var dateparts = login.time.split(" ");	//增加工作量
		var sentDate = dateparts[0];
		
		if(!(sentDate in this.workReports)){
			var nwr = new WorkReport(sentDate, 0, false);
			if(login.state.charAt(0) === 's'){
				nwr.workOutput = rewards.loggedIn;
			} else {
				this.dangerLevel += punishment.logInFail;
				nwr.failedLogins = 1;
			}
			this.workReports[sentDate] = nwr;
			this.totalWorkOutput += nwr.workOutput;
		} else {
			if(login.state.charAt(0) === 's'){
				this.workReports[sentDate].workOutput += rewards.loggedIn;
				this.totalWorkOutput += rewards.loggedIn;
			} else {
				this.dangerLevel += punishment.logInFail;
				this.workReports[sentDate].logInFail += 1;
			}
		}
	}
	
	this.addEmailReport = function(email){
		//time, proto, sip, sport, dip, dport, from, to, subject
		
		this.examineUsedIP(email.sip);
		
		var dateparts = email.time.split(" ");	//增加工作量
		var sentDate = dateparts[0];
		if(!(sentDate in this.workReports)){
			var nwr = new WorkReport(sentDate, 0, false);
			nwr.workOutput = rewards.sentEmail;
			this.workReports[sentDate] = nwr;
		} else {
			this.workReports[sentDate].workOutput += rewards.sentEmail;
		}
		
		
		if(email.to.indexOf(";") > 0){ //记录发给谁
			var sentToList = [];
			email.to.split(";").forEach(function(address){
				var front = address.split("@"); 
				front = front[0];
				//console.log(fromID + " sent to " + front);
				if(!isNaN(front)){
					sentToList.push(front);
				}
			});
			if(sentToList.length > 0){
				for(var i = 0; i < sentToList.length; i++){
					if(!(sentToList[i] in this.talksTo)){
						this.talksTo[sentToList[i]] = 1;
					} else {
						this.talksTo[sentToList[i]] += 1;
					}
				}
			}
		} else {
			var front = email.to.split("@");
			front = front[0];
			if(!(front in this.talksTo) && !isNaN(front)){
				this.talksTo[front] = 1;
			} else {
				this.talksTo[front] += 1;
			}
		}
	}
	
	this.addWorkReport = function(workReport){
		var thisReport = this.workReports[workReport.estDate];
		if(typeof thisReport !== "undefined"){
			thisReport.minutesWorked = workReport.minutesWorked;
			thisReport.present = workReport.present
			this.workReports[workReport.estDate] = thisReport;
		} else {
			this.workReports[workReport.estDate] = workReport;
			this.totalMinutesWorked += workReport.minutesWorked;
			this.daysKnown++;
			if(workReport.present) this.daysAtWork++;
		}
		if(!workReport.present){
			this.dangerLevel += punishment.missedWork;
			var parts = workReport.estDate.split("-");
			var day = parseInt(parts[2]);
			if(day > 1){
				var dayString = "0";
				if(day > 9) dayString = "";
				var yesterdayString = parts[0] + "-" + parts[1] + "-" + dayString + (day - 1);
				//console.log("absent on " + workReport.estDate);
				//console.log("looking at secondary date: " + yesterdayString);
				var yesterdayReport = this.workReports[yesterdayString];
				if(typeof yesterdayReport !== "undefined"){
					if(!yesterdayReport.present){
						this.dangerLevel += punishment.missedTwoDays;
					}
				}
			}
			
			//console.log(this.id + " missed work! \nnew danger: " + this.dangerLevel + "\n test compare: " + tryDate.toString()+ " : " + workReport.estDate);
		}
	}

}