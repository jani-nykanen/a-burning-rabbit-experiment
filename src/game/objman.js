// Object manager
// (c) Insert your name here


// Constructor
let ObjectManager = function(assets, g) {

    // Create components
    this.player = new Player(g.canvas.width/2, g.canvas.height/2);
}


// Update
ObjectManager.prototype.update = function(evMan, cam, tm) {

    // Update player
    this.player.update(evMan, cam, tm);
    
}


// Stage collision
ObjectManager.prototype.stageCollision = function(stage, cam, tm) {

    // Player-to-stage collision
    stage.playerCollision(this.player, tm);
}


// Draw
ObjectManager.prototype.draw = function(g) {

    // Draw player
    // this.player.draw(g);
}
