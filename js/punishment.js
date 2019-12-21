var punishment = {
	1 : {properName : "Missed Work", name : "missedWork", amount: 5, color:"#a5c34a", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "旷工一天 +5风险";
	}, lighterColor : "#d3ea8c"},
	2 : {properName : "Missed Work Two Days in a Row", name : "missedWorkTwice", amount: 10, color:"#bcc34a", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "连续旷工两天+10风险";
	}, lighterColor : "#d7dc81"},
	3 : {properName : "Missed Work Three Days in a Row", name : "missedWorkThreeTimes", amount: 30, color:"#e2ce42", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "连续旷工三天 +15风险";
	}, lighterColor : "#e8dc83"},
	4 : {properName : "Used New IP", name : "usedNewIP", amount: 60, color:"#ff7534", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "账号使用了非本人陌生IP地址进行操作.有盗用风险. +60风险";
	}, lighterColor : "#ff9e70"},
	5 : {properName : "Used Infrequently Used IP", name : "usedInfrequentlyUsedIp", amount: 4, color:"#e2a942", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "使用了不常用的IP地址. 此员工的账号在其他电脑登录了. +4 风险";
	}, lighterColor : "#f9d491"},
	6 : {properName : "Accessed a new IP", name : "accessedNewIP", amount: 10, color:"#e2a942", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "访问了从来没访问过的IP地址 +15风险";
	}, lighterColor : "#f9d491"},
	7 : {properName : "Accessed Infrequently Used IP", name : "accessedInfrequentlyUsedIP", amount: 5, color:"#c5f545", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "访问了不常用的IP地址 +5风险";
	}, lighterColor : "#dcfb8a"},
	8 : {properName : "Login Fail", name : "logInFail", amount: 5, color:"#e2a942", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "的账号登录失败 +5风险";
	}, lighterColor : "#f9d491"},
	9 : {properName : "SSH Login Fail", name : "sshlogInFail", amount: 10, color:"#e2ce42", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "SSH远程控制登录失败 +10风险";
	}, lighterColor : "#e8dc83"},
	10 : {properName : "Suspicious Login Fail", name : "suspiciousLoginFail", amount: 20, color:"#e25f42", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "的电脑有登录他人账号失败的行为. +20风险";
	}, lighterColor : "#e89f8f"},
	11 : {properName : "Suspicious FTP Login Fail", name : "suspiciousFTPFail", amount: 30, color:"#e25f42", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "的电脑有登录他人账号文件传输失败的行为. +30风险";
	}, lighterColor : "#e89f8f"},
	12 : {properName : "Account Under Attack", name : "accountUnderAttack", amount: 15, color:"#e25f42", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "在非本人电脑上登录失败. +15风险";
	}, lighterColor : "#e89f8f"},
	13 : {properName : "Likely Stolen", name : "likelyStolen", amount: 50, color:"#000000", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "在非本人的电脑登录成功.且存在在他人电脑登录失败的历史.该账号被盗用风险高. +50风险";
	}, lighterColor : "#d8d8d8"},
	14 : {properName : "Ghost Activity", name : "ghostOperation", amount: 20, color:"#ffd129", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "没打卡但还有内网活动. +20风险";
	}, lighterColor : "#ffe894"},
	15 : {properName : "Missed Work Four Days in a Row", name : "missedFourDays", amount: 50, color:"#e25f42", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "连续旷工四天 +50风险";
	}, lighterColor : "#e89f8f"},
	16 : {properName : "Visited Hiring Website", name : "visitedHiringSite", amount: 20, color:"#ff8721", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "访问了招聘网站.存在跳槽风险. +20风险";
	}, lighterColor : "#ffc08a"},
	17 : {properName : "Visited Time Wasting Website", name : "visitedTimeWastingSite", amount: 4, color:"#db19ff", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "访问了浪费大量时间的网站. +4风险";
	}, lighterColor : "#eea8fb"},
	18 : {properName : "Suspected Hacker", name : "suspectedHacker", amount: 100, color:"#000000", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "的电脑使用了他人账号. 盗用他人账号风险高 +100风险";
	}, lighterColor : "#d8d8d8"},
	19 : {properName : "Outward Data Transfer", name : "sendingOutData", amount: 5, color:"#68b9ff", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "登了服务器将大于150MB的数据传到外网. 存在资料泄露风险. +5风险";
	}, lighterColor : "#afdaff"},
	20 : {properName : "Large Outward Data Transfer", name : "sentOver500MBofData", amount: 900, color:"#68b9ff", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "登了服务器将500MB以上的数据传到外网. 存在大的资料泄露风险. +900风险";
	}, lighterColor : "#afdaff"},
	21 : {properName : "Got to Work After 10", name : "late", amount: 5, color:"#a5c34a", getText : function(id,dateIn){
		return dateIn + " 员工" + id + "早上10点钟后打卡了. +5风险";
	}, lighterColor : "#d3ea8c"},
}

var rewards = {
	sentEmail : 15,
	loggedIn : 10,
	usedTCP : 5,
	internetAccess : 5
}
