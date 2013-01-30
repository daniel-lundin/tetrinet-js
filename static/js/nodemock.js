exports = {};

function require(module) {
    if(module == './shapes.js') {
        var fake_export = {};
        fake_export.factories = factories;
        fake_export.factories = factories;
        fake_export.rotate = rotate;
        fake_export.randomize_color = randomize_color;
        return fake_export;
    }
}
