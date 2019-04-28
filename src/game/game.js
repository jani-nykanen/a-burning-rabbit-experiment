// The default starting scene
// (c) 2019 Jani Nykänen


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


// Draw Game over!
Game.prototype.drawGameOver = function(g) {

    g.fillRect(0, 0, 160, 144, {r:0, g:0, b:0, a:0.33});
    g.drawText(g.bitmaps.font, "GAME OVER!", 
        160/2, 40, 0,0, true);

    // Draw score
    g.drawText(g.bitmaps.font, "SCORE: " + String(this.coins), 
        160/2, 56, 0,0, true);
    // Draw record
    g.drawText(g.bitmaps.font, "RECORD: " + String(this.record), 
        160/2, 66, 0,0, true);
}


// Initialize
Game.prototype.init = function(evMan, g) {

    this.reset();
}


// Reset
Game.prototype.reset = function() {

    const INTRO_TIME = 90;

    // Set defaults
    this.globalSpeed = 0.0;
    this.timer = 0.0;
    this.lives = 4;
    this.coins = 0;
    this.paused = false;
    this.gameOver = false;
    this.record = window.localStorage.record;
    if(this.record == null)
        this.record = 0;
    else
        this.record = Number(this.record);

    // Create components
    this.objm = new ObjectManager(this);
    this.stage = new Stage();

    // Speed timer
    this.speedTimer = 0;
    // Speed state
    this.speedState = 0;

    // Ready-go stuff
    this.readyPhase = -1;
    // Info timer
    this.infoTimer = INTRO_TIME;
}


// On load
Game.prototype.onLoad = function(assets, evMan, g) {

    // ...
}


// Update
Game.prototype.update = function(evMan, tm) {

    const TIMER_SPEED = 0.0025;
    const GSPEED_REDUCE = 0.01;
    const SPEED_LIMITS = [
        30*60, 60*60, 90*60, 120*60
    ];
    const GSPEED_INCREASE = 0.01;

    if(evMan.transition.active) return;

    let enterPressed = evMan.vpad.buttons.start.state == State.Pressed;

    // Update game over
    if(this.gameOver) {

        if(enterPressed) {

            evMan.audio.playSample(evMan.sounds.start, 0.50);
            evMan.transition.activate(Fade.In, 2.0, () => {

                this.gameOver = false;
                this.reset();
            },
            null,
            4);
        }

        // Reduce global speed
        if(this.globalSpeed > 0.0) {

            this.globalSpeed -= GSPEED_REDUCE*tm;
            if(this.globalSpeed < 0.0)
                this.globalSpeed = 0.0;
        }
    }
    else if(this.readyPhase > 1) {

        // Pause/unpause
        if(enterPressed) {

            evMan.audio.playSample(evMan.sounds.pause, 0.50);
            this.paused = !this.paused;

            if(this.paused) {

                evMan.audio.pauseMusic();
            }
            else {

                evMan.audio.resumeMusic();
            }
        }

        if(this.paused) {
            return;
        }

        // Update info timer
        if(this.infoTimer > 0) {

            this.infoTimer -= 1.0 * tm;
        }

        // Update timer
        this.timer += TIMER_SPEED * this.globalSpeed * tm;
        if(this.timer >= 1.0) {

            this.timer -= 1.0;
            // Create a new bunny
            this.objm.createBunny();
        }

        if(this.speedState < SPEED_LIMITS.length) {
            // Update speed
            this.speedTimer += 1.0 * tm;
            if(this.speedTimer > SPEED_LIMITS[this.speedState]) {

                ++ this.speedState;
                this.globalSpeed += 0.25;
            }
        }

        // Update global speed, if "too small"
        if(this.globalSpeed < 1.0) {

            this.globalSpeed += GSPEED_INCREASE * tm;
            if(this.globalSpeed > 1.0)
                this.globalSpeed = 1.0;
        }
    }
    else {

        if(this.readyPhase == 0) {

            this.readyPhase = this.objm.bunnies[0].dying ? 1 : 0;
            if(this.readyPhase != 0) {

                evMan.audio.playSample(evMan.sounds.go, 0.40);

                evMan.audio.fadeInMusic(evMan.sounds.theme, 0.50, 1000);
            }
        }
        else if(this.readyPhase == -1) {
            
            this.readyPhase = 0;
            evMan.audio.playSample(evMan.sounds.ready, 0.40);
        }
        else {

            this.readyPhase = this.objm.bunnies[1].spawning ? 1 : 2;
        }
    }

    // Check game over
    if(this.lives <= 0) {

        this.gameOver = true;
        this.paused = false;

        evMan.audio.fadeOutMusic(evMan.sounds.theme, 0.0, 1000);

        // Check record
        if(this.coins > this.record) {

            this.record = this.coins;
            window.localStorage.record = String(this.record);
        }
    }

    // Update stage
    this.stage.update(this.globalSpeed, evMan, tm);
    // Update objects
    this.objm.update(this.globalSpeed, evMan, tm);

}


// Draw
Game.prototype.draw = function(g) {

    const INFO_Y = 16;

    // Reset camera
    g.setTranslation();
    // Clear to gray
    g.clear(170, 170, 170);

    // Draw background
    this.stage.drawBackground(g, this.cam);

    // Draw stage
    this.stage.draw(g, this.cam);
    // Draw objects
    this.objm.draw(g);
    // Draw HUD
    this.drawHUD(g);

    // Pause
    if(this.paused) {

        g.fillRect(0, 0, 160, 144, {r:0, g:0, b:0, a:0.33});
        g.drawText(g.bitmaps.font, "GAME PAUSED", 
            160/2, 144/2-4 -16, 0,0, true);
    }

    // Game over
    if(this.gameOver) {

        this.drawGameOver(g);
    }

    // Draw ready-go
    if(this.readyPhase < 2 && this.readyPhase >= 0) {

        let str = this.readyPhase == 0 ? "READY?" : "GO!";
        g.drawText(g.bitmaps.font, str, 
            160/2, 144/2-4 -16, 0,0, true);
    }

    // Draw info
    if(this.infoTimer > 0 || this.paused) {

        let t = 1.0;
        if(this.infoTimer < 30 && !this.paused)
            t = this.infoTimer / 30;

        if(!this.paused) {

            g.fillRect((1-t)*(-32), INFO_Y, 32, 96, {r:0, g:0, b:0, a:0.33});
            g.fillRect(160-32*t, INFO_Y, 32, 96, {r:0, g:0, b:0, a:0.33});

            g.setGlobalAlpha(0.75);
        }
        
        g.drawBitmapRegion(g.bitmaps.controls, 0, 0, 32, 96, (1-t)*(-32), INFO_Y);
        g.drawBitmapRegion(g.bitmaps.controls, 32, 0, 32, 96, 160 - 32*t, INFO_Y);
        g.setGlobalAlpha(1);
    }
}
