// The default starting scene
// (c) Insert your name here

// Game scene
let Game = function() {

    this.name = "game";
}


// Draw HUD
Game.prototype.drawHUD = function(g) {

    g.fillRect(0, 128, 160, 1, {r: 0, g: 0, b: 0});
    g.fillRect(0, 128+1, 160, 15, {r: 255, g: 255, b: 170});
    g.fillRect(1, 128+2, 160, 15, {r: 255, g: 182, b: 0});

}


// Initialize
Game.prototype.init = function(evMan, g) {

    // Create components that do not require assets
    this.cam = new Camera(0, 0);

    // Global speed
    this.globalSpeed = 1.0;
}


// On load
Game.prototype.onLoad = function(assets, evMan, g) {

    // Create components that require assets
    this.objm = new ObjectManager(assets, g);
    this.stage = new Stage(assets);
}


// Update
Game.prototype.update = function(evMan, tm) {

    if(evMan.transition.active) return;

    // Update objects
    this.objm.update(this.globalSpeed, evMan, this.cam, tm);
    this.objm.stageCollision(this.stage, this.cam, tm);

    // Update stage
    this.stage.update(this.globalSpeed, evMan, tm);

    // Transition test
    if(evMan.vpad.buttons.fire1.state == State.Pressed) {

        evMan.transition.activate(Fade.In, 2.0);
    }
}


// Draw
Game.prototype.draw = function(g) {

    // Reset camera
    g.setTranslation();
    // Clear to gray
    g.clear(170, 170, 170);

    // Draw background
    this.stage.drawBackground(g, this.cam);

    // Use camera
    this.cam.use(g);

    // Draw stage
    this.stage.draw(g, this.cam);
    // Draw objects
    this.objm.draw(g);

    // Reset camera
    g.setTranslation();
    // Draw HUD
    this.drawHUD(g);
}
