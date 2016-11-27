require('envoodoo')();

var readlineSync = require('readline-sync');
var chalk = require('chalk');

var systemGenerator = require('./generators/system');
var galaxyGenerator = require('./generators/galaxy');

var math2d = require('./lib/math2d');


//Galaxy is a 2d array of systems
var galaxy = galaxyGenerator.createGalaxy();

systemGenerator.checkGalaxy();

var input = '';
var player = {
  x: Number(process.env.GALAXY_SIZE) / 2,
  y: Number(process.env.GALAXY_SIZE) / 2
}
var scannedSystems = [];
var currentSystem;
var scanDistance = Number(process.env.SCAN_DISTANCE);
while (input !== 'exit') {
  if (input === 'scan') {
    scannedSystems = [];
    for (i = player.x - scanDistance; i < player.x + scanDistance; i++) {
      for (j = player.y - scanDistance; j < player.y + scanDistance; j++) {
        if (galaxy[i] && galaxy[i][j]) {

          var system = galaxy[i][j];
          scannedSystems[system.name] = system;
          if (i !== player.x || j !== player.y) {
            var distance = math2d.distance([player.x,player.y], [i,j]);
            if (distance < scanDistance) {
              var systemDescription = system.name + ' - ' + systemGenerator.starClasses[system.starClass].name + ' - ' + distance + ' light years away';
              if (!system.visited) {
                systemDescription = chalk.green(systemDescription);
              }
              console.log(systemDescription);
            }
          } else {
            currentSystem = system;
            console.log(chalk.bold(system.name + ' - ' + systemGenerator.starClasses[system.starClass].name + ' - ' + 'current location'));
          }
        }
      }
    }
  }
  else if (input === 'warp') {
    target = readlineSync.question('Enter system name: ');
    var targetSystem = scannedSystems[target];
    if (targetSystem) {
      scannedSystems = [];
      console.log('warping...');
      console.log('warp complete');
      player.x = targetSystem.x;
      player.y = targetSystem.y;
      console.log(targetSystem);
      targetSystem.visited = true;
    } else if (target === currentSystem.name) {
      console.log(target + ' is current location');
    }
    else {
      console.log('Unknown system ' + target);
    }
  } else {
    console.log('Unknown command');
  }
  input = readlineSync.prompt();
}


// function getShortestDistance(points, originIndex) {
//   var shortestDistance = -1;
//   for (i = 0; i < points.length; i++) {
//     if (i = originIndex)
//       continue;
//     var distance = getDistance(originIndex, i);
//     if (!distance) {
//       distance = distance2d(points[i], points[originIndex]);
//       setDistance(originIndex, i, distance);
//     }
//     if (shortestDistance < 0) {
//       shortestDistance = distance;
//       continue;
//     }
//     if (distance < shortestDistance) {
//       shortestDistance = distance;
//     }
//   }
//   return shortestDistance;
// }

// for(i = 0; i < systems.length; i++) {
//   var shortestDistance = getShortestDistance(systems, i);
//   if (shortestDistance > scanDistance) {
//     console.log(shortestDistance);
//   }
// }

