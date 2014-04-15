
var userId;
var fbUserName;
	
var run_id;
var work_id;
var cyl_id;
var run_level;
var work_level;
var cyl_level;

var sportsConfigArr = new Array();
var latlongArr = new Array();
var sport_sel;
 var pushNotification;
$(document).ready("mobileinit",function(){
			 // Make your jQuery Mobile framework configuration changes here!
			$.mobile.defaultPageTransition="none";
			$.mobile.defaultDialogTransition = 'none';
			$.mobile.allowCrossDomainPages = true;
			$.mobile.transitionFallbacks.slideout = "none";
			$.mobile.ajaxLinksEnabled = false; 
			
});

		// ********************  To check the network state of a device ********************
function checkNetwork()
{
	var networkState = navigator.connection.type;
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.NONE]     = 'No network connection';
		
		if((states[networkState] == "No network connection") || (states[networkState] == "Unknown connection"))
		{
			alert("Your Deviceâ Internet connection is not working. Please check and relaunch app.");
		}
}
$(function()
{
	userId = localStorage.getItem("cotrain");
	if(userId)
	{
	$(".buttonBg").append('Sign In With Facebook');
	}
	else
	{
		$(".buttonBg").append('Sign Up With Facebook');
	}
// Create overlay and append to body:
    $('<div id="overlay"/>').css({
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: $(window).height() + 'px',
        background: '#CCC url(themes/images/ajax-loader.gif) no-repeat center'
    }).hide().appendTo('body');
});
// AUTHENTICATION of a user 
function promptLogin() 
{
	
	checkNetwork();
	userId = localStorage.getItem("cotrain");
	//QBUserId = window.localStorage.getItem("QB_id");
		//// If user Id is available in local storage call the Service below.
	if(userId)
	{
		$.ajax({
                 type: "GET",
                 url: coTrainTestAPIURL + "GetSportDetailsByUser?uid="+userId,
                 processData: false,
                 contentType: "application/json; charset=utf-8",
                 dataType: "jsonp",
				 beforeSend: function(){$('#overlay').show();},
				 async:false,
                 success: function (data) 
				 {
					 if(data != 0)
					 {
						 $('#overlay').hide();
						 window.location = "Slider.html"; 
					 }
					 else
					 {
						 $('#overlay').hide();
						 $.mobile.changePage("#SportsPage",{ showLoadMsg: false });
					 	 events();
					 }
                 },
                error: function (result) 
				{
                       //alert("GetSportDetailsByUser Error: " + result.status + ' ' + result.statusText);
                }
       	});
		
		$.ajax({
					type: "GET",
					url: coTrainTestAPIURL + "GetGroupsByUser?uid="+userId,
					processData: false,
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					beforeSend: function(){$('#overlay').show();},
					async:false,
					success: function(data) 
					{
						//alert('groups:'+data.length);
						window.localStorage.setItem("GroupDetails",JSON.stringify(data));
					}
			});
	
	}
	else
	{
			//******	connect with facebook authentication	*****
		init();
	}
	
}
function init()
{
	document.addEventListener('deviceready', function() 
	{
		navigator.splashscreen.hide();
		
              FB.init({
                  		appId: '533839336729739',
                  		nativeInterface: CDV.FB,
                  		status     : true, // check login status
						cookie     : true, // enable cookies to allow the server to access the session
                  		useCachedDialogs: false,
						sharedSession:true
              });
             FB.getLoginStatus(function(response)
             {
                              // CHECK THE LOGIN STATUS OF A USER HERE
                    FB.login(function (response) 
			 		{
						if (!response || response.error) 
						{
							handleGenericError(response.error);
						} 
						else 
						{
					 		updateUserInfo(response);
						}
					}, {scope:'email'});
                
            });
			
   	});
}



var loc;
var quickId;
var isUserExists;

function handleGenericError(e) 
{
	alert("Error ..."+JSON.stringify(e));
}
		// *********** GET THE USER DETAILS OF A USER FROM FACEBOOK *************
