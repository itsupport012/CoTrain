var config = {
				Appid : '8335',
				AuthKey : 'Y25WQf5Pqmw5CWj',
				AuthSec : 'rH3c9Qh5ZwKY67L'

};


var Owner = {
				qbID:window.sessionStorage.getItem("qbId"),
				user: window.sessionStorage.getItem("qbUser"),
				pass: window.sessionStorage.getItem("qbPass")
	
			};
					


var QBAPP = {
	appID: 8335,
	authKey: 'Y25WQf5Pqmw5CWj',
	authSecret: 'rH3c9Qh5ZwKY67L'
};

var CHAT = {
	roomJID: '8335_cotraingroup@muc.chat.quickblox.com',
	server: 'chat.quickblox.com',
	bosh: 'http://chat.quickblox.com:5280'
};

var FBAPP_ID = '368137086642884';

/* STUN/TURN servers */
var ICE_SERVERS = {
	urls: [
		'stun:stun.l.google.com:19302',
		'turn:turnserver.quickblox.com:3478?transport=udp',
		'turn:turnserver.quickblox.com:3478?transport=tcp'
	],
	username: 'user',
	password: 'user'
};