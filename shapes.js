
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
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 1, 0]
    ]
}

function l() {
    return [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ]
/*        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0]*/
}

function zed() {
    return [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0]
    ]
}

factories = [box, pyramid, l, zed];

function rotate(shape) {
    var new_shape = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

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

    return new_shape;
}

function rotate_and_print(shape) {
    console.log(shape);
    var rot = rotate(shape);
    rot = rotate(rot);
    rot = rotate(rot);
    rot = rotate(rot);
    console.log(rot);
}

exports.factories = factories;
exports.rotate = rotate;
/*rotate_and_print(l());
rotate_and_print(box());
rotate_and_print(pyramid());
rotate_and_print(zed());
*/
