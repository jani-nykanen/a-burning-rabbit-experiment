// A player object
// (c) Insert name here


// Constructor
let Player = function(x, y) {

    GameObject.call(this, x, y);
}
Player.prototype = Object.create(GameObject.prototype);


// Control
Player.prototype.control = function(evMan, tm) {
    
    const EPS = 1.0;

    let stick = evMan.vpad.stick;
    let l = Math.hypot(stick.x, stick.y);
    if(l > EPS) {

        stick.x /= l;
        stick.y /= l;
    }

    this.target.x = stick.x *2;
    this.target.y = stick.y *2;
}


// Animate
Player.prototype.animate = function(evMan, tm) {

    // ...
}


// Update
Player.prototype.onUpdate = function(evMan, cam, tm) {

    this.control(evMan, tm);
    this.animate(evMan, tm);
}


// Get a floor collision
Player.prototype.onFloorCollision = function(x, y) {

    // ...
}


// Get a ceiling collision
Player.prototype.onCeilingCollision = function(x, y) {

    // ...
}


// Get a wall collision
Player.prototype.onWallCollision = function(dir, x, y) {

    // ...
}



// Draw
Player.prototype.draw = function(g) {

    g.fillRect(this.pos.x-this.width/2, this.pos.y-this.height/2,
            this.width, this.height, {r: 255, g: 0, b: 0});
}
