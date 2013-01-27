var color_map = {
    0: '#eee',
    1: '#4ee',
    99: '#e4e'
}

function draw_field(canvas, pf_data) {
    var ctx = canvas.getContext('2d');
    console.log(pf_data);
    var cells = pf_data.cells;
    var height = pf_data.height;
    var width = pf_data.width;
    var cell_width = canvas.width / width;
    var cell_height = canvas.height / height;

    for(var i=0;i<cells.length;++i) {
        var x = i % width;
        var y = Math.floor(i/width);
        ctx.fillStyle = '#eaf';
        ctx.fillRect(cell_width*x, cell_height*y, cell_width, cell_height);
        ctx.fillStyle = color_map[cells[i]];
        ctx.fillRect(cell_width*x+1, cell_height*y+1, cell_width-2, cell_height-2);
    }
}

