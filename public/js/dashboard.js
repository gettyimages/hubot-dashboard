$(document).ready(function(){ 
  var socket = io();
  
  socket.on('connected',function(data) {
    $('#log').val($('#log').val() + "Connected: " + data)
  })
  
  socket.on('logupdate',function(data) {
    $('#log').val($('#log').val() + data)
  })
  
  socket.on('freemem',function(data) {
    $('#freemem').text(data)
  })
  
  socket.on('totalmem',function(data) {
    $('#totalmem').text(data)
  })
  
  socket.on('uptime',function(data) {
    $('#uptime').text(data)
  })
  
  socket.on('viewers', function(data) {
    $('#viewers').text(data)
  })
  
  socket.on('platform', function(data) {
    $('#platform').text(data)
  })
})
