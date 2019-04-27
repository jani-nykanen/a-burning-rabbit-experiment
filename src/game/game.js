// The default starting scene
// (c) Insert your name here

// Game scene
let Game = function() {

    this.name = "game";
}


// Draw HUD
Game.prototype.drawHUD = function(g) {

    // Borders
    g.fillRect(0, 128, 160, 1, {r: 0, g: 0, b: 0});
    g.fillRect(0, 128+1, 160, 15, {r: 255, g: 255, b: 170});
    g.fillRect(1, 128+2, 160, 15, {r: 218, g: 145, b: 0});

    // Text
    let y = 144-12 +1;
    g.drawText(g.bitmaps.font, "\1\2" + String(this.lives), 32,y, 0, 0, true);
    g.drawText(g.bitmaps.font, "\3\2" + String(this.coins), 80,y, 0, 0, true);
    g.drawText(g.bitmaps.font, "\7", 120,y, 0, 0, true);

    // Draw time bar
    g.fillRect(126, y, 24, 8, {r: 0, g: 0, b: 0});
    g.fillRect(126+1, y+1, 24-2, 8-2, {r: 85, g: 85, b: 85});

    let t = (this.timer * (24-2))|0;
    g.fillRect(126+1, y+1, t, 8-2, {r: 170, g: 170, b: 170});
    g.fillRect(126+1, y+2, t, 3, {r: 255, g: 255, b: 255});
    if(t > 0 && t < 22)
        g.fillRect(126+1 + t, y+1, 1, 8-2, {r: 0, g: 0, b: 0});
}


// Initialize
Game.prototype.init = function(evMan, g) {

    // Create components that do not require assets
    this.cam = new Camera(0, 0);

    // Set defaults
    this.globalSpeed = 1.0;
    this.timer = 0.0;
    this.lives = 3;
    this.coins = 0;
}


// On load
Game.prototype.onLoad = function(assets, evMan, g) {

    // Create components that require assets
    this.objm = new ObjectManager(assets, g);
    this.stage = new Stage(assets);
}


// Update
Game.prototype.update = function(evMan, tm) {

    const TIMER_SPEED = 0.005;

    if(evMan.transition.active) return;

    // Update objects
    this.objm.update(this.globalSpeed, evMan, this.cam, tm);
    this.objm.stageCollision(this.stage, this.cam, tm);

    // Update stage
    this.stage.update(this.globalSpeed, evMan, tm);

    // Update timer
    this.timer += TIMER_SPEED * this.globalSpeed * tm;
    if(this.timer >= 1.0) {

        this.timer -= 1.0;
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