function updateUserInfo(response)
{
	$('#overlay').show();
	FB.api('/me',function(me) {
		   var uid = "http://graph.facebook.com/" + me.id + "/picture";
                   
		fbUserName = me.name;
		if(me.location != undefined)
		{
			loc = me.location.name;
		}
		else
		{
			loc = null;
		}
		if(me.gender == 'male')
		{
			gen = 'M';
		}
		else if(me.gender == 'female')
		{
			gen = 'F';
		}
		// *********** CHECK USER DETAILS OF A USER IN DATABASE ALREADY EXISTS OR NOT *************
			$.ajax({
                    type: "GET",
                    url: coTrainTestAPIURL + "IsUserExists?fid="+me.id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    processData: false,
					beforeSend: function(){$('#overlay').show();},
					async:false,
                    success: function (data) 
					{
						isUserExists = data;
						//alert('isUserExists:'+isUserExists);
							if(isUserExists)
							{
								
												var userDetails = { "FacebookID":me.id,"FullName":me.name,"PhotoURL":uid,"Email":me.email,"Gender":gen,"Location":loc,"DateOfBirth":me.birthday,"QuickbloxUserID":0,"QuickboxUsername":me.id,"QuickbloxPassword":'cotrain1234' };
												$.ajax({
														type: "POST",
														url: coTrainTestAPIURL + "SaveUserDetails",
														data: JSON.stringify(userDetails),
														contentType: "application/json; charset=utf-8",
														dataType: "json",
														processData: false,
														async:false,
														success: function (data) 
														{
															$('#overlay').hide();
															userId = data;
															window.localStorage.setItem("cotrain", userId);
															window.localStorage.setItem("cotrain"+userId, fbUserName);
															$.mobile.changePage("#SportsPage",{ showLoadMsg: true });
															events();
															$("#userName").append("Hello,"+fbUserName+"!  ");
														},
														error: function (result) 
														{
																	// alert("SaveUserDetails Error:  " + result.status + '   ' + result.statusText);
														}
													});
							}
							else
							{
							 params = {
										full_name:me.name,
										email: me.email,
										login: me.id,
										password: 'cotrain1234'
									 };
					// ***********CREATE SESSION IN QUICKBLOX SITE *************
							QB.init(config.Appid, config.AuthKey, config.AuthSec);
							// alert('QB init success');
							QB.createSession(function(err, result) 
							{
								if (err) 
								{
									//alert('QB Create Session If:'+err.detail);
								} 
								else 
								{
									//alert('QB Create Session else:'+result.detail);
									// *********** REGISTER USER IN QUICKBLOX SITE *************
									QB.users.create(params,function(err, result) 
									{
										if (err) 
										{
											//alert('quick Create user IF:'+err.detail);
										} 
										else 
										{
											
												window.localStorage.setItem("QB_Token",result.token);
												window.localStorage.setItem("QB_id",result.id);
												//alert('result:'+result.id);
												quickId = result.id;
												var userDetails = { "FacebookID":me.id,"FullName":me.name,"PhotoURL":uid,"Email":me.email,"Gender":gen,"Location":loc,"DateOfBirth":me.birthday,"QuickbloxUserID":quickId,"QuickboxUsername":me.id,"QuickbloxPassword":'cotrain1234' };
							
												//alert(JSON.stringify(userDetails));
												$.ajax({
														type: "POST",
														url: coTrainTestAPIURL + "SaveUserDetails",
														data: JSON.stringify(userDetails),
														contentType: "application/json; charset=utf-8",
														dataType: "json",
														processData: false,
														beforeSend: function(){$('#overlay').show();},
														//complete: function(){$.mobile.loading('hide');},
														async:false,
														success: function (data) 
														{
															$('#overlay').hide();
															userId = data;
															window.localStorage.setItem("cotrain", userId);
															window.localStorage.setItem("cotrain"+userId, fbUserName);
															$.mobile.changePage("#SportsPage",{ showLoadMsg: true });
															events();
															$("#userName").append("Hello,"+fbUserName+"!  ");
														},
														error: function (result) {
																	// alert("SaveUserDetails Error:  " + result.status + '   ' + result.statusText);
														}
													});
										
											}
									});
								}
							});
							}
						}
			});
		
	});
}

function events()
{
	$("#run").hide();
	$("#workout").hide();
	$("#cycle").hide();
}
	// *********** SPORT SELECT IN SPORTPAGE*************
$("#run_p").click(function(){
			run_id = 2;
			$("#run_p").css('display', 'none');
			$("#run").show();
});
	
