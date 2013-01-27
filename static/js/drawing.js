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

function draw_field(canvas, pf_data, field_width, offset) {
    var ctx = canvas.getContext('2d');
    var cells = pf_data.cells;
    var height = pf_data.height;
    var width = pf_data.width;
    var cell_width = field_width / width;
    var cell_height = canvas.height / height;

    for(var i=0;i<cells.length;++i) {
        var x = i % width;
        var y = Math.floor(i/width);
        ctx.fillStyle = border_color_map[cells[i]];
        ctx.fillRect(offset+cell_width*x, cell_height*y, cell_width, cell_height);
        ctx.fillStyle = color_map[cells[i]];
        ctx.fillRect(offset+cell_width*x+2, cell_height*y+2, cell_width-4, cell_height-4);
    }
}

function draw_fields(canvas, pfs_data) {
    offset = 0;
    field_width = (canvas.width - 20)/ pfs_data.length;
    for(var pf_data in pfs_data) {
        draw_field(canvas, pfs_data[pf_data], field_width, offset);
        offset += 300;
    }
}
