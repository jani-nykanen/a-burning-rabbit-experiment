// A title screen
// (c) 2019 Jani Nykänen


// Constructor
let Title = function() {

    this.name = "title";
}


// Initialize
Title.prototype.init = function(evMan) {

    this.enterTimer = 60;
    this.introPlayed = false;
    this.introWait = 90;
}


// Update
Title.prototype.update = function(evMan, tm) {

    if(evMan.transition.active) {

        if(this.introPlayed && evMan.transition.mode == Fade.In) {

            this.enterTimer += 15;
            this.enterTimer %= 60;
        }
        return;
    }

    // Update intro
    if(!this.introPlayed) {

        if((this.introWait -= 1.0 * tm) <= 0 ||
         evMan.input.anyKeyPressed) {

            evMan.transition.activate(Fade.In, 2.0, () => {
                this.introPlayed =  true;
                evMan.audio.fadeInMusic(evMan.sounds.title, 0.5, 1000);
            }, {r:109, g:182, b: 255}, 4);
        }
        return;
    }

    // Update enter timer
    this.enterTimer += 1.0 * tm;
    this.enterTimer %= 60;

    // Check enter
    if(evMan.vpad.buttons.start.state == State.Pressed ||
       evMan.vpad.buttons.fire1.state == State.Pressed ) {

        evMan.audio.playSample(evMan.sounds.start, 0.50);
        evMan.audio.fadeOutMusic(evMan.sounds.title, 0.0, 1000);

        evMan.transition.activate(Fade.In, 1.0, () => {
            evMan.changeScene("game");
            evMan.transition.effect = Effect.Fading;
            evMan.transition.division = 4;  
            evMan.audio.stopMusic();
        }, null, 16, Effect.Bars);
    }
}


// Draw
Title.prototype.draw = function(g) {

    g.clear(109, 182, 255);

    // Draw intro
    if(!this.introPlayed) {

        g.drawBitmap(g.bitmaps.intro, 0, 0);
        return;
    }

    // Draw logo
    g.drawBitmap(g.bitmaps.logo, 0, 0);

    if(this.enterTimer < 30) {

        g.drawText(g.bitmaps.font, "PRESS ENTER", 160/2, 144-36, 0, 0, true);
    }

    // Copyright
    g.drawText(g.bitmaps.font, "\4"+"2019 JANI NYK" + "\5" + "NEN", 
        160/2, 144-10, 0, 0, true);
}