$("#workout_p").click(function(){
			work_id = 3;
			$("#workout_p").css('display', 'none');
			$("#workout").show();
});
$("#cycle_p").click(function(){
			cyl_id = 5;
			$("#cycle_p").css('display', 'none');
			$("#cycle").show();
});
	// *********** SPORTS CONFIGING FOR RUN SPORT *************
	
$("#run_select").click(function(event){
			var r = event.target.id;
			run_level=selectRun(r);
			
});	
function selectRun(e)
{
		switch(e)
		{
			case "run_beg":
			{
				i=1;
				$("#run_type").empty();
				$("#run_beg,#run_intr,#run_adv,#run_prof").css( {"background":"gray","color":"gray" });
				$("#run_type").append('Beginner');
				$("#run_beg").css( {"background":"red","color":"red" });
			}
			break;
			case "run_intr":{
				i=2;
				$("#run_type").empty();
				$("#run_beg,#run_intr,#run_adv,#run_prof").css( {"background":"gray","color":"gray" });
				$("#run_type").append('Intermediate');
				$("#run_beg,#run_intr").css( {"background":"red","color":"red" });
				
			}break;
			case "run_adv":{
				i=3;
				$("#run_type").empty();
				$("#run_beg,#run_intr,#run_adv,#run_prof").css( {"background":"gray","color":"gray" });
				$("#run_type").append('Advanced');
				$("#run_beg,#run_intr,#run_adv").css( {"background":"red","color":"red" });
				
			}break;
			case "run_prof":{
				i=4;
				$("#run_type").empty();
				$("#run_beg,#run_intr,#run_adv,#run_prof").css( {"background":"gray","color":"gray" });
				$("#run_type").append('Professional');
				$("#run_beg,#run_intr,#run_adv,#run_prof").css( {"background":"red","color":"red" });
			}break;
		}
		return i;
}
// *********** SPORTS CONFIGING FOR WORKOUT SPORT *************
$("#work_select").click(function(event){
	
			var w = event.target.id;
			work_level = selectWork(w);
			
});	
function selectWork(e)
{
		switch(e)
		{
			case "work_beg":
			{
				i=1;
				$("#work_type").empty();
				$("#work_beg,#work_intr,#work_adv,#work_prof").css( {"background":"gray","color":"gray"  });
				$("#work_type").append('Beginner');
				$("#work_beg").css( {"background":"red","color":"red" });
			}
			break;
			case "work_intr":{
				i=2;
				$("#work_type").empty();
				$("#work_beg,#work_intr,#work_adv,#work_prof").css( {"background":"gray","color":"gray"  });
				$("#work_type").append('Intermediate');
				$("#work_beg,#work_intr").css( {"background":"red","color":"red" });
				
			}break;
			case "work_adv":{
				i=3;
				$("#work_type").empty();
				$("#work_beg,#work_intr,#work_adv,#work_prof").css( {"background":"gray","color":"gray"  });
				$("#work_type").append('Advanced');
				$("#work_beg,#work_intr,#work_adv").css( {"background":"red","color":"red" });
				
			}break;
			case "work_prof":{
				i=4;
				$("#work_type").empty();
				$("#work_beg,#work_intr,#work_adv,#work_prof").css( {"background":"gray","color":"gray"  });
				$("#work_type").append('Professional');
				$("#work_beg,#work_intr,#work_adv,#work_prof").css( {"background":"red","color":"red" });
			}break;
		}
		return i;
}
	// *********** SPORTS CONFIGING FOR CYCLE SPORT *************
$("#cyl_select").click(function(event){
			var c = event.target.id;
			cyl_level = selectCycle(c);
			
});	
function selectCycle(e)
{
		switch(e)
		{
			case "cyl_beg":
			{
				$("#cyl_type").empty();
				$("#cyl_beg,#cyl_intr,#cyl_adv,#cyl_prof").css({"background":"gray","color":"gray"  });
				$("#cyl_type").append('Beginner');
				i = 1;
				$("#cyl_beg").css( {"background":"red","color":"red" });
			}
			break;
			case "cyl_intr":{
				$("#cyl_type").empty();
				$("#cyl_beg,#cyl_intr,#cyl_adv,#cyl_prof").css({"background":"gray","color":"gray"  });
				$("#cyl_type").append('Intermediate');
				$("#cyl_beg,#cyl_intr").css( {"background":"red","color":"red" });
				i = 2;
				
			}break;
			case "cyl_adv":{
				$("#cyl_type").empty();
				$("#cyl_beg,#cyl_intr,#cyl_adv,#cyl_prof").css( {"background":"gray","color":"gray"  });
				$("#cyl_type").append('Advanced');
				$("#cyl_beg,#cyl_intr,#cyl_adv").css( {"background":"red","color":"red" });
				i = 3;
				
			}break;
			case "cyl_prof":{
				$("#cyl_type").empty();
				$("#cyl_beg,#cyl_intr,#cyl_adv,#cyl_prof").css( {"background":"gray","color":"gray"  });
				$("#cyl_type").append('Professional');
				$("#cyl_beg,#cyl_intr,#cyl_adv,#cyl_prof").css( {"background":"red","color":"red" });
				i = 4;
			}break;
		}
		return i;
}
		// *********** SPORTS CONFIGING FOR LOCATION MAPS*************
