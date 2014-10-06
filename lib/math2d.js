'use strict';

function distance(p1, p2) {
  return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
}

function closestPair(pointsA, pointsB) {
  var best = -1;
  var p1, p2;
  var i, j;
  for (i = 0; i < pointsA.length; i++) {
    for (j = 0; j < pointsB.length; j++) {
      var d = distance(pointsA[i],pointsB[j]);
      if (d < best || best === -1) {
        best = d;
        p1 = pointsA[i];
        p2 = pointsB[j];
      }
    }
  }
  return {
    a: p1,
    b: p2,
    distance: best
  };
}

module.exports = {
  distance: distance,
  closestPair: closestPair
}
