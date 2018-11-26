let body = document.querySelector('body');
let canvas = document.querySelector('canvas');
const HEIGHT = window.innerHeight;
const WIDTH = window.innerWidth;
let mapImg;
let ww = canvas.width = 1024;
let hh = canvas.height = 512;
//-347 194 -72 197
let ctx = canvas.getContext('2d');
ctx.translate(ww/2, hh/2);
let data;
let earthquakes = [];
//Center latitude & longitude center is w/2, h/2
let clat = 0;
let clon = 0;

//Shangai 31.2304 N, 121.4737 E
let lat;
let lon;
let zoom = 1;

let centerX = mercX(clon);
let centerY = mercY(clat);

let x = mercX(lon) - centerX;
let y = mercY(lat) - centerY;

window.onload = function(){
  mapImg = document.createElement('img');
  mapImg.setAttribute('src', 'https://api.mapbox.com/styles/v1/mapbox/light-v9/static/' +
  clon + ',' + clat + ',' + zoom + '/' +
  ww + 'x' + hh +
  '?access_token=pk.eyJ1IjoiY29kaW5ndHJhaW4iLCJhIjoiY2l6MGl4bXhsMDRpNzJxcDh0a2NhNDExbCJ9.awIfnl6ngyHoB3Xztkzarw');

  body.appendChild(mapImg);
  getData();
}

function getData(){
  fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson')
  .then(function(response){
    response.json()
    .then(function(earthquakesJSON){
      data = earthquakesJSON;
      populateMap();
    })
  })
}

function EQBall(lat, lon, size, color){
  this.x = mercX(lon) - centerX;
  this.y = mercY(lat) - centerY;
  this.size = size;
  this.color = color;
}

EQBall.prototype.draw = function(){
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

function mercX(lon){
  lon = lon * (Math.PI / 180);
  let a = (256 / Math.PI) * Math.pow(2, zoom);
  let b = lon + Math.PI;
  return a * b;
}

function mercY(lat){
  lat = lat * (Math.PI / 180);
  let a = (256 / Math.PI) * Math.pow(2, zoom);
  let b = Math.tan(Math.PI / 4 + lat / 2);
  let c = Math.PI - Math.log(b);
  return a * c;
}

function populateMap(){

  let lat, lon, mag;

  for(let i = 0; i < data.features.length; i++){
    lat = data.features[i].geometry.coordinates[1];
    lon = data.features[i].geometry.coordinates[0];
    mag = data.features[i].properties.mag;
    mag = Math.abs(mag);
    if(mag > 10){
      mag = 10;
    }
    earthquakes.push(new EQBall(lat, lon, mag * 1.2, 'rgba(20,20,20,.3)'));
    earthquakes[i].draw();
  }
}
