// JavaScript Document

//window.onload = notificationUnregister;
//window.onunload = notificationRegister;
var pushNotification;

$(function() 
{
	document.addEventListener("deviceready", onDeviceReady, false); 
    //document.addEventListener("resume", onResume, false); 
    document.addEventListener("pause", onPause, false);

});
function onDeviceReady() 
{ 
		devicePlatform = device.platform;
		deviceUuid=device.uuid;
		//alert(devicePlatform+'  and   '+deviceUuid);
		
		window.localStorage.setItem("devicePlatform",devicePlatform);
		window.localStorage.setItem("deviceUuid",deviceUuid);
		
		 pushNotification = window.plugins.pushNotification;
     	pushNotification.unregister(successHandler, errorHandler);
} 

function onPause() 
{ 
     	try 
		{ 
			   pushNotification = window.plugins.pushNotification;
			   if (device.platform == 'android' || device.platform == 'Android')
				{
					pushNotification.register(successHandler, errorHandler, {"senderID":"600189233901","ecb":"onNotificationGCM"});				// required!
				}
				else 
				{
					pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});	// required!
				}
		}
		catch(err) 
		{  
			alert("pushNotification Error description:" + err.message + ""); 
		} 
} 


// result contains any message sent from the plugin call
function successHandler (result)
{
    //alert('result = ' + result);
}
// result contains any error description text returned from the plugin call
function errorHandler (error)
{
    alert('error = ' + error);
}
function tokenHandler (result)
{
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    //alert('device token = ' + result);
	window.localStorage.setItem("device_token",result);
}
// iOS
function onNotificationAPN (event)
{
    if ( event.alert )
    {
        navigator.notification.alert(event.alert);
    }
    
    if ( event.sound )
    {
        var snd = new Media(event.sound);
        snd.play();
    }
    
    if ( event.badge )
    {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
}

// Android
function onNotificationGCM(e) 
{
	//alert('push notification');
  		 switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    //console.log("Regid " + e.regid);
                   // alert('registration id = '+e.regid);
					window.localStorage.setItem("device_token",e.regid);
                }
            break;
 
            case 'message':
              				// this is the actual push notification. its format depends on the data model from the push server
             				 //alert('message = '+e.message+' msgcnt = '+e.msgcnt);
							 //window.localStorage.setItem("fromMessage",e.message);
            break;
 
            case 'error':
              alert('GCM error = '+e.msg);
            break;
 
            default:
              alert('An unknown GCM event has occurred');
              break;
        }
}
