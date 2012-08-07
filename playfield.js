
var shapes = require("./shapes.js");

var CELL_COLORS = {
    BLUE: 0,
    RED: 1,
    GREEN: 2,
    YELLOW: 3,
};

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
        for(var j=0;j<this.height;++j) {
            this.cells[i][j] = 0;
        }
    }
}

PlayField.prototype.dump = function() {
    var xoffset = this.shape_pos_x;
    var yoffset = this.shape_pos_y;
    for(var y=0;y<this.height;++y) {
        var s = "";
        for(var x=0;x<this.width;++x) {
            var cell = this.cells[x][y];
            if(cell) {
                s += cell;
            } else if(this.shape_at(x, y)) {
                s += 'x';
            } else {
                s += "_";
            }
        }
        console.log(s);
    }
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
    if(this._step_possible()) {
        this.shape_pos_y += 1;
        return 0;
    } else {
        this._freeze_shape();
        return this._reduce_lines();
    }
}

PlayField.prototype.move_shape_left = function() {
    if(this._legal_shape_position(this.shape_pos_x-1, this.shape_pos_y, this.shape)) {
        this.shape_pos_x -= 1;
    }
}

PlayField.prototype.move_shape_right = function() {
    if(this._legal_shape_position(this.shape_pos_x+1, this.shape_pos_y, this.shape)) {
        this.shape_pos_x += 1;
    }
}

PlayField.prototype.rotate_shape = function() {
    if(this._legal_shape_position(this.shape_pos_x, this.shape_pos_y, shapes.rotate(this.shape))) {
        this.shape = shapes.rotate(this.shape);
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

/** PRIVATE **/

PlayField.prototype._step_possible = function() {
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


PlayField.prototype._freeze_shape = function() {
    var xoffset = this.shape_pos_x;
    var yoffset = this.shape_pos_y;
    for(var i=0;i<this.shape.length;++i) {
        for(var j=0;j<this.shape[i].length;++j) {
            if(this.shape[i][j] == 1) {
                this.cells[i+xoffset][j+yoffset] = 1;
            }
        }
    }
    this.shape = [];
}

PlayField.prototype._reduce_lines = function() {
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
            this._move_cells_down(y);
        }
    }
    return lines_reduced;
}

PlayField.prototype._move_cells_down = function(end_y) {
    for(var y=end_y-1;y>=0;--y) {
        for(var x=0;x<this.width;++x) {
            this.cells[x][y+1] = this.cells[x][y];
        }
    }
}

PlayField.prototype._legal_shape_position = function(xoffset, yoffset, shape) {
    for(var x=0;x<shape.length;++x) {
        for(var y=0;y<shape[x].length;++y) {
            if(shape[x][y] == 1) {
                var realx = x + xoffset;
                var realy = y + yoffset;
                // Check borders
                if(realx < 0 || realx >= this.width)
                    return false;
                if(realy < 0 || realy >= this.height)
                    return false;
                if(this.cells[realx][realy])
                    return false;
            }
        }
    }
    return true;
}

exports.PlayField = PlayField;

