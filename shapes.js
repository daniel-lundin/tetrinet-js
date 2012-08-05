
function box() {
    return [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ]
}

function pyramid() {
    return [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ]
}

function I() {
    return [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ]
}

function L() {
    return [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ]
}

function zed() {
    return [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0]
    ]
}

factories = [box, pyramid, I, L, zed];

function rotate(shape) {

    var new_shape = Array(shape.length);
    for(var i=0;i<shape.length; ++i) {
        new_shape[i] = Array(shape.length);
    }

    for(var i=0;i<shape.length; ++i) {
        for(var j=0;j<shape[i].length; ++j) {
            new_shape[i][j] = shape[shape.length-j-1][i];
        }
    }
    // A 4x4 rotation does this:
    /*
    new_shape[0][0] = shape[3][0];
    new_shape[0][1] = shape[2][0];
    new_shape[0][2] = shape[1][0];
    new_shape[0][3] = shape[0][0];

    new_shape[1][0] = shape[3][1];
    new_shape[1][1] = shape[2][1];
    new_shape[1][2] = shape[1][1];
    new_shape[1][3] = shape[0][1];

    new_shape[2][0] = shape[3][2];
    new_shape[2][1] = shape[2][2];
    new_shape[2][2] = shape[1][2];
    new_shape[2][3] = shape[0][2];

    new_shape[3][0] = shape[3][3];
    new_shape[3][1] = shape[2][3];
    new_shape[3][2] = shape[1][3];
    new_shape[3][3] = shape[0][3];
    */

    return new_shape;
}

exports.factories = factories;
exports.rotate = rotate;
exports.rotate = rotate;

exports._box = box;
exports._pyramid = pyramid;
exports._I = I;
exports._L = L;
exports._zed = zed;
