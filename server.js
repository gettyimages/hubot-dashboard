module.export = function(robot) {
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

    io.on('connection', function (socket) {
        console.log(new Date() + "New Connection from client")
        socket.emit('connected')
    });
    
    //Going to add a logging interceptor
    var originalLogger = robot.log
    robot.log = function(message) {
        io.emit('newLogUpdate',message)
        originalLogger(message)    
    }
}