$("#run_mapSelect,#work_mapSelect,#cyl_mapSelect").click(function(event)
{ 
		event.preventDefault(); 
		sport_sel = event.target.id;
		document.getElementById('searchLoc').value = '';
		$.mobile.changePage("#mapPage",{transition: "none",showLoadMsg: false});
		maps();
});

var latitude,longitude;
function maps()
{
	document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() 
	{
		//	TO GET THE CURRENT POSITION OF A USER............
       navigator.geolocation.getCurrentPosition(onSuccess,onError);
    }
	
}
function onError(error)
{
	onSuccess();
}
	
function onSuccess(position) 
{
		
  	if(position == undefined)
	{
		var latlng = new google.maps.LatLng (12.9667, 77.5667);
	}
	else
	{
		latitude = position.coords.latitude;
  		longitude = position.coords.longitude;
		var latlng = new google.maps.LatLng (latitude, longitude);	
	}
  mapOptions = { 
    				zoom : 14, 
    				center : latlng, 
    				mapTypeId : google.maps.MapTypeId.ROADMAP 
  				};
	var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
	var marker = new google.maps.Marker({
                     position: latlng,
                     map: map,
                     title:"Current Location!"
                     })
		//get the location and stored in variables
  		var firstLocation =(document.getElementById('searchLoc'));
			//use to provide user some  prediction of value based on earlier typed values 
		var autocomplete = new google.maps.places.Autocomplete(firstLocation);
  			autocomplete.bindTo('bounds', map);
		var infowindow = new google.maps.InfoWindow();
			//	**************  ON MAP CLICK GET THE LATITUDE AND LONGITUDE **********
		google.maps.event.addListener(map, 'click', function (event)
		{
		 	addMarker(event.latLng);
	      	var latl = event.latLng.toString();
    	  	s = latl.slice(1, latl.length - 1);
     	  	var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + s + "&sensor=false";
      		$.getJSON(url, function (data) 
	  		{
		  		var adress = data.results[0].address_components;
				var selectedAddress = '';
				var count=0;
				for (var i = 0; i < adress.length; i++) 
				{
              		if (adress[i].types[0] == "sublocality") 
					{
						if(count == 0)
						{
							var sublocality = adress[i].long_name;
                  			selectedAddress = selectedAddress.concat(sublocality);
							count++;
						}
              		}
              		if (adress[i].types[0] == "locality") 
					{
                  		var locality = ", "+ adress[i].long_name;
                  		selectedAddress = selectedAddress.concat(locality);
              		}
				}
				address = selectedAddress;
				infowindow.setContent('<div><strong>' + adress[2].long_name + '</strong><br>' + address);
				infowindow.close();
      			infowindow.open(map,marker);
		    });
  		});
		//	**************  AUTOCOMPLATE OF A PLACE SEARCH IN MAPS **********
		google.maps.event.addListener(autocomplete, 'place_changed', function () 
		{
      			var place = autocomplete.getPlace();
				addMarker(place.geometry.location);
				var adress = place.address_components;
				var selectedAddress = '';
				var count=0;
				for (var i = 0; i < adress.length; i++) 
				{
              		if (adress[i].types[0] == "sublocality") 
					{
                  		if(count == 0)
						{
							var sublocality = adress[i].long_name;
                  			selectedAddress = selectedAddress.concat(sublocality);
							count++;
						}
              		}
              		if (adress[i].types[0] == "locality") 
					{
                  		var locality = ", "+ adress[i].long_name;
                  		selectedAddress = selectedAddress.concat(locality);
              		}
				}
				address = selectedAddress;
				infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
      			infowindow.close();
      			infowindow.open(map,marker);
		});
		 //	**************  ON MAP CREATE A MARKER FOR ADDRESS **********
	function addMarker(location) 
	{
		latitude = 0 ;
		longitude = 0 ;
		 var latl = location.toString();
		  s = latl.slice(1, latl.length - 1);
		  var loc = s.split(',');
		  latitude = loc[0];
		  longitude = loc[1];
		  var latLong = {"id":sport_sel,"lat":latitude,"long":longitude}
		  latlongArr.push(latLong);
		marker = new google.maps.Marker({
											position: location,
											map: map,
											visible: true
										});
		marker.setVisible(false);
	}			


}
	//	**************  TO SHOW THE SELECTED ADDRESS IN SPORTPAGE  **********
