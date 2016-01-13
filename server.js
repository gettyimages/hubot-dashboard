module.exports = function(robot) {
  var os = require('os')    
  var express = require('express')
  var app = express()
  var server = require('http').Server(app)
  var io = require('socket.io')(server)
  var jade = require('jade')
  var process = require('process')
  var toArray = require('lodash.toarray')

  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set("view options", { layout: false });
  app.use(express.static(__dirname + '/public'));

  app.get('/', function(req, res){
      res.render('home.jade');
  });
  
  var old_std_out = process.stdout.write
  
  process.stdout.write = (function(write) {
    return function(string, encoding, fd) {
      io.emit('logupdate',string)
      var args = toArray(arguments);
      write.apply(process.stdout, args);
    };
    }(process.stdout.write));
          
  server.listen(3000);
  
  io.on('connection', function (socket) {
      socket.emit('connected',"welcome!\n")
      socket.emit('totalmem',os.totalmem())
  });
  
  setInterval(function() {
    io.emit('freemem',os.freemem())
    io.emit('uptime', os.uptime())
  },5000)
}