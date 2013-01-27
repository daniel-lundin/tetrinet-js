var color_map = {
    0: '#eee',
    1: '#4ee',
    99: '#e4e'
}

function draw_field(canvas, pf_data, field_width, offset) {
    var ctx = canvas.getContext('2d');
    console.log(pf_data);
    var cells = pf_data.cells;
    var height = pf_data.height;
    var width = pf_data.width;
    var cell_width = field_width / width;
    var cell_height = canvas.height / height;

    for(var i=0;i<cells.length;++i) {
        var x = i % width;
        var y = Math.floor(i/width);
        ctx.fillStyle = '#eaf';
        ctx.fillRect(offset+cell_width*x, cell_height*y, cell_width, cell_height);
        ctx.fillStyle = color_map[cells[i]];
        ctx.fillRect(offset+cell_width*x+1, cell_height*y+1, cell_width-2, cell_height-2);
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