function showAddress()
{
	switch(sport_sel)
	{
			case "run_mapSelect":
			{
				$("#run_mapSelect").empty();
				$("#run_mapSelect").append(address);
			}break;
			case "work_mapSelect":
			{
				$("#work_mapSelect").empty();
				$("#work_mapSelect").append(address);
			}break;
			case "cyl_mapSelect":
			{
				$("#cyl_mapSelect").empty();
				$("#cyl_mapSelect").append(address);
			}break;
	}
	$.mobile.changePage("#SportsPage",{transition: "none",showLoadMsg: false});
}
		
function goback()
{
	$.mobile.changePage("#SportsPage",{transition: "none",showLoadMsg: false});
}
var run_lat;
var run_long;
var work_lat;
var work_long;
var cyl_lat;
var cyl_long;
//	**************  SAVE THE SPORTS CONFIGRED IN THE DATABASE **********
function saveDetails()
{
	$('#overlay').show();
	for(var i=0;i<latlongArr.length;i++)
	{
		if(latlongArr[i].id == 'run_mapSelect')
		{
			run_lat = latlongArr[i].lat;
			run_long = latlongArr[i].long;
		}
		else if(latlongArr[i].id == 'work_mapSelect')
		{
			work_lat = latlongArr[i].lat;
			work_long = latlongArr[i].long;
		}
		else if(latlongArr[i].id == 'cyl_mapSelect')
		{
			cyl_lat = latlongArr[i].lat;
			cyl_long = latlongArr[i].long;
		}
	}

		//		****************  Run configuration details ****************//
	if(run_id)
	{
		var loc = document.getElementById('run_mapSelect').textContent;
		var runConfig = { "SportID": run_id, "SportLevelID": run_level, "Location":loc,"Latitude":run_lat,"Longitude":run_long};
		sportsConfigArr.push(runConfig);
	}
	//		****************  WorkOut configuration details ****************//
	if(work_id)
	{
		var loc1 = document.getElementById('work_mapSelect').textContent;
		var workConfig = { "SportID": work_id,"SportLevelID":work_level,"Location":loc1,"Latitude":work_lat,"Longitude":work_long};
		sportsConfigArr.push(workConfig);
	}
	//		****************  Cycle configuration details ****************//
	if(cyl_id)
	{
		var loc2 = document.getElementById('cyl_mapSelect').textContent;
		var cylConfig = { "SportID": cyl_id, "SportLevelID": cyl_level, "Location":loc2,"Latitude":cyl_lat,"Longitude":cyl_long};
		sportsConfigArr.push(cylConfig);
	}
	if(sportsConfigArr !=0)
	{
		var userSports = {"UserID": userId,"Sports": sportsConfigArr };
		//alert(JSON.stringify(userSports));
                $.ajax({
                    type: "POST",
                    url: coTrainTestAPIURL + "SubmitUserSportDetails",
                    data: JSON.stringify(userSports),
                    processData: false,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
					beforeSend: function(){$.mobile.loading('show',{text:'Loading',textVisible: true});},
				 	complete: function(){$.mobile.loading('hide');},
					async:false,
                    success: function (data) 
					{
						$('#overlay').hide();
						window.location = "Slider.html";
						sportsConfigArr = [ ];
                    },
                    error: function (result) 
					{
                        //alert("SubmitUserSportDetails Error:" + result.status+' '+result.statusText);
                    }
                });
	}
	else
	{
		alert('Sports not Configured');
	}
}
	

