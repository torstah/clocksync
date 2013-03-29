
var express = require("express");
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server, { log: true });
var beat = 0;

app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.static(__dirname + '/'));
});


/* simulate network delays using normal distribution */
function rnd_snd() {
	return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
}
function rnd(mean, stdev) {
	return Math.round(rnd_snd()*stdev+mean);
}
function fakeNetworkDelay() {
	return Math.max(200, rnd(1000, 400));
}

app.post('/sync', function(req, res) {
	var m = req.body;
	m.serverLocalTime = +new Date();
	res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(m));
});

server.listen(8000);

io.sockets.on('connection', function (socket) {
	console.log('Konnekted!');

    socket.on('disconnect', function(){
       console.log('disconnect');
	});

	setInterval(function() {
		if (beat == 4){
			beat = 0;
		}
	
		socket.emit('sendbeat', { beatnumber: beat });
		console.log(beat);
		beat++


	}, 1000);

	
	
});
console.log('Server running');