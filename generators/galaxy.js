'use strict';

var systemGenerator = require('./system');
var math2d = require('../lib/math2d');

var galaxySize = Number(process.env.GALAXY_SIZE);
var gridSize = Number(process.env.GRID_SIZE);
var scanDistance = Number(process.env.SCAN_DISTANCE);
var minSystems = 1;
var maxSystems = 3;

//Store a 2d array of systems
var i, j, k, x, y;
function createGalaxy() {

  var galaxy = [];
  for (i = 0; i < galaxySize; i++) {
    galaxy[i] = [];
  }

  var sections = [];

  //Place random systems
  for (i = 0;i < galaxySize; i += gridSize) {
    for (j = 0; j < galaxySize; j+= gridSize) {
      var section = [];
      var numSystems = Math.floor((Math.random() * (maxSystems + 1 - minSystems)) + minSystems);
      for(k = 0; k < numSystems; k++) {
        var x = Math.floor(Math.random() * gridSize + i);
        var y = Math.floor(Math.random() * gridSize + j);

        //Don't generate another system on collision
        if (galaxy[x][y]) {
          k--;
          continue;
        }

        //Generate a new system
        galaxy[x][y] = systemGenerator.createSystem(x,y);
        section.push([x,y]);
      }
      sections.push(section);
    }
  }

  //Takes an array of system coords and generates new systems
  //to connect all systems by scandistance
  function connectSector(systemCoords) {
    var connected = [];
    var unconnected = [].concat(systemCoords);
    var newConnected = [unconnected.pop()];
    while (newConnected.length) {
      var search = newConnected.pop();
      for (j = unconnected.length - 1; j >= 0; j--) {
        if (math2d.distance(search, unconnected[j]) <= scanDistance) {
          var newSystem = unconnected.splice(j,1)[0];
          newConnected.unshift(newSystem);
        }
      }
      connected.push(search);
    }
    while (unconnected.length) {
      var closest = math2d.closestPair(connected, unconnected);
      if (closest.distance <= scanDistance) {
        var system = unconnected.splice(unconnected.indexOf(closest.b, 1))[0];
        connected.push(system);
      } else {
        //Add a new system
        var midX = Math.floor((closest.a[0] + closest.b[0]) / 2);
        var midY = Math.floor((closest.a[1] + closest.b[1]) / 2);
        var newSystem = systemGenerator.createSystem(midX, midY);
        galaxy[midX][midY] = newSystem;
        if (math2d.distance(closest.a, [midX, midY]) <= scanDistance) {
          connected.push([midX,midY]);
        } else {
          unconnected.push([midX,midY]);
        }
      }
    }
  }

  for(i = 0; i < sections.length; i++) {
    //connect sections internally
    connectSector(sections[i]);
  }
  for(i = 0; i < sections.length; i++) {
    var mod = galaxySize / gridSize;

    var neighbours = [];
    var lT, lC, lB
    if (i % mod !== 0) {
      lT = sections[i - mod - 1];
      if (lT) {
        neighbours.push(lT);
      }
      lC = sections[i - 1];
      if (lC) {
        neighbours.push(lC);
      }
      lB - sections[i + mod - 1];
      if (lB) {
        neighbours.push(lB);
      }
    }
    var rT, rC, rB
    if (i % mod !== (mod - 1)) {
      rT = sections[i - mod + 1];
      if (rT) {
        neighbours.push(rT);
      }
      rC = sections[i + 1];
      if (rC) {
        neighbours.push(rC);
      }
      rB = sections[i + mod + 1];
      if (rB) {
        neighbours.push(rB);
      }
    }
    var top = sections[i - mod];
    if (top) {
      neighbours.push(top);
    }
    var bot = sections[i + mod];
    if (bot) {
      neighbours.push(bot);
    }

    for (j = 0; j < neighbours.length; j++) {
      var closest = math2d.closestPair(sections[i], neighbours[j]);
      while (closest.distance > scanDistance) {
        var midX = Math.floor((closest.a[0] + closest.b[0]) / 2);
        var midY = Math.floor((closest.a[1] + closest.b[1]) / 2);
        var newSystem = systemGenerator.createSystem(midX, midY);
        galaxy[midX][midY] = newSystem;
        sections[i].push(midX,midY);
        closest = math2d.closestPair([midX,midY], neighbours[j]);
      }
    }
  }

  return galaxy;
}

module.exports = {
  createGalaxy: createGalaxy
};
