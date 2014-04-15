//var coTrainTestAPIURL = "http://192.168.1.11/cotrain/cotrainservice.svc/rh/";
var coTrainTestAPIURL ="http://cotrain.talentpace.com/cotrainservice.svc/rh/";
var userMessageArr = new Array();
var groupMessageArr = new Array();

$(document).ready(function()
{
	//alert('qbchatservice');
		//	******* app Login User details	*****************//
	userID = localStorage.getItem("cotrain");
	fbUserName = localStorage.getItem("cotrain"+userID);
	
	var owner_qbId,owner_qbUser,owner_qbPass;
	$.ajax({
                 type: "GET",
                 url: coTrainTestAPIURL + "GetUserDetails?uid="+userID,
                 processData: false,
                 contentType: "application/json; charset=utf-8",
                 dataType: "jsonp",
				 async:false,
                 success: function (data) 
				 {
					 owner_qbId = data.QuickbloxUserID
					 owner_qbUser = data.QuickboxUsername;
					 owner_qbPass = data.QuickbloxPassword;
					 owner_photo = data.PhotoURL;
					//alert('owner:'+owner_qbId+'  and   '+owner_qbUser+'   and   '+owner_qbPass);
					 window.sessionStorage.setItem("qbId",owner_qbId);
					 window.sessionStorage.setItem("qbUser",owner_qbUser);
					 window.sessionStorage.setItem("qbPass",owner_qbPass);
					 window.sessionStorage.setItem("qbPhoto",owner_photo);
					 
				 }
	});
		GroupChatRoom = $.parseJSON( window.localStorage.getItem("GroupDetails"));
		//***************  Quickblox Initalization	*****************//
 	QB.init(config.Appid, config.AuthKey, config.AuthSec);
		//***************  Quickblox create Session	*****************//
 	QB.createSession({login: owner_qbUser, password: owner_qbPass}, function(error, response)
 	{
		if(error) 
		{
        	//console.log(error);
			//window.location.reload();
    	} 
		else 
		{
			//window.sessionStorage.setItem("QB-Token",response.token);
			 xmppConnection(); 
		}
	});
	
	function reConnect()
	{
		xmppConnection();	
	}
	function xmppConnection()
	{
		//alert(response.detail);
   		connection = new Strophe.Connection("http://chat.quickblox.com:5280");
		userJID = owner_qbId + "-" + config.Appid + "@" + "chat.quickblox.com";
		connection.connect(userJID, owner_qbPass, function (status) 
		{
			//alert(status);
			switch (status) 
			{
				case Strophe.Status.ERROR:
		  				//console.log('[Connection] Error');
						reConnect();
		  		break;
				case Strophe.Status.CONNECTING:
						//alert('[Connection] Connecting');
				break;
				case Strophe.Status.CONNFAIL:
		  				//console.log('[Connection] Failed to connect');
						//connectFailure();
						reConnect();
		  		break;
				case Strophe.Status.AUTHENTICATING:
		  				//alert('[Connection] Authenticating');
		  		break;
				case Strophe.Status.AUTHFAIL:
		  				//alert('[Connection] Unauthorized');
						reConnect();
						//connection.connect(userJID, owner_pass,reConnect);
		  		break;
				case Strophe.Status.CONNECTED:
		  				//alert('[Connection] Connected');
						$("#sendButton").show();
						
						//connection.muc.join("8335_testgroup@muc.chat.quickblox.com", String(owner_qbId),getMessage,getPresence,getRoster);
						
							GroupChatRoom = $.parseJSON( window.localStorage.getItem("GroupDetails"));
							//alert('group:'+GroupChatRoom);
							for(var i=0;i<GroupChatRoom.length;i++)
							{
								//alert(""+GroupChatRoom[i].QBChatRoomName+"@muc.chat.quickblox.com");
								roomJID = ""+GroupChatRoom[i].QBChatRoomName+"@muc.chat.quickblox.com";
								//alert('room:'+roomJID+'  and   '+String(owner_qbId));
								
								connection.muc.leave(roomJID, String(owner_qbId));
								 connection.flush();
							
							}
							for(var i=0;i<GroupChatRoom.length;i++)
							{
								//alert(""+GroupChatRoom[i].QBChatRoomName+"@muc.chat.quickblox.com");
								roomJID = ""+GroupChatRoom[i].QBChatRoomName+"@muc.chat.quickblox.com";
								//alert('room:'+roomJID+'  and   '+String(owner_qbId));
								connection.muc.join(roomJID, String(owner_qbId),getMessage,getPresence,getRoster);
							}
							subscriptions();
							//alert('handler 1');
						connection.addHandler(onMessage, null, 'message', null, null, null);
						//alert('add handler 2');
						//connection.addHandler(getMessage, null, 'message', 'chat', null, null);				
	      				
					
		  		break;
				case Strophe.Status.DISCONNECTED:
		  				//alert('[Connection] Disconnected');
						reConnect();
						 //connection.reset();
						$("#sendButton").hide();
		  		break;
				case Strophe.Status.DISCONNECTING:
		  				//console.log('[Connection] Disconnecting');
		  				
		  		break;
				case Strophe.Status.ATTACHED:
		  				//console.log('[Connection] Attached');
		  		break;
			}
		});
	}
	function subscriptions()
	{
		deviceplatform = window.localStorage.getItem("devicePlatform");
		udid =  window.localStorage.getItem("deviceUuid");
		client_token = window.localStorage.getItem("device_token");
		//alert(deviceplatform+'  \n\n  '+udid+'	\n	'+client_token);
		QB.init(config.Appid, config.AuthKey, config.AuthSec);
		QB.createSession({login: owner_qbUser, password: owner_qbPass}, function(err, result) 
		{
			if (err) 
			{
				console.log(err.detail);
				connectFailure();
			} 
			else {
					//alert(result.user_id+'  and  '+result.token);
								//	************  Quickblox push tokens  *********************
					push_token_params = {	environment: "production", 
											client_identification_sequence: client_token,
											platform: deviceplatform,
											udid: udid
										}
						QB.messages.tokens.create(push_token_params,function(err,result)
						{
							//alert('push log:'+result);
							//alert('push error:'+err.detail);
						});
						//	************  Quickblox subscriptions   *********************
						sub_params = {	notification_channels:"gcm"								
									 }
							QB.messages.subscriptions.create(sub_params,function(err,result)
							{
								//alert('sub log:'+result);
								//alert('sub error:'+err.detail);
							});
				 }
		});
				
	}
		//********************	Message fron sender	*********************//
		var groupArr =new Array();
		
	function onMessage(msg) 
	{
		//alert('onMessage:'+msg);
  		var date = new Date();
		var time = date.getHours()+':'+date.getMinutes();
    	var msgElement = msg.getElementsByTagName('body');
		fromId = msg.getAttribute('from').split('-');
		to = msg.getAttribute('to').split('-');
		var type = msg.getAttribute('type');
		from_img = msg.getAttribute('img');
		var name ;
		var from_msg = msgElement[0].textContent;
		//alert('type:'+type);
		//alert('from message:'+type+'\n'+fromId[0]+'\n '+to[0]);
		if(type == "privateChat")
		{
			//alert('one to one');
					QB.users.listUsers(function(err, response)
					{
						for (var i=0; i < response.items.length; i++) 
						{
							if(response.items[i].user.id.toString() == fromId[0])
							{
								fromName = response.items[i].user.full_name;
								CoTRAINDB.transaction(function (t) 
								{
									t.executeSql("SELECT * FROM privateChat WHERE FromUserid ="+fromId[0], [], function (t, results) 
									{
													//alert(results.rows.length + "rows")
										if(results.rows.length > 0)
										{
											t.executeSql("UPDATE privateChat set ChatMessage = "+from_msg+",MsgDateTime = "+time+" where FromUserid="+fromId[0]); 
										}
										else
										{
											t.executeSql("INSERT INTO privateChat(FromUserid,FromUserName,FromUserPhoto,ChatMessage,MsgDateTime) VALUES (?,?,?,?,?)",[fromId[0],fromName,from_img,from_msg,time]);
										}
										$(".messages").empty();
										$(".messages").append('<img src="themes/images/Messages.png"/><span id="msgCount"></span>');
									});
   								});
								
							}
						}
						
					});
		}
		else if(type == "groupchat")
		{
			//alert('group');
			groupArr.push(fromId[0]);
			
				GroupChatRoom = $.parseJSON( window.localStorage.getItem("GroupDetails"));
				for(var i=0;i<GroupChatRoom.length;i++)
				{
					//alert(""+GroupChatRoom[i].QBChatRoomName+"@muc.chat.quickblox.com");
					roomJID = ""+GroupChatRoom[i].QBChatRoomName+"@muc.chat.quickblox.com";
					from = fromId[0].split('/');
					if(roomJID == from[0])
					{
						
					}
				}
				//alert('groupMessageArr:'+groupMessageArr.length+'\n'+'groupArr:'+groupArr.length);
				
				if(groupMessageArr.length>=1)
				{
					
					
					$(".messages").empty();
					$(".messages").append('<img src="themes/images/Messages.png"/>');
					window.localStorage.setItem("groupMessages",JSON.stringify(groupMessageArr));
				}
		
		}
  			// we must return true to keep the handler alive.  
  			// returning false would remove it after it finishes.
  		return true;
	} 
	
});
