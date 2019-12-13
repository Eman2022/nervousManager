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

function DangerReport(punishmentNumber, totalAmount){
	this.title = punishment[punishmentNumber].name
	this.totalDanger = totalAmount;
	this.punishID = punishmentNumber;
}

function LoginToServer(login){
	//proto, dip, dport, sip, sport, state, time, user
	this.time = new Date(login.time);
	this.user = login.user;
}

function ServerLog(dateIn){
	this.estDate = dateIn; //day
	this.accesses = 0;
	this.dataLeavingCompany = 0;
}

function WorkReport(date, minutes, present){
	this.estDate = date;
	this.minutesWorked = minutes;
	this.hasCheckedIn = false;
	this.present = present;
	this.workOutput = 0;
	this.failedLogins = 0;
	this.danger = 0;
	this.alerts = [];
	this.dataSentOut = 0;
	
	this.arrivedAtWork;
	this.leftWork;
	
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

var hiringWebsites = ["liepin","linkedin","zhipin","job","zhaopin","dajie","gongzuo","cjol","hire"];

var timeWasterSites = ["7k7k","sports","comic.qq","zhibo","hupu.c","2144","gxcxy","v.6.c","renren","v.qq.c",".17173.",".37.c","tudou.c",".readnovel.",
				       ".6.cn","games.qq.","xing.kugou.c","t.163.","video.hao123.", "jd.co","taobao",".5173.","douban", ".baihe.","mop.c","4399.c"];

function isAHiringWebsite(website){
	for(var i = 0; i < hiringWebsites.length; i++){
		if(website.includes(hiringWebsites[i])){
			return true;
		}
	}
	return false;
}

function isATimeWasterSite(website){
	for(var i = 0; i < timeWasterSites.length; i++){
		if(website.includes(timeWasterSites[i])){
			return true;
		}
	}
	return false;
}

function isCompanyServer(ip){
	if(ip.charAt(0) === '1' && ip.charAt(3) === '5' && ip.charAt(6) == '5'){
		return true;
	}
	return false;
}

function isEmployeeIP(ip){
	if(ip.includes("10.64.1")){
		return true;
	}
	return false;
}
