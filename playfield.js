
var shapes = require("./shapes.js");

var CELL_COLORS = {
    BLUE: 0,
    RED: 1,
    GREEN: 2,
    YELLOW: 3,
};

var Cell = function(color) {
    this.color = color;
} 

var PlayField = function(width, height) {
    this.width = width;
    this.height = height;
    this.cells = [];

    this.shape = undefined;
    this.shape_pos_x = 0;
    this.shape_pos_y = 0;
    // Initialize the ceels
    for(var i=0;i<this.width;++i) {
        this.cells.push(Array(this.height));
    }
}

function shape_at(play_field, x, y) {
    for(var i=0;i<4;++i) {
        for(var j=0;j<4;++j) {
            if(play_field.shape[i][j] == 1) {
                if(i+play_field.shape_pos_x == x &&
                   j+play_field.shape_pos_y == y) {
                    return true;
                }
            }
        }
    }
    return false;
}

function dump(play_field) {
    var xoffset = play_field.shape_pos_x;
    var yoffset = play_field.shape_pos_y;
    for(var y=0;y<play_field.height;++y) {
        var s = "";
        for(var x=0;x<play_field.width;++x) {
            var cell = play_field.cells[x][y];
            if(cell) {
                s += cell.color;
            } else if(play_field.shape && shape_at(play_field, x, y)) {
                s += 'x';
            } else {
                s += "_";
            }
        }
        console.log(s);
    }
}

function move_cell(play_field, from_pos, to_pos) {
    var cell = play_field.cells[from_pos[0]][from_pos[1]];
    play_field.cells[to_pos[0]][to_pos[1]] = cell;
    play_field.cells[from_pos[0]][from_pos[1]] = undefined;
}

function step_possible(play_field) {
    var xoffset = play_field.shape_pos_x;
    var yoffset = play_field.shape_pos_y+1;
    for(var i=0;i<4;++i) {
        for(var j=0;j<4;++j) {
            if(play_field.shape[i][j] == 1) {
                if(play_field.cells[i+xoffset][j+yoffset]) {
                    return false;
                }
                if(j+yoffset >= play_field.height) {
                    return false;
                }
            }
        }
    }
    return true;
}

function freeze_shape(play_field) {
    var xoffset = play_field.shape_pos_x;
    var yoffset = play_field.shape_pos_y;
    for(var i=0;i<4;++i) {
        for(var j=0;j<4;++j) {
            if(play_field.shape[i][j] == 1) {
                play_field.cells[i+xoffset][j+yoffset] = new Cell(CELL_COLORS.BLUE);
            }
        }
    }
    play_field.shape = undefined;
}

function step(play_field) {
    if(play_field.shape == undefined) {
        console.log("generating shape");
        var idx = Math.floor(Math.random()*shapes.factories.length);
        var shape = shapes.factories[idx]();
        console.log(shapes.factories[idx]);
        play_field.shape = shape;
        play_field.shape_pos_x = 3;
        play_field.shape_pos_y = 0;
        return;
    }

    // Check if step is possible
    if(step_possible(play_field)) {
        play_field.shape_pos_y += 1;
    } else {
        console.log("freezing shape");
        freeze_shape(play_field);
    }
}

function add_falling_box(play_field) {
    play_field.falling_shape_cells.push(new Cell(CELL_COLORS.BLUE));
}

var play_field = new PlayField(10, 10);
for(var i=0;i<14;++i) {
    step(play_field);
}
dump(play_field);
console.log("rotating");
play_field.shape = shapes.rotate(play_field.shape);
dump(play_field);

