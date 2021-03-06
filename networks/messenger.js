var stream = require('stream');

module.exports = {connect: function(credentials, readyCallback, messageCallback){
	var login = require('facebook-chat-api');

	login(credentials, function callback(err, api){
		if(err) return console.error(err);

		// Workaround to make a needlessly required argument optional again
		var native_sendTypingIndicator = api.sendTypingIndicator;
		api.sendTypingIndicator = function(thread_id, callback){
			if(!callback)
				callback = function(){};
			native_sendTypingIndicator(thread_id, callback);
		};

		api.type = "messenger";
		readyCallback(api);

		api.listen(function(err, message){
			if(err) return console.error(err);
			message.body = message.body || "";
			message.thread_id = message.threadID;
			console.log(message);

			if(message.isGroup === false)
				message.isAddressed = 2; // This is a PM

			var reply = function(text, callback){
				if(typeof text === "string")
					console.log("Responding to", message.thread_id, text);
				else{
					console.log("Responding to", message.thread_id, "with an attachment");

					// facebook-chat-api has the weirdest way of testing streams
					if(text.attachment
					&& text.attachment instanceof stream.Stream
					&& (typeof text.attachment._read !== 'Function'
					 || typeof text.attachment._readableState !== 'Object')){
						text.attachment._read = function(){};
						text.attachment._readableState = {};
					}
				}

				try{
					api.sendMessage(text, message.thread_id, callback);
				}catch(e){
					if(typeof callback === 'function')
						callback(e);
				}
			};

			messageCallback(reply, message, api);
		});
	});
}};
