module.exports = function(robot) {
  var os = require('os')    
  var express = require('express')
  var app = express()
  var server = require('http').Server(app)
  var io = require('socket.io')(server)
  var jade = require('jade')
  var process = require('process')
  var toArray = require('lodash.toarray')
  var moment = require('moment')

  function GetPlatformDetails() {
    return os.platform() + " " + os.release()
  }
  
  function GetTotalMemory() {
    const KB = 1024
    const MB = KB * 1024
    const GB = MB * 1024
    
    var totalBytes = os.totalmem()
    
    if(totalBytes > GB) {
      return (totalBytes / GB).toFixed(2) + " GB"
    } else if(totalBytes >= MB) {
      return (totalBytes / MB).toFixed(2) + " MB"
    } else if(totalBytes >= KB) {
      return (totalBytes / KB).toFixed(2) + " KB"
    } else {
      return totalBytes + " bytes"
    }
  }

  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set("view options", { layout: false });
  app.use(express.static(__dirname + '/public'));

  app.get('/', function(req, res){
      res.render('home.jade');
  });
  
  var viewers = 0
  
  //This is what allows us to intercept stdout
  process.stdout.write = (function(write) {
    return function(string, encoding, fd) {
      io.emit('logupdate',string)
      var args = toArray(arguments);
      write.apply(process.stdout, args);
    };
    }(process.stdout.write));
          
  server.listen(3000);
  
  //When someone connects
  io.on('connection', function (socket) {
      viewers = viewers + 1
      socket.emit('connected',"welcome!\n")
      socket.emit('totalmem',GetTotalMemory())
      socket.emit('platform',GetPlatformDetails())
      socket.on('disconnect', function() {
        viewers = viewers - 1
      })
  });
  
  //Pump stats details every 5 seconds
  setInterval(function() {
    io.emit('freemem', (100*(1 - os.freemem() / os.totalmem())).toFixed(2) + " %")
    io.emit('uptime', moment.duration(os.uptime(),'seconds').humanize())
    io.emit('viewers', viewers)
  },5000)
}