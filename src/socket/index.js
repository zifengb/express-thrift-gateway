exports.Emitters = [
	{
		eventName: 'hello',
		data: {
			info: 'hello from node server'
		}
	},
]

exports.Listeners = [
	{
		eventName: 'disconnect',
		handler: function(data, callback) {
			console.log('the websocket connection is disconnected')
		}
	},
	{
		eventName: 'listener',
		handler: function(data, callback) {
			console.log(data)
		}
	}
]