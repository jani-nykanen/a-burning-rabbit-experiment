// A simple camera
// (c) Insert name here


// Constructor
let Camera = function(x, y) {

    this.pos = new Vec2(x, y);
}


// Use camera
Camera.prototype.use = function(g) {

    g.setTranslation(-this.pos.x, -this.pos.y);
}
