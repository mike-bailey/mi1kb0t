var request = require('request');

module.exports = {listeners: [
{
	type: "startsWith",
	query: ".chuck",
	callback: function(reply, message){
		var arr = message.toString().split(" ");
		function apicnd(firstname,lastname) {
	        url = "http://api.icndb.com/jokes/random?firstName=Memey&lastName=Memelordz";
	        console.log(url);
	        result = request(url, function(err, res, body){
	                if (!err && res.statusCode == 200) {
	                        reply(JSON.parse(body)["value"]["joke"].replace("Memey Memelordz",message.body.replace(".chuck","")));
	                }
		})
	        }
		apicnd(arr[0],arr[1]);
		}
}, {
        type: "startsWith",
        query: ".pf",
        callback: function(reply, message){
	url = "http://api.srct.gmu.edu/pf/v1/basic/all/"+message.body.replace('.pf ','').replace(' ','+');
	console.log(url);
	result = request(url, function(err, res, body){
		if (!err && res.statusCode == 200) {
			console.log(body);
			response = JSON.parse(body)["results"];
			console.log(response);
			reply(JSON.stringify(response).replace(/["]/g,'').replace(/[[]/g,"").replace(/[]]/g,"").replace("]","").replace(/[}]/g,"").replace(/[{]/g,"\n"));
		}
	})
	}
}
]};
