function Employee(id){
	this.id = id;
	this.daysKnown = 0;
	this.daysAtWork = 0;
	this.totalMinutesWorked = 0;
	this.totalWorkOutput = 0.0;
	this.mainIP = "undefined"; //自己的IP地址
	
	this.dangerLevel = 0.0;
	this.totalAddedDanger = 0.0;
	
	this.workReports = {};
	this.ipUse = {};
	this.ipAccess = {};
	this.talksTo = {};
	
	this.getDaysWorked = function(){
		return this.daysAtWork;
	}
	
	
	this.examineLoginFailue = function(accessDate, login, usedIPisMyIp){
		//proto, dip, dport, sip, sport, state, time, user
		
		this.punish(accessDate, punishment.logInFail);	
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
		//console.log("my main IP predicted for " + this.id + ": " + myMainIP);
		
		if((ip in this.ipUse)){ //记录用的IP地址
			this.ipUse[ip] += 1;
		} else {
			this.ipUse[ip] = 1;
			if(this.daysKnown > 2){
				this.punish(dateEst, punishment.usedNewIP);
			}
		}
	}
	
	this.examineAccessedIP = function(dateEst, ip){
		if((ip in this.ipAccess)){ //记录打开的IP地址
			this.ipAccess[ip] += 1;
		} else {
			this.ipAccess[ip] = 1;
			if(this.daysKnown > 2){
				this.punish(dateEst, punishment.accessedNewIP);
			}
		}
	}
	
	this.punish = function(dateIn, amount){ //惩罚此员工
		this.dangerLevel += amount;
		this.totalAddedDanger += amount;
		if(!(dateIn in this.workReports)){
			var nwr = new WorkReport(dateIn, 0, false);
			nwr.addDanger(amount);
			this.workReports[dateIn] = nwr;
		} else {
			this.workReports[dateIn].addDanger(amount);
		}
	}
	
	this.reward = function(dateIn, amount){ //表扬此员工
		this.totalWorkOutput += amount;
		
		if(!(dateIn in this.workReports)){
			var nwr = new WorkReport(dateIn, 0, false);
			nwr.addReward(amount);
			this.workReports[dateIn] = nwr;
		} else {
			this.workReports[dateIn].addReward(amount);
		}
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
			if(!usedIPisMyIp && this.daysKnown > 2) console.log("successful HACK DETECTED getting into " + login.user);
			this.reward(accessDate, rewards.loggedIn);	//增加工作量
		} else {
			this.examineLoginFailue(accessDate, login, usedIPisMyIp);//检查登录失败
			if(!usedIPisMyIp && this.daysKnown > 2){
				var badguy = "?";
				if(typeof manager !== "undefined"){
					badguy = manager.findEmployeeByMainIp(login.sip).id;
				}
				console.log("unsuccessful HACK DETECTED");
				console.log(badguy + " trying to get into " + login.user);
				
			} 
		}
		
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
			this.punish(workReport.estDate, punishment.missedWork);
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
						this.punish(workReport.estDate, punishment.missedTwoDays)
					}
				}
			}
			
			//console.log(this.id + " missed work! \nnew danger: " + this.dangerLevel + "\n test compare: " + tryDate.toString()+ " : " + workReport.estDate);
		}
	}

}
