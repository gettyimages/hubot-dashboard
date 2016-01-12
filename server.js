module.exports = function(robot) {
    var express = require('express')
    var app = express()
    var server = require('http').Server(app);
    var io = require('socket.io')(server);
    var jade = require('jade')

    //Going to add a logging interceptor
    var infoLogger = robot.logger.info
    console.log("Logger Details" + infoLogger)
    robot.logger.info = function(message) {
        console.log(message)
        io.emit('newLogUpdate',message)
        infoLogger(message)
    }
    
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set("view options", { layout: false });
    app.use(express.static(__dirname + '/public'));

    app.get('/', function(req, res){
        res.render('home.jade', { testval: "yes please" });
    });

    server.listen(3000);

    io.on('connection', function (socket) {
        robot.logger.info("new connection")
        socket.emit('connected')
    });
}