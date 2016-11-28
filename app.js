require('envoodoo')();

var readlineSync = require('readline-sync');
var chalk = require('chalk');

var systemGenerator = require('./generators/system');
var galaxyGenerator = require('./generators/galaxy');
var planetGenerator = require('./generators/planet');

var math2d = require('./lib/math2d');


//Galaxy is a 2d array of systems
var galaxy = galaxyGenerator.createGalaxy();

var input = '';
var player = {
  isAlive: true,
  x: Number(process.env.GALAXY_SIZE) / 2,
  y: Number(process.env.GALAXY_SIZE) / 2,
  hydrogen: Math.floor(Math.random() * 8) + 2,
  coldThreshold: - (Math.random() * 50 + 175),
  hotThreshold: Math.random() * 50 + 175
};
console.log('');
console.log(chalk.bold(chalk.red('-= SPACE ISN\'T FUN v1.0 =-')));
console.log('');
console.log('After a major battle your spaceship was heavily damaged and set adrift into deep space.');
console.log('You entered a cryosleep - programming the ships AI to wake you if any signals were received.');
if (galaxy[player.x][player.y]) {
  console.log('It appears you have drifted into the orbit of an unknown star system.');
} else {
  console.log('It appears you have drifted to within warping distance of an unknown star system.');
}
console.log('');
console.log(chalk.bold('You have enough Hydrogen for ' + player.hydrogen + ' more warp jumps.'));
console.log('')
console.log('Commands: \'scan\', \'warp\', \'explore\', \'land\', \'status\', \'exit\'');
console.log('');

var scannedSystems = [];
var currentSystem;
var scanDistance = Number(process.env.SCAN_DISTANCE);
while (input !== 'exit' && player.isAlive) {
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
              var systemDescription = system.name + ' - ' + systemGenerator.starClasses[system.starClass].name + ' - ' + distance.toFixed(1) + ' light years away';
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
    if (player.hydrogen > 0) {
      var target = readlineSync.question('Enter system name: ');
      var targetSystem = scannedSystems[target];
      if (targetSystem) {
        scannedSystems = [];
        console.log('warping...');
        console.log('warp complete');
        player.x = targetSystem.x;
        player.y = targetSystem.y;
        targetSystem.visited = true;
        player.hydrogen--;
        currentSystem = targetSystem;
        console.log(chalk.bold('You have enough Hydrogen for ' + player.hydrogen + ' more warp jumps.'));
      } else if (currentSystem && target === currentSystem.name) {
        console.log(target + ' is current location');
      }
      else {
        console.log('Unknown system ' + chalk.bold(target));
        console.log('Scan for valid systems to warp to.');
      }
    } else {
      console.log('You have insufficient Hydrogen to warp.');
    }
  }
  else if (input === 'explore') {
    var system = galaxy[player.x][player.y];
    if (!system) {
      console.log('Nothing to explore at current location. Warp to a system first.')
    } else {
      console.log('You are currently orbiting system ' + system.name + ', a ' + systemGenerator.starClasses[system.starClass].name)
      switch (system.planets.length) {
        case 0:
          console.log('There are no notable planets orbiting this system.');
          break;
        case 1:
          console.log('This system is orbited by a notable planet:');
          break;
        default:
          console.log('This system is orbited by ' + system.planets.length + ' notable planets:');
      }

      for (var i = 0; i < system.planets.length; i++) {
        var planet = system.planets[i];
        var atmosphere = Object.keys(planet.atmosphere);
        atmosphere.sort(function (a, b) {
          return planet.atmosphere[b] - planet.atmosphere[a];
        })
        console.log(chalk.bold(i + 1) +
          ' - ' + 'orbiting at around ' + Math.ceil(planet.orbitalRadius / 1000) * 1000 +
          'km. It has an atmosphere consisting mostly of ' + planetGenerator.atmospheres[atmosphere[0]].name +
          ' (' + planet.atmosphere[atmosphere[0]].toFixed(1) + '%)' +
          ' and a surface temperature averaging ' + planet.temperature.toFixed(0) +
          ' degrees Centigrade. The planet has a radius of ' +
          (Math.floor(planet.radius / 10) * 10) + 'km.'
        );
      }
    }
  }
  else if (input === 'land') {
    var system = galaxy[player.x][player.y];
    if (!system) {
      console.log('You are not orbiting any system. Warp to a system first.');
    } else if (!system.planets.length) {
      console.log('There are no notable planets in this system to land on.');
    } else {
      var target = parseInt(readlineSync.question('Enter planet number: '), 10);
      if (!Number.isInteger(target) || target <= 0 || target > system.planets.length) {
        console.log('Invalid planet number.');
      } else {
        var targetPlanet = system.planets[target - 1];
        if (targetPlanet.isVisited) {
          console.log('You have already landed on this planet. There is nothing more to gain here.');
        } else {
          console.log('You attempt to land on the planet.');
          if (Math.random() < 0.1) {
            console.log(chalk.red('You miscalculate your entry speed into the planets atmosphere. Your ship burns up.'))
            console.log(chalk.bold(chalk.red('You Die.')));
            player.isAlive = false;
            continue;
          }
          if (targetPlanet.temperature < player.coldThreshold) {
            console.log(chalk.blue('As you enter the planets atmosphere your ship starts to ice up. It\'s too much '+
              'for the reactor to handle and you quickly lose power.'))
            console.log(chalk.bold(chalk.blue('You Die.')));
            player.isAlive = false;
            continue;
          }
          if (targetPlanet.temperature > player.hotThreshold) {
            console.log(chalk.red('As you enter the planets atmosphere your ship starts to heat up. It\'s too much ' +
              'for the cooling system to handle and the reactor explodes.'))
            console.log(chalk.bold(chalk.red('You Die.')));
            player.isAlive = false;
            continue;
          }
          console.log('You land successfully and try to refuel your Hydrogen reactor.');
          targetPlanet.isVisited = true;
          if (targetPlanet.atmosphere['H'] > 1) {
            console.log('You manage to gather some Hydrogen.');
            player.hydrogen++;
            player.hydrogen += Math.floor(targetPlanet.atmosphere['H'] / 25);
            console.log(chalk.bold('You have enough Hydrogen for ' + player.hydrogen + ' more warp jumps.'));
            console.log('You launch back into orbit.');
          } else {
            console.log('There isn\'t enough Hydrogen in this atmosphere to refuel. You launch back into orbit.');
          }
        }
      }
    }
  }
  else if (input === 'status') {
    console.log(chalk.bold('You have enough Hydrogen for ' + player.hydrogen + ' more warp jumps.'));
  }
  else if (input !== '') {
    console.log('Unknown command. Commands: \'scan\', \'warp\', \'explore\', \'land\', \'status\', \'exit\'');
  }
  input = readlineSync.prompt();
}

