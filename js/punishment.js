var punishment = {
	1 : { name : "missedWork", amount: 5, getText : function(id,dateIn){
		return dateIn + " 员工" + id + "没有来上班 -5";
	}},
	2 : { name : "missedWorkTwice", amount: 10, getText : function(id,dateIn){
		return dateIn + " 员工" + id + "两天没有来上班 -10";
	}},
	3 : { name : "missedWorkThreeDays", amount: 15, getText : function(id,dateIn){
		return dateIn + " 员工" + id + "三天没有来上班 -15";
	}},
	4 : { name : "usedNewIP", amount: 15, getText : function(id,dateIn){
		return dateIn + " 员工" + id + "使用了从来没用过的IP地址 -15";
	}},
	5 : { name : "usedInfrequentlyUsedIp", amount: 8, getText : function(id,dateIn){
		return dateIn + " 员工" + id + "使用了不常用的IP地址 -15";
	}},
	6 : { name : "accessedNewIP", amount: 10, getText : function(id,dateIn){
		return dateIn + " 员工" + id + "访问了从来没用过的IP地址 -15";
	}},
	7 : { name : "accessedInfrequentlyUsedIP", amount: 5, getText : function(id,dateIn){
		return dateIn + " 员工" + id + "访问了不常用的IP地址 -5";
	}},
	8 : { name : "logInFail", amount: 5, getText : function(id,dateIn){
		return dateIn + " 员工" + id + "登录失败 -5";
	}},
	9 : { name : "fileTransferlogInFail", amount: 10, getText : function(id,dateIn){
		return dateIn + " 员工" + id + "分享文件登录失败 -10";
	}},
	10 : { name : "suspiciousLoginFail", amount: 20, getText : function(id,dateIn){
		return dateIn + " 员工" + id + "的电脑在登录别人的账号登录失败了 -20";
	}},
	11 : { name : "suspiciousFTPLoginFail", amount: 30, getText : function(id,dateIn){
		return dateIn + " 员工" + id + "的电脑在登录别人的账号分享文件失败了 -30";
	}},
	12 : { name : "accountUnderAttack", amount: 15, getText : function(id,dateIn){
		return dateIn + " 员工" + id + "从不熟悉的电脑登录失败了 -15";
	}},
	13 : { name : "likelyStolen", amount: 30, getText : function(id,dateIn){
		return dateIn + " 员工" + id + "此用户账号被盗用有高概率 -30";
	}},
}


var rewards = {
	sentEmail : 15,
	loggedIn : 5
}
