var CoTRAINDB;

$(document).ready(function(e) 
{
	
	    if (!window.openDatabase) 
		{
	        alert('Databases are not supported in this browser.');
	    } 
		else {
	        var shortName = 'CoTRAINDB';
	        var version = '1.0';
	        var displayName = 'CoTRAIN Database';
	        var maxSize = 5242880; //  bytes
	        CoTRAINDB = window.openDatabase(shortName, version, displayName, maxSize);//create database 
			createTables();
			//CoTRAINDB.transaction(createTables);
	    }
		
});

	//******************** create a table in local database	*********************//
function createTables() 
{
	//DB.executeSql('DROP TABLE IF EXISTS userMessages');
	var sql1 = "CREATE TABLE IF NOT EXISTS privateChatNotify( id INTEGER PRIMARY KEY AUTOINCREMENT,FromUserid INTEGER(10),LastMsgDateTime DATETIME)";
	
		var sql = "CREATE TABLE IF NOT EXISTS privateChat( id INTEGER PRIMARY KEY AUTOINCREMENT,FromUserid INTEGER(10),FromUserName VARCHAR(200),FromUserPhoto BLOB,ChatMessage VARCHAR(1000),MsgDateTime DATETIME)";
		CoTRAINDB.transaction(function(tx)
		{
				tx.executeSql(sql,[],function (tx, results) 
				{
					
				},function(tx, error){
				 
			    });
			  tx.executeSql(sql1,[],function (tx, results) 
				{
					
				},function(tx, error){
				 
			  });
		});
    
	
	
	
	//var sql1 = "CREATE TABLE IF NOT EXISTS groupChat( id INTEGER PRIMARY KEY AUTOINCREMENT,fromUserid INTEGER(10),fromUserName VARCHAR(50),fromUserPhoto BLOB,Message VARCHAR(50),dateTime DATETIME)";
		
   // DB.executeSql(sql1);
	
}
