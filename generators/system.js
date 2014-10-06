'use strict';

var starClasses = {
  'O': {
    name: 'Class O Ultraviolet Star',
    frequency: 1.0
  },
  'B': {
    name: 'Class B Blue Star',
    frequency: 1.0
  },
  'A': {
    name: 'Class A White Star',
    frequency: 1.0
  },
  'F': {
    name: 'Class F White Star',
    frequency: 1.0
  },
  'G': {
    name: 'Class G Yellow Star',
    frequency: 1.0
  },
  'K': {
    name: 'Class K Orange Star',
    frequency: 1.0
  },
  'M0': {
    name: 'Class M Red Giant',
    frequency: 1.0
  },
  'M1': {
    name: 'Class M Red Dwarf',
    frequency: 1.0
  },
  'WR': {
    name: 'Wolf-Rayet Star',
    frequency: 1.0
  },
  'L': {
    name: 'Cool Red/Brown Dwarf',
    frequency: 1.0
  },
  'T': {
    name: 'Methane Dwarf',
    frequency: 1.0
  },
  'Y': {
    name: 'Cool Brown Dwarf',
    frequency: 1.0
  },
  'D': {
    name: 'White Dwarf',
    frequency: 1.0
  }
}
var starClassCodes = Object.keys(starClasses);

function randStarClass() {
  //TODO:
  //Return a star based on frequency of occurrence
  return starClassCodes[Math.floor(Math.random() * starClassCodes.length)];
}

function randHexColor(min,max) {
  return Math.floor((Math.random() * (max - min)) + min).toString(16);
}

function randStarColor(starClass) {
  //TODO:
  //Return a color within a range that matches starClass
  return '#' + randHexColor(100,255) + randHexColor(100,255) + randHexColor(255,255);
}

var chars = 'ABCDEFGHIJKLMNOPQRSTWXYZ';
function randName() {
  var name = '';
  name += chars.charAt(Math.floor(Math.random() * chars.length));
  name += chars.charAt(Math.floor(Math.random() * chars.length));
  name += chars.charAt(Math.floor(Math.random() * chars.length));
  name += '-';
  name += Math.floor(Math.random() * 1000);
  return name;
}

var names = [];
function uniqueRandName() {
  var name = randName();
  while (names.indexOf(name) >= 0) {
    name = randName();
  }
  names.push(name);
  return name;
}

var systems = [];

function createSystem(x,y) {
  systems.push([x,y]);
  var starClass = randStarClass();
  return {
    x: x,
    y: y,
    color: randStarColor(starClass),
    name: uniqueRandName(),
    starClass: starClass
  };
}

  function checkGalaxy() {

    var math2d = require('../lib/math2d');

    console.log('Num. Systems Generated: ' + systems.length);

    var scanDistance = Number(process.env.SCAN_DISTANCE);

    var connected = [];

    var newSystems = [];

    var notConnected = [].concat(systems);

    newSystems.push(notConnected.pop());

    function bfs() {
      var i, currentSystem, distance;
      while (newSystems.length > 0) {
        var currentSystem = newSystems.pop();
        for (i = notConnected.length - 1; i >= 0; i--) {
          distance = math2d.distance(currentSystem, notConnected[i]);
          if (distance <= scanDistance) {
            var system = notConnected.splice(i,1)[0];
            newSystems.unshift(system);
          }
        }
        connected.push(currentSystem);
      }
    }

    bfs();

    console.log(notConnected.length + ' not connected');

  }

module.exports = {
  starClasses: starClasses,
  createSystem: createSystem,
  checkGalaxy: checkGalaxy
};
