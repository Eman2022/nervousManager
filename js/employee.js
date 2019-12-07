function Employee(id){
	this.id = id;
	this.daysKnown = 0;
	this.daysAtWork = 0;
	this.totalMinutesWorked = 0;
	this.totalWorkOutput = 0.0;
	this.mainIP = "undefined"; //自己的IP地址
	
	this.workOutput = 0.0; //floating per day
	this.dangerLevel = 0.0; //floating per day
	this.totalAddedDanger = 0.0;
	
	
	this.workReports = {};
	this.ipUse = {};
	this.ipAccess = {};
	this.talksTo = {};
	
	this.dangerBarStartAngle;
	this.dangerBarEndAngle;
	
	this.criticalMessage = "";
	
	this.getDaysWorked = function(){
		return this.daysAtWork;
	}
	
	this.examineLoginFailue = function(accessDate, login, usedIPisMyIp){
		//proto, dip, dport, sip, sport, state, time, user
		if(usedIPisMyIp){
			if(login.proto === "ssh"){
				this.punish(accessDate, 9);
			} else {
				this.punish(accessDate, 8);
			}
		} else {
			this.punish(accessDate, 12);
			if(this.daysAtWork > 2){
				var badActor;
				if(typeof manager !== "undefined"){
					badActor = manager.findEmployeeByMainIp(login.sip);
				}
				if(typeof badActor !== "undefined"){
					if(login.proto === "ftp"){
						badActor.punish(accessDate, 11);
					} else {
						badActor.punish(accessDate, 10);
					}
					console.log(badActor.id + " trying to get into " + login.user);
				}
			}
		}
		this.workReports[accessDate].failedLogins += 1;
	}
	
	this.examineUsedIP = function(dateEst, ip){
		var myMainIP; var uses = 0;
		for (let [key, value] of Object.entries(this.ipUse)) {
			if(value > uses) {
				uses = value;
				myMainIP = key;
			}
		}
		this.mainIP = myMainIP;

		
		if((ip in this.ipUse)){ //记录用的IP地址
			this.ipUse[ip] += 1;
			if(this.ipAccess[ip] < 3 && this.daysKnown > 2){
				this.punish(dateEst, 5);
			}
		} else {
			this.ipUse[ip] = 1;
			if(this.daysKnown > 2){
				this.punish(dateEst, 4);
			}
		}
	}
	
	this.examineAccessedIP = function(dateEst, ip){
		if((ip in this.ipAccess)){ //记录打开的IP地址
			this.ipAccess[ip] += 1;
			
			if(this.ipAccess[ip] < 5 && this.daysKnown > 2){
				this.punish(dateEst, 7);
			}
			
		} else {
			this.ipAccess[ip] = 1;
			if(this.daysKnown > 2){
				this.punish(dateEst, 6);
			}
		}
	}
	
	this.punish = function(dateIn, punishmentNumber){ //惩罚此员工
		var amount = punishment[punishmentNumber].amount;
		this.dangerLevel += amount;
		this.totalAddedDanger += amount;
		if(!(dateIn in this.workReports)){
			var nwr = new WorkReport(dateIn, 0, false);
			nwr.addDanger(amount);
			nwr.addAlert(punishmentNumber);
			this.workReports[dateIn] = nwr;
		} else {
			this.workReports[dateIn].addDanger(amount).addAlert(punishmentNumber);
		}
		if(this.dangerLevel > 500){
			this.criticalMessage = " ALERT";
			if(this.dangerLevel > 600){
				this.criticalMessage = " ALERT!";
				if(this.dangerLevel > 700){
					this.criticalMessage = " ALERT!!";
					if(this.dangerLevel > 800){
						this.criticalMessage = " ALERT!!!";
						if(this.dangerLevel > 900){
							this.criticalMessage = " ALERT!!!!";
						}
					}
				}
			}
			
		}
		
	}
	
	this.reward = function(dateIn, amount){ //表扬此员工
		this.totalWorkOutput += amount;
		this.workOutput += amount;
		if(!(dateIn in this.workReports)){
			var nwr = new WorkReport(dateIn, 0, false);
			nwr.addReward(amount);
			this.workReports[dateIn] = nwr;
		} else {
			this.workReports[dateIn].addReward(amount);
		}
	}
	
	this.getRecentFailedLogons = function(accessDate){
		var dateParts = accessDate.split("-"); //2017-11-06
		var day = parseInt(dateParts[2]); day = day - 1;
		var otherDate = "";
		var recentFailedLogins = this.workReports[accessDate].failedLogins;
		if(day > 1){
			if(day < 10) day = "0" + day.toString();
			var yesterday = dateParts[0] + "-" + dateParts[1] + "-" + day;
			
			otherDate = " and " + yesterday;
			var yesterdayReport = this.workReports[yesterday];
			if(typeof yesterdayReport !== "undefined"){
				recentFailedLogins += yesterdayReport.failedLogins;
			}
		}
		
		
		//console.log(this.id + "'s recent failed logins for " + accessDate + otherDate + " : " + recentFailedLogins);
		return recentFailedLogins;
	}
	
	this.addLoginReport = function(login){
		//proto, dip, dport, sip, sport, state, time, user
		var loginSuccess = login.state.charAt(0) === 's';
		var usedIPisMyIp = login.sip === this.mainIP;
		var dateparts = login.time.split(" ");	
		var accessDate = dateparts[0];
		
		this.examineUsedIP(accessDate, login.sip); //记录使用的IP地址
		
		this.examineAccessedIP(accessDate, login.dip);//记录访问的IP地址
		
		if(loginSuccess){
			if(!usedIPisMyIp && this.daysAtWork > 2){
				
				var badActor;
				if(typeof manager !== "undefined"){
					badActor = manager.findEmployeeByMainIp(login.sip);
					if(typeof badActor !== "undefined"){
						//console.log(badActor.id + " successful HACK DETECTED getting into " + login.user);
						var whoDunnit = badActor.id;
						//console.log("compare: " + badActor.id + " " + login.user + " -> " + badActor.id.localeCompare(login.user));
						if(badActor.id.localeCompare(login.user) == 0) whoDunnit = "其他";

						this.criticalMessage = "活动来自" + whoDunnit + "的电脑";
						//console.log(this.id + "'s critical message set to: " + this.criticalMessage);
						var recentFailed = this.getRecentFailedLogons(accessDate);
						if(recentFailed > 10){
							this.punish(accessDate, 13);
						}
					}
				}
				
			} else {
				this.reward(accessDate, rewards.loggedIn);	//增加工作量
			}
			
		} else {
			this.examineLoginFailue(accessDate, login, usedIPisMyIp);//检查登录失败

		}
		
	}
	
	this.addTCPReport = function(report){//TODO:finish
		//stime, dtime, proto, dip, dport, sip, sport, uplink_length, downlink_length
		this.examineUsedIP(report.sip);
		this.examineAccessedIP(report.dip);
		
		
	}
	
	this.addEmailReport = function(email){
		//time, proto, sip, sport, dip, dport, from, to, subject
		
		var dateparts = email.time.split(" ");	//增加工作量
		var sentDate = dateparts[0];
		this.reward(sentDate, rewards.sentEmail);
		
		this.examineUsedIP(sentDate, email.sip); //记录使用的IP地址
//		if(email.from.split("@")[0] === "1348"){
//			console.log("our guy sent an email! : " + this.totalWorkOutput);
//		}
		var usedIPisMyIp = true;
		if(this.daysKnown > 3){
			usedIPisMyIp = email.sip === this.mainIP;
		}
		if(!usedIPisMyIp){
			var badguy = "?";
			if(typeof manager !== "undefined"){
				badguy = manager.findEmployeeByMainIp(email.sip);
				if(typeof badguy === "undefined"){
					 badguy = "?";
				} else {
					badguy = badguy.id;
				}
			}
			console.log("SUSPECTED EMAIL TAMPERING OF " + this.id + "'S EMAIL BY " + badguy);
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
	
	this.addWorkReport = function(workReport){//打卡信息
		
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
			//this.dangerLevel += punishment.missedWork;
			this.punish(workReport.estDate, 1);
			//console.log(punishment[1].getText(this.id, workReport.estDate));
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
						this.punish(workReport.estDate, 2);
						//console.log(punishment[2].getText(this.id, workReport.estDate));
					}
				}
			}
			
			//console.log(this.id + " missed work! \nnew danger: " + this.dangerLevel + "\n test compare: " + tryDate.toString()+ " : " + workReport.estDate);
		}
	}

}
