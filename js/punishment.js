var punishment = {
	1 : { name : "missedWork", amount: 5, color:"#a5c34a", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "没有来上班 -5";
	}},
	2 : { name : "missedWorkTwice", amount: 10, color:"#bcc34a", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "两天没有来上班 -10";
	}},
	3 : { name : "missedWorkThreeDays", amount: 30, color:"#e2ce42", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "三天没有来上班 -15";
	}},
	4 : { name : "usedNewIP", amount: 25, color:"#ff7534", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "使用了从来没用过的IP地址 -25";
	}},
	5 : { name : "usedInfrequentlyUsedIp", amount: 4, color:"#e2a942", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "使用了不常用的IP地址 -4";
	}},
	6 : { name : "accessedNewIP", amount: 10, color:"#e2a942", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "访问了从来没用过的IP地址 -15";
	}},
	7 : { name : "accessedInfrequentlyUsedIP", amount: 5, color:"#c5f545", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "访问了不常用的IP地址 -5";
	}},
	8 : { name : "logInFail", amount: 5, color:"#e2a942", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "登录失败 -5";
	}},
	9 : { name : "sshlogInFail", amount: 10, color:"#e2ce42", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "SSH远程控制登录失败 -10";
	}},
	10 : { name : "suspiciousLoginFail", amount: 20, color:"#e25f42", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "的电脑在登录别人的账号登录失败了 -20";
	}},
	11 : { name : "suspiciousFTPLoginFail", amount: 30, color:"#e25f42", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "的电脑在登录别人的账号分享文件失败了 -30";
	}},
	12 : { name : "accountUnderAttack", amount: 15, color:"#e25f42", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "从不熟悉的电脑登录失败了 -15";
	}},
	13 : { name : "likelyStolen", amount: 30, color:"#000000", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "此用户账号被盗用有高概率 -30";
	}},
	14 : { name : "ghostOperation", amount: 20, color:"#ffd129", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "没打卡，有内网活动 -20";
	}},
	15 : { name : "missedFourDays", amount: 50, color:"#e25f42", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "四天没有来上班 -50";
	}},
	16 : { name : "visitedHiringSite", amount: 20, color:"#ff8721", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "访问了招聘网站 -20";
	}},
	17 : { name : "visitedTimeWastingSite", amount: 4, color:"#db19ff", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "访问了招聘网站 -4";
	}},
	18 : { name : "suspectedHacker", amount: 100, color:"#000000", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "成功盗用其他人账号概率高 -100";
	}},
	19 : { name : "sendingOutData", amount: 5, color:"#68b9ff", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "登了服务器然后把数据传到外网 -5";
	}},
	20 : { name : "sentOver500MBofData", amount: 500, color:"#68b9ff", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "登了服务器然后把500MB以上的数据传到外网 -500";
	}},
}


var rewards = {
	sentEmail : 15,
	loggedIn : 10,
	usedTCP : 5,
	internetAccess : 5
}
