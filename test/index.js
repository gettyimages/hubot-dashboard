var expect = require('chai').expect
var server = require('../')
var mockRobot = require('hubot-mock-robot')

describe('Logging interception',function() {
    
    it('should intercept logging',function() {
        expect(true).to.be.false
    })
    
    it('should allow the log to go to stdout', function() {
        expect(true).to.be.false
    })
})