// JavaScript Document

document.addEventListener('deviceready', function() 
{
		//alert('deviceready');
              FB.init({
                  		appId: '533839336729739',
                  		nativeInterface: CDV.FB,
                  		status     : true, // check login status
						cookie     : true, // enable cookies to allow the server to access the session
                  		useCachedDialogs: false,
						sharedSession:true
              });
              FB.getLoginStatus(handleStatusChange,true);
			  FB.logout(function (response) 
			  {
				  //alert('response:'+response);
                //window.location.reload();
              });
			
});			
function handleStatusChange(response) 
{
  if (response.authResponse) 
  {
	 //makeCall(response);
  } 
  else 
  {
    //alert('No Response');
  }
}
function userFriends(f_id)
{
	alert('entered');
	FB.api('/me/friends/'+f_id, function (response) 
	{
        if (response && !response.error) 
		{
            if (response.data.length == 0) 
			{
                    mutualfriends(f_id);
            }
            else 
			{
                  alert('friends');
            }
        }
    });

}
function mutualfriends(fri_id,i) 
{
    FB.api('/me/mutualfriends/' + fri_id, function (response) 
	{
        if (response && !response.error) 
		{
          alert('mutual friends:'+response.data.length);
		  //$('#matchID'+i).append('<span class="mutualFriends">'+response.data.length+'</span><img src="themes/images/FbFriends_InActive.png"/>');
		}
    }); 
}