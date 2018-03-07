var canvas, ctx, color = "#000";  

document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() {
    newCanvas();
  }, 1000);
}, false);

function newCanvas(){
  canvas = document.getElementById("canvas"); 
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 100;

  ctx = canvas.getContext("2d");

  ctx.strokeStyle = color;
  ctx.lineWidth = 5;  
  
  drawTouch();
  drawMouse();
}

var drawTouch = function() {
  var start = function(e) {
    ctx.beginPath();
    x = e.changedTouches[0].pageX;
    y = e.changedTouches[0].pageY - canvas.offsetTop;
    ctx.moveTo(x,y);
  };

  var move = function(e) {
    e.preventDefault();
    x = e.changedTouches[0].pageX;
    y = e.changedTouches[0].pageY - canvas.offsetTop;
    ctx.lineTo(x,y);
    ctx.stroke();
  };

  document.getElementById("canvas").addEventListener("touchstart", start, false);
  document.getElementById("canvas").addEventListener("touchmove", move, false);
};       


var drawMouse = function() {
  var clicked = 0;

  var start = function(e) {
    clicked = 1;
    ctx.beginPath();
    x = e.pageX;
    y = e.pageY - canvas.offsetTop;
    ctx.moveTo(x,y);
  };

  var move = function(e) {
    if(clicked) {
      x = e.pageX;
      y = e.pageY - canvas.offsetTop;
      ctx.lineTo(x,y);
      ctx.stroke();
    }
  };

  var stop = function(e) {
    clicked = 0;
  };

  document.getElementById("canvas").addEventListener("mousedown", start, false);
  document.getElementById("canvas").addEventListener("mousemove", move, false);
  document.addEventListener("mouseup", stop, false);
};
