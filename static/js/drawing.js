var color_map = {
    0: '#eee',
    1: '#4ee',
    2: '#e4e',
    3: '#ee4',
    99: '#333'
};

var border_color_map = {
    0: '#eee',
    1: '#4aa',
    2: '#a4a',
    3: '#aa4',
    99: '#333'
};

function draw_field(canvas, play_field, field_width, field_height, offset_x, offset_y) {
    var ctx = canvas.getContext('2d');

    var cell_width = field_width / play_field.width;
    var cell_height = field_height / play_field.height;

    for(var x=0;x<play_field.width;++x) {
        for(var y=0;y<play_field.height;++y) {
            var idx = x + play_field.width*y;
            if(play_field.cells[idx]) {
                ctx.fillStyle = 'green';
            } else if(play_field.shape_at(x, y)) {
                ctx.fillStyle = 'blue';
            } else {
                ctx.fillStyle = 'grey';
            }
            ctx.fillRect(offset_x+cell_width*x, offset_y+cell_height*y, cell_width, cell_height);
        }
    }
}

function draw_main_field(canvas, play_field) {
    draw_field(canvas, play_field, 300, 500, 10, 10);
}


function draw_fields(canvas, pfs_data) {
    offset_y = 10;
    draw_main_field(canvas, PlayField.load(pfs_data[PLAYER_ID]));

    for(var key in pfs_data) {
        if(key == PLAYER_ID)
            continue;
        draw_field(canvas, PlayField.load(pfs_data[key]), 50, 100, 320, offset_y);
        offset_y += 120;
    }
}
