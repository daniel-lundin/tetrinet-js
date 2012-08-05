var readline = require('readline')
var p = require('./playfield.js');
var s = require('./shapes.js');

console.log('Controls: ');
console.log('h - move shape left');
console.log('l - move shape right');
console.log('r - rotate shape');
console.log('enter - step field');

rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('> ');
rl.prompt();

var playfield = new p.PlayField(10, 10);

var actions = {
    's': function() { playfield.step(); },
    'h': function() {
        playfield.move_shape_left();
    },
    'l': function() {
        playfield.move_shape_right();
    },
    'r': function() {
        playfield.rotate_shape();
    },
    'x': function() {
        console.log(playfield.shape);
    }
};


rl.on('line', function(line) {
    var l = line.trim();
    if(l in actions) {
        actions[l]();
    } else {
        playfield.step();
    }
    playfield.dump();
    rl.prompt();
}).on('close', function() {
    console.log('Leaving');
    process.exit(0);
})
