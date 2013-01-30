
var shapes = require("./shapes.js");

var PlayField = function(width, height) {
    this.width = width;
    this.height = height;
    this.cells = Array(width * height);
    for(var i=0;i<this.cells.length;++i)
        this.cells[i] = 0;


    this.shape = [];
    this.shape_pos_x = 0;
    this.shape_pos_y = 0;
    this.alive = true;
}

PlayField.prototype.serialize = function() {
    var cells = Array(this.cells.length);
    return {
        "cells": this.cells,
        "width": this.width,
        "height": this.height,
        "shape": this.shape,
        "shape_pos_x": this.shape_pos_x,
        "shape_pos_y": this.shape_pos_y,
    };
}


PlayField.load = function(pf_data) {
    var play_field = new PlayField(pf_data.width, pf_data.height);
    play_field.cells = pf_data.cells;
    play_field.shape = pf_data.shape;
    play_field.shape_pos_x = pf_data.shape_pos_x;
    play_field.shape_pos_y = pf_data.shape_pos_y;
    return play_field;
}

PlayField.prototype.dump = function() {
    var xoffset = this.shape_pos_x;
    var yoffset = this.shape_pos_y;
    var s = "";
    for(var i=0;i<this.cells.length;++i) {
        var x = i % this.width;
        var y = Math.floor(i / this.width);
        if(this.cells[i]) {
            s += this.cells[i];
        } else if(this.shape_at(x, y)) {
            s += 'x';
        } else {
            s += '_';
        }
        if((i != 0) && !((i+1) % this.width)) {
            console.log(s);
            var s = "";
        }
    }
}

PlayField.prototype.step = function() {
    // Return number of lines removed or -1 if game over
    if(this.shape.length == 0) {
        var idx = Math.floor(Math.random()*shapes.factories.length);
        var shape = shapes.factories[idx]();
        shapes.randomize_color(shape);
        var res = this._place_start_shape(shape);
        if(res == -1) {
            this.alive = false;
        }
        return res;
    }

    // Check if step is possible
    if(this._step_possible()) {
        this.shape_pos_y += 1;
        return 0;
    } else {
        this._freeze_shape();
        var reduced = this._reduce_lines();
        return reduced
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

PlayField.prototype.move_shape_down = function() {
    if(this._legal_shape_position(this.shape_pos_x, this.shape_pos_y+1, this.shape)) {
        this.shape_pos_y += 1;
    }
}

PlayField.prototype.free_fall = function() {
    var y = this.shape_pos_y + 1;
    while(this._legal_shape_position(this.shape_pos_x, y, this.shape)) {
        y += 1;
    }
    this.shape_pos_y = y - 1;
}

PlayField.prototype.increase_from_bottom = function(rows) {
    while(rows--) {
        for(var i=0;i<this.height-1;++i) {
            for(var j=0;j<this.width;++j) {
                var cell_idx = i*this.width + j;
                var next_cell_idx = (i+1)*this.width + j;
                this.cells[cell_idx] = this.cells[next_cell_idx];
            }
        }
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
            if(this.shape[i][j]) {
                if(i+this.shape_pos_x == x &&
                   j+this.shape_pos_y == y) {
                    return this.shape[i][j];
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
            if(this.shape[i][j]) {
                var cellidx = (i + xoffset) + this.width*(j+yoffset);
                if(this.cells[cellidx]) {
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
            if(this.shape[i][j]) {
                var cellidx = (i + xoffset) + this.width*(j+yoffset);
                this.cells[cellidx] = 99;
            }
        }
    }
    this.shape = [];
}

PlayField.prototype._reduce_lines = function() {
    var lines_reduced = 0;
    var i=0;
    for(var i=0;i<this.cells.length;i+=this.width) {
        var whole_line = true;
        for(var x=0;x<this.width;++x) {
            if(!this.cells[i+x]) {
                whole_line = false;
                break;
            }
        }
        if(whole_line) {
            // Zero out row
            for(var x=0;x<this.width;++x) {
                this.cells[i+x] = 0;
            }
            ++lines_reduced;
            this._move_cells_down(i);
        }
    }
    return lines_reduced;
}

PlayField.prototype._move_cells_down = function(end) {
    for(var i=end-this.width;i>=0;i-=this.width) {
        for(var x=0;x<this.width;++x) {
            var cellidx = i + x;
            var next_row_idx = cellidx + this.width;
            this.cells[next_row_idx] = this.cells[cellidx];
        }
    }
}

PlayField.prototype._place_start_shape = function(shape) {
    var x = Math.floor((this.width - shape.length)/2);
    for(var i=shape.length;i>0;--i) {
        if(this._legal_shape_position(x, -i, shape)) {
            this.shape = shape;
            this.shape_pos_x = x;
            this.shape_pos_y = -i;
            return 0;
        }
    }
    return -1;
}

PlayField.prototype._legal_shape_position = function(xoffset, yoffset, shape) {
    for(var x=0;x<shape.length;++x) {
        for(var y=0;y<shape[x].length;++y) {
            if(shape[x][y]) {
                var realx = x + xoffset;
                var realy = y + yoffset;
                // Check borders
                if(realx < 0 || realx >= this.width)
                    return false;
                if(realy < 0 || realy >= this.height)
                    return false;
                var cellidx = realy*this.width + realx;
                if(this.cells[cellidx])
                    return false;
            }
        }
    }
    return true;
}

exports.PlayField = PlayField;

