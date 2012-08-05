
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

    this.shape = [];
    this.shape_pos_x = 0;
    this.shape_pos_y = 0;
    // Initialize the ceels
    for(var i=0;i<this.width;++i) {
        this.cells.push(Array(this.height));
    }
}

PlayField.prototype.shape_at = function(x, y) {
    for(var i=0;i<this.shape.length;++i) {
        for(var j=0;j<this.shape[i].length;++j) {
            if(this.shape[i][j] == 1) {
                if(i+this.shape_pos_x == x &&
                   j+this.shape_pos_y == y) {
                    return true;
                }
            }
        }
    }
    return false;
}

PlayField.prototype.dump = function() {
    var xoffset = this.shape_pos_x;
    var yoffset = this.shape_pos_y;
    for(var y=0;y<this.height;++y) {
        var s = "";
        for(var x=0;x<this.width;++x) {
            var cell = this.cells[x][y];
            if(cell) {
                s += cell.color;
            } else if(this.shape_at(x, y)) {
                s += 'x';
            } else {
                s += "_";
            }
        }
        console.log(s);
    }
}

PlayField.prototype.step_possible = function() {
    var xoffset = this.shape_pos_x;
    var yoffset = this.shape_pos_y+1;
    for(var i=0;i<this.shape.length;++i) {
        for(var j=0;j<this.shape[i].length;++j) {
            if(this.shape[i][j] == 1) {
                if(this.cells[i+xoffset][j+yoffset]) {
                    return false;
                }
                if(j+yoffset >= this.height) {
                    return false;
                }
            }
        }
    }
    return true;
}

PlayField.prototype.freeze_shape = function() {
    var xoffset = this.shape_pos_x;
    var yoffset = this.shape_pos_y;
    for(var i=0;i<this.shape.length;++i) {
        for(var j=0;j<this.shape[i].length;++j) {
            if(this.shape[i][j] == 1) {
                this.cells[i+xoffset][j+yoffset] = new Cell(CELL_COLORS.BLUE);
            }
        }
    }
    this.shape = [];
}

PlayField.prototype.move_cells_down = function(end_y) {
    for(var y=end_y-1;y>=0;--y) {
        for(var x=0;x<this.width;++x) {
            this.cells[x][y+1] = this.cells[x][y];
        }
    }
}

PlayField.prototype.reduce_lines = function() {
    var lines_reduced = 0;
    for(var y=0;y<this.height;++y) {
        var whole_line = true;
        for(var x=0;x<this.width;++x) {
            if(!this.cells[x][y]) {
                whole_line = false;
                break;
            }
        }
        if(whole_line) {
            for(var x=0;x<this.width;++x) {
                this.cells[x][y] = 0;
            }
            ++lines_reduced;
            this.move_cells_down(y);
        }
    }
    return lines_reduced;
}

PlayField.prototype.step = function() {
    if(this.shape.length == 0) {
        var idx = Math.floor(Math.random()*shapes.factories.length);
        var shape = shapes.factories[idx]();
        this.shape = shape;
        this.shape_pos_x = 3;
        this.shape_pos_y = 0;
        return 0;
    }

    // Check if step is possible
    if(this.step_possible()) {
        this.shape_pos_y += 1;
        return 0;
    } else {
        this.freeze_shape();
        return this.reduce_lines();
    }
}

exports.PlayField = PlayField;

