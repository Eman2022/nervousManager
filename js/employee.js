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
	this.websiteAccess = {};
	
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
			if(this.daysAtWork > 2){
				this.punish(accessDate, 12);
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
					console.log(accessDate + " " + badActor.id + " trying to get into " + login.user);
				}
			}
		}
		if(typeof this.workReports[accessDate] !== "undefined"){
			this.workReports[accessDate].failedLogins += 1;
		}
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
			
			if(this.ipAccess[ip] < 5 && this.daysKnown > 4){
				this.punish(dateEst, 7);
			}
			
		} else {
			this.ipAccess[ip] = 1;
			if(this.daysKnown > 2){
				this.punish(dateEst, 6);
			}
		}
	}
	
	this.countRecentPunishments = function(punishID){//数一下此员工前段时间(两天)被这个惩罚被惩罚了几次
		//console.log(this.id + " looking for recent " + punishID + " punishments");
		var dangerReports;
		if(currentDrawing.examiningLifeTime){
			dangerReports = this.compileCompleteDangerReport();
		} else {
			dangerReports = this.compileRecentDangerReport();
		}
		var numberOfTimes = 0;
		//console.log("compare " + punishID + " and " + dangerReports[0].punishID);
		for(var i = 0; i < dangerReports.length; i++){
			if(dangerReports[i].punishID == punishID){
				//console.log("found related danger report");
				numberOfTimes = dangerReports[i].totalDanger / punishment[punishID].amount;
			}
		}
		
		if(numberOfTimes === 0){
			numberOfTimes = "";
		} else {
			numberOfTimes = numberOfTimes + "x";
		}
		return numberOfTimes;
	}
	
	this.addDataSent = function(dateIn, amount, ipofServer){ //记录这个员工发数据到外网
		if(!(dateIn in this.workReports)){
			var nwr = new WorkReport(dateIn, 0, false);
			nwr.dataSentOut = amount;
			this.workReports[dateIn] = nwr;
		} else {
			this.workReports[dateIn].dataSentOut += amount;
		}
		if(!(ipofServer in this.ipAccess)){
			this.ipAccess[ipofServer] = 1;
		} 
		if(amount > 500000000){
			this.punish(dateIn, 20);
			console.log(punishment[20].getText(this.id, dateIn));
			this.criticalMessage = " LEAK!!";
		} else if (amount > 150000000){
			this.punish(dateIn, 19);
		}
		//console.log(this.id + " was using " + ipofServer + " sending " + amount + " bytes out. times " +
		//"used server: " + this.ipAccess[ipofServer]);
	}
	
	this.punish = function(dateIn, punishmentNumber){ //惩罚此员工
		var isAbsenteePunishment = punishmentNumber === 1 || punishmentNumber === 2 ||
		punishmentNumber === 3 || punishmentNumber === 15;
		
		
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
			if(!isAbsenteePunishment && typeof this.workReports[dateIn].present !== "undefined"){
				if(!this.workReports[dateIn].present && this.workReports[dateIn].hasCheckedIn){
					amount = punishment[14].amount;
					this.dangerLevel += amount;
					this.totalAddedDanger += amount;
					this.workReports[dateIn].addDanger(amount).addAlert(14);;
				}
			}
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

		if(!this.workReports[dateIn].present && this.workReports[dateIn].hasCheckedIn){
			amount = punishment[14].amount;
			this.dangerLevel += amount;
			this.totalAddedDanger += amount;
			this.workReports[dateIn].addDanger(amount).addAlert(14);;
		}
	}
	
	
	this.getFailedLogonTotalCount = function(){ //拿到今天和昨天的登录失败总额

		
		var logInFails = 0;
		var alerts = [];
		for (let [key, value] of Object.entries(this.workReports)) {
			alerts = alerts.concat(value.getAlerts());

		}
		for(var i = 0; i < alerts.length; i++){
			if(alerts[i] === 8 || alerts[i] === 12) logInFails++;
		}
		//console.log("recent login fails: " + logInFails);
		//console.log(this.id + "'s recent failed logins for " + accessDate + otherDate + " : " + recentFailedLogins);
		return logInFails;
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
			if(!usedIPisMyIp && this.daysAtWork > 1){
				
				var badActor;
				if(typeof manager !== "undefined"){
					badActor = manager.findEmployeeByMainIp(login.sip);
					if(typeof badActor !== "undefined"){

						var whoDunnit = badActor.id;
						if(badActor.id.localeCompare(login.user) == 0){
							whoDunnit = "其他";
						} else {
							badActor.punish(accessDate, 18);
						}
						this.criticalMessage = "活动来自" + whoDunnit + "的电脑";
						console.log(this.id + " strange login on " + accessDate);
	
						this.punish(accessDate, 13);

					} else {
						console.log(this.id + " strange logon detected but no bad actor detected: " + accessDate);
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
		var isAtWork = true;
		var dateparts = report.stime.split(" ");	
		var accessDate = dateparts[0];
		this.examineUsedIP(accessDate, report.sip);
		
		if(report.proto !== "http") this.examineAccessedIP(accessDate, report.dip);
		if(this.daysAtWork > 1){
			if(report.sip === this.mainIP){
				this.reward(accessDate, rewards.usedTCP);
				//console.log("rewarding " + this.id + " for tcp work");
			}
		}
	}
	
	this.addWebLog = function(log){
		//time, sip, sport, dip, dport, host
		//console.log("adding log to " +this.id + ":\n" + log.host);
		var dateparts = log.time.split(" ");	
		var accessDate = dateparts[0];
		
		this.examineUsedIP(accessDate, log.sip);
		if(log.host in this.websiteAccess){
			this.websiteAccess[log.host] += 1;
		} else {
			this.websiteAccess[log.host] = 1;
		}
		var isHiringWebiste = false;//isAHiringWebsite(log.host);
		var isaTimeWasterSite = isATimeWasterSite(log.host);

		if(isaTimeWasterSite){
			this.punish(accessDate, 17);
		} else {
			isHiringWebiste = isAHiringWebsite(log.host);
			if(isHiringWebiste){
				this.punish(accessDate, 16);
			}
		}

		if(!isHiringWebiste && !isHiringWebiste){
			this.reward(accessDate, rewards.internetAccess);
		}
	}
	
	this.addEmailReport = function(email){
		//time, proto, sip, sport, dip, dport, from, to, subject
		
		var dateparts = email.time.split(" ");	//增加工作量
		var sentDate = dateparts[0];
		this.examineUsedIP(sentDate, email.sip); //记录使用的IP地址

		var usedIPisMyIp = true;
		if(this.daysKnown > 3){
			usedIPisMyIp = email.sip === this.mainIP;
		}
		if(!usedIPisMyIp){
			var badguy = "?";
			if(typeof manager !== "undefined"){
				badguy = manager.findEmployeeByMainIp(email.sip);
				//console.log("EMAIL INSPECTOR! LOOKING FOR " + email.sip);
				if(typeof badguy === "undefined"){
					 badguy = "?";
				} else {
					badguy = badguy.id;
				}
			}
		} else {
			this.reward(sentDate, rewards.sentEmail);
		}
	
		if(email.to.indexOf(";") > 0){ //记录发给谁
			var sentToList = [];
			email.to.split(";").forEach(function(address){
				var front = address.split("@"); 
				front = front[0];
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
			thisReport.present = workReport.present;
			thisReport.hasCheckedIn = true;
			if(typeof workReport.arrivedAtWork !== "undefined"){
				thisReport.arrivedAtWork = workReport.arrivedAtWork;
			}
			this.workReports[workReport.estDate] = thisReport;
		} else {
			workReport.hasCheckedIn = true;
			this.daysKnown++;
			if(workReport.present){
				this.daysAtWork++;
				this.totalMinutesWorked += workReport.minutesWorked;
			}
			this.workReports[workReport.estDate] = workReport;
		}
		if(!workReport.present){
			this.punish(workReport.estDate, 1);
			//console.log(punishment[1].getText(this.id, workReport.estDate));
			var parts = workReport.estDate.split("-");
			var day = parseInt(parts[2]);
			if(day > 1){
				var dayString = "0";
				if(day > 9) dayString = "";
				var yesterdayString = parts[0] + "-" + parts[1] + "-" + dayString + (day - 1);

				var yesterdayReport = this.workReports[yesterdayString];

				if(typeof yesterdayReport !== "undefined"){
					if(!yesterdayReport.present && yesterdayReport.hasCheckedIn){
						this.punish(workReport.estDate, 2);
						var qianTianString = parts[0] + "-" + parts[1] + "-" + dayString + (day - 2);
						var qianTianReport = this.workReports[qianTianString];
						if(typeof qianTianReport !== "undefined"){
							if(!qianTianReport.present && qianTianReport.hasCheckedIn){
								this.punish(workReport.estDate, 3);
								var fourDaysBackString = parts[0] + "-" + parts[1] + "-" + dayString + (day - 3);
								var fourDaysBack = this.workReports[fourDaysBackString];
								if(typeof fourDaysBack !== "undefined"){
									if(!fourDaysBack.present && fourDaysBack.hasCheckedIn){
										this.punish(workReport.estDate, 15);
										if(this.criticalMessage === ""){
											this.criticalMessage = " ABSENTEE WARNING!!";
										}
										//console.log(punishment[15].getText(this.id, workReport.estDate));
									}
								}
							}
						}
						
					}

				}
			}
			
			//console.log(this.id + " missed work! \nnew danger: " + this.dangerLevel + "\n test compare: " + tryDate.toString()+ " : " + workReport.estDate);
		} else {
			if(typeof workReport.arrivedAtWork !== "undefined"){
				var hourPart = parseInt(workReport.arrivedAtWork.split(":")[0]);
				if(hourPart > 9){
					this.punish(workReport.estDate, 21);
				}
			}
		}
	}
	
	
	
	this.compileRecentDangerReport = function(){
		var dangerReports = [];
		var punishments = {};
		var alerts = [];
		var secondToLast;
		var lastWorkReport = 'x';
		for (let [key, value] of Object.entries(this.workReports)) {
			secondToLast = lastWorkReport;
			lastWorkReport = value;
		}
		var alerts = lastWorkReport.getAlerts();
		if(secondToLast !== 'x'){
			alerts = alerts.concat(secondToLast.getAlerts());
		}
		for(var i = 0; i < alerts.length; i++){
			if(typeof punishments[alerts[i]] === "undefined"){ 
				punishments[alerts[i]] = punishment[alerts[i]].amount;
			} else {
				punishments[alerts[i]] += punishment[alerts[i]].amount;
			}
		}
		for (let [key, value] of Object.entries(punishments)) {
			dangerReports.push(new DangerReport(key,value));
		}
		dangerReports.sort(function(a, b){
			return a.totalDanger - b.totalDanger;
		});
		dangerReports.reverse();
		return dangerReports;
	}
	
	this.compileCompleteDangerReport = function(){
		var dangerReports = [];
		var punishments = {};
		var alerts = [];
		var secondToLast;
		var lastWorkReport = 'x';
		for (let [key, value] of Object.entries(this.workReports)) {
			alerts = alerts.concat(value.getAlerts());

		}
		for(var i = 0; i < alerts.length; i++){
			if(typeof punishments[alerts[i]] === "undefined"){ 
				punishments[alerts[i]] = punishment[alerts[i]].amount;
			} else {
				punishments[alerts[i]] += punishment[alerts[i]].amount;
			}
		}
		for (let [key, value] of Object.entries(punishments)) {
			dangerReports.push(new DangerReport(key,value));
		}
		dangerReports.sort(function(a, b){
			return a.totalDanger - b.totalDanger;
		});
		dangerReports.reverse();
		return dangerReports;
	}
	
	this.computeTotalDataOut = function(){
		var dataOut = 0;
		for (let [key, value] of Object.entries(this.workReports)) {
			console.log(this.id + " data out on " + value.estDate + ": " + value.dataSentOut);
			dataOut += value.dataSentOut;
		}
		return dataOut;
	}
}
