'use strict';

var atmospheres = {
    'O': {
        name: 'Oxygen'
    },
    'N': {
        name: 'Nitrogen'
    },
    'CH4': {
        name: 'Methane'
    },
    'CO2': {
        name: 'Carbon Dioxide'
    },
    'H': {
        name: 'Hydrogen'
    },
    'He': {
        name: 'Helium'
    }
};

function randomAtmosphere () {
    var count = Math.floor(Math.random() * 4) + 1;
    var atmosphere = {};
    var remainingPercentage = function () {
        var total = 0;
        var gasses = Object.keys(atmosphere);
        for (i = 0; i < gasses.length; i++) {
            total += atmosphere[gasses[i]];
        }
        return 100 - total;
    }
    var atmosphereCodes = Object.keys(atmospheres);

    var atmosphereCode = atmosphereCodes[Math.floor(Math.random() * atmosphereCodes.length)];
    atmosphereCodes.splice(atmosphereCodes.indexOf(atmosphereCode), 1);
    atmosphere[atmosphereCode] = Math.random() * 75 + 25;

    for (var i = 1; i < count; i++) {
        atmosphereCode = atmosphereCodes[Math.floor(Math.random() * atmosphereCodes.length)];
        atmosphereCodes.splice(atmosphereCodes.indexOf(atmosphereCode), 1);
        atmosphere[atmosphereCode] = Math.random() * remainingPercentage();
    }

    return atmosphere;
}

function createPlanet () {
    return {
        orbitalRadius: (Math.random() * 4.5e9) + 4.6e7,
        temperature: (Math.random() * 500) - 250,
        radius: Math.random() * 1000 + 400,
        atmosphere: randomAtmosphere()
    }
}

module.exports = {
  createPlanet: createPlanet,
  atmospheres: atmospheres
}
