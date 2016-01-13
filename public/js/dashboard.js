$(document).ready(function(){ 
  var socket = io();
  
  socket.on('connected',function(data) {
    $('#log').val($('#log').val() + "Connected: " + data)
  })
  
  socket.on('logupdate',function(data) {
    $('#log').val($('#log').val() + data)
  })
})
