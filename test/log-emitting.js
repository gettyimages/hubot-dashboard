var expect = require('chai').expect
var mockRobot = require('mock-hubot-robot')
var client = require('socket.io-client')

describe('Logging interception',function() {
    var server = require('../server.js')
    var robotCtx = mockRobot()
    var socket;
    
    before(function(done) { 
       //Unhooks the 2000 ms default timeout in Mocha
       this.timeout(0)
       //Starts Server
       server(robotCtx)
       
       //Connects our client
       socket = client.connect("http://localhost:3000")
       
       //Waits for connection before continuing
       socket.on('connected',function() {
           done()
       })
    })
    
    it('should emit logging',function(done) {   
      socket.on('newLogUpdate',function(data) {
          expect(data).to.be.equal("test")
          done()
      })
      
      //fires a logging message
      robotCtx.logger.info('test')
    })
    
    it('should allow the log to continue to the standard robot logger', function() {
        var itemsLogged = robotCtx.getLogItems().info
        expect(itemsLogged).not.to.be.null
        expect(itemsLogged.length).to.be.equal(2)
        expect(itemsLogged).to.contain("test")
    })
})