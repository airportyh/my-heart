var playSound = require('play-sound');
var path = require('path');
var _ = require('lodash');
var player = playSound();
var five = require('johnny-five');
var board = new five.Board();

var patterns = [];

patterns.push([
  [6],
  [5, 7],
  [4, 8],
  [3, 9],
  [2, 10],
  [1, 11],
  [12],
  [0],
  [12],
  [1, 11],
  [2, 10],
  [3, 9],
  [4, 8],
  [5, 7]
]);

patterns.push([
  [0, 6],
  [1, 7],
  [2, 8],
  [3, 9],
  [4, 10],
  [5, 11],
  [6, 12]
]);

patterns.push([
  [],
  [6],
  [5, 6, 7],
  [4, 5, 6, 7, 8],
  [3, 4, 5, 7, 8, 9],
  [2, 3, 4, 8, 9, 10],
  [1, 2, 3, 9, 10, 11],
  [0, 1, 2, 10, 11, 12],
  [0, 1, 11, 12],
  [0, 12],
  [0],
  [],
  [0],
  [0, 12],
  [0, 1, 11, 12],
  [1, 2, 3, 9, 10, 11],
  [2, 3, 4, 8, 9, 10],
  [3, 4, 5, 7, 8, 9],
  [4, 5, 6, 7, 8],
  [5, 6, 7],
  [6],
  []
]);

patterns.push([
  [],
  [6],
  [6, 7],
  [6, 7, 8],
  [6, 7, 8, 9],
  [6, 7, 8, 9, 10],
  [6, 7, 8, 9, 10, 11],
  [6, 7, 8, 9, 10, 11, 12],
  [6, 7, 8, 9, 10, 11, 12, 0],
  [6, 7, 8, 9, 10, 11, 12, 0, 1],
  [6, 7, 8, 9, 10, 11, 12, 0, 1, 2],
  [6, 7, 8, 9, 10, 11, 12, 0, 1, 2, 3],
  [6, 7, 8, 9, 10, 11, 12, 0, 1, 2, 3, 4],
  [6, 7, 8, 9, 10, 11, 12, 0, 1, 2, 3, 4, 5],
  [7, 8, 9, 10, 11, 12, 0, 1, 2, 3, 4, 5],
  [8, 9, 10, 11, 12, 0, 1, 2, 3, 4, 5],
  [9, 10, 11, 12, 0, 1, 2, 3, 4, 5],
  [10, 11, 12, 0, 1, 2, 3, 4, 5],
  [11, 12, 0, 1, 2, 3, 4, 5],
  [12, 0, 1, 2, 3, 4, 5],
  [0, 1, 2, 3, 4, 5],
  [1, 2, 3, 4, 5],
  [2, 3, 4, 5],
  [3, 4, 5],
  [4, 5],
  [5],
  [],
]);

patterns.push([
  [6, 7, 8, 9],
  [7, 8, 9, 10],
  [8, 9, 10, 11],
  [9, 10, 11, 12],
  [10, 11, 12, 0],
  [11, 12, 0, 1],
  [12, 0, 1, 2],
  [0, 1, 2, 3],
  [1, 2, 3, 4],
  [2, 3, 4, 5],
  [3, 4, 5, 6]
]);

patterns.push([
  [6],
  [7],
  [8],
  [9],
  [10],
  [11],
  [12],
  [0],
  [1],
  [2],
  [3],
  [4],
  [5]
]);

board.on('ready', function() {
  var leds = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 'A0'].map(function(n) {
    return new five.Led(n);
  });

  beat(leds, 3, function() {
    var score = finalFantasyTheme();
    play(score, leds, 150);
  });

  this.repl.inject({
    leds: leds
  });
});

function beat(leds, times, done) {
  var i = 0;
  function on() {
    leds.forEach(function(led) {
      led.on();
    });
  }
  function off() {
    leds.forEach(function(led) {
      led.off();
    });
  }
  function pulse() {
    i++;
    if (i > times) {
      done();
      return;
    }
    on();
    setTimeout(function() {
      off();
      setTimeout(function() {
        on();
        setTimeout(function() {
          off();
          setTimeout(pulse, 2000);
        }, 150);
      }, 150);
    }, 150);
  }
  pulse();
}

function play(music, leds, period) {
  var i = 0;
  var j = 0;
  function next() {
    var data = music[(i++) % music.length];
    var lightIndices = data[0];
    var note = data[1];
    playNote(note);
    if (lightIndices) {
      lightIndices.forEach(function(idx) {
        leds[idx].on();
      });
      setTimeout(function() {
        lightIndices.forEach(function(idx) {
          leds[idx].off();
        });
        next();
      }, period);
    }
  }
  next();
}

function roundAbout(leds) {
  var i = 0;
  function next() {
    var led = leds[(i++) % leds.length];
    led.on();
    setTimeout(function() {
      led.off();
      next();
    }, 250);
  }
  next();
}

function random(leds, period) {
  function next() {
    var idx = Math.floor(Math.random() * leds.length);
    leds[idx].on();
    setTimeout(function() {
      leds[idx].off();
      next();
    }, period);
  }
  next();
}

function finalFantasyTheme() {
  var chords = [
    ['c3', 'd3', 'e3', 'g3'],
    ['a2', 'b2', 'c3', 'e3'],
    ['c3', 'd3', 'e3', 'g3'],
    ['a2', 'b2', 'c3', 'e3'],
    ['a2', 'c3', 'f3', 'g3'],
    ['b2', 'd3', 'g3', 'a3'],
    ['ab2', 'c3', 'eb3', 'g3'],
    ['bb2', 'd3', 'f3', 'a3']
  ];
  var notes = _.flatten(chords.map(function(chord, idx) {
    var chordDown = [octaveUp(1)(chord[0]), chord[3], chord[2], chord[1]];
    var music = chord
      .concat(chord.map(octaveUp(1)))
      .concat(chord.map(octaveUp(2)))
      .concat(chord.map(octaveUp(3)))
      .concat(chordDown.map(octaveUp(3)))
      .concat(chordDown.map(octaveUp(2)))
      .concat(chordDown.map(octaveUp(1)))
      .concat(chordDown);
    var pattern = patterns[idx % patterns.length];
    if (!pattern) {
      console.error('No pattern to use', idx, chords.length);
      process.exit(1);
    }
    return _.zip(repeatToLength(pattern, music.length), music);
  }));

  notes = notes.concat(notes).concat(notes);
  return notes;
}

function repeatToLength(arr, length) {
  var ret = [];
  while (ret.length < length) {
    ret = ret.concat(arr);
  }
  return ret.slice(0, length);
}

function octaveUp(n) {
  return function(note) {
    var num = Number(note[note.length - 1]);
    return note.substring(0, note.length - 1) + (num + n);
  }
}

function playNote(note) {
  player.play(path.resolve('media/' + note.toUpperCase() + '.mp3'));
}
