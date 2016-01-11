var express = require('express')
var app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);
var jade = require('jade')

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", { layout: false });
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('home.jade');
});

server.listen(3000);

var connectedClientSockets = []

var lastSensorCollection = {}

io.on('connection', function (socket) {
    console.log(new Date() + "New Connection from client")
    socket.emit('connected')
    connectedClientSockets.push(socket);
    
    socket.on('sensorReply', function (data) {
        console.log('recieved data: ' + JSON.stringify(data))
        lastSensorCollection = data
    })
});

function CollectSensors() {
    console.log(new Date() + 'Heart beating sensor collection')
    connectedClientSockets.forEach(function(element) {
        element.emit('getSensors');
    })
}

//Lets emit sensor collection every 3 seconds
setInterval(CollectSensors,3000)

app.get('/api/sensors',function(req,res) {
    res.send(JSON.stringify(lastSensorCollection))
});
    


