// A mushroom
// (c) 2019 Jani Nykänen


// Constructor
let Mushroom = function() {

    this.pos = new Vec2();
    this.exist = false;

    this.spr = new AnimatedSprite(24, 24);

    this.spcTimer = 0;
    this.id = 0;
}


// Create self
Mushroom.prototype.createSelf = function(x, y, id) {

    this.exist = true;
    this.pos = new Vec2(x, y);
    this.startPos = this.pos.copy();
    this.id = id;
    this.spcTimer = 0;

    this.spr = new AnimatedSprite(24, 24);
    if(id == 2)
        this.spr.width = 48;

    else if(id == 3 || id == 4) {

        this.spr.height = 48;
    }
    else if(id == 5 || id == 6) {

        this.spcTimer = Math.random() * Math.PI * 2;
    }

    this.animate(0);
}


// Animate
Mushroom.prototype.animate = function(tm) {

    const FLY_ANIM_SPEED = 5;
    const FLOAT_SPEED = 0.1;
    const FLOAT_AMPL = 4.0;

    if(this.id == 0 || this.id == 1) {

        this.spr.frame = this.id;
        this.spr.row = 0;
    }
    else if(this.id == 2) {

        this.spr.frame = 1;
        this.spr.row = 0;
    }
    else if(this.id == 3 || this.id == 4) {

        this.spr.row = 1;
        this.spr.frame = this.id-3;
    }
    else if(this.id == 5 || this.id == 6 || this.id == 8) {

        // Flying animation
        this.spr.animate(this.id-1, 0, 3, FLY_ANIM_SPEED, tm);

        // Floating
        if(this.id != 8) {

            this.spcTimer += FLOAT_SPEED * tm;
            this.spcTimer %= Math.PI*2;

            this.pos.y = this.startPos.y + 
                Math.sin(this.spcTimer)*FLOAT_AMPL;
        }
    }
    else if(this.id == 7) {

        // Jump animation
        // ...
        this.spr.frame = 0;
        this.spr.row = 6;
    }
}


// Update
Mushroom.prototype.update = function(globalSpeed, evMan, tm) {

    if(!this.exist) return;

    // Animate
    this.animate(tm);

    // Update pos
    this.pos.x -= globalSpeed * tm;
    if(this.pos.x < -this.spr.width/2) {

        this.exist = false;
    }
}


// Draw
Mushroom.prototype.draw = function(g) {

    if(!this.exist) return;

    // Draw sprite
    this.spr.draw(g, g.bitmaps.mushrooms, 
        this.pos.x-this.spr.width/2, this.pos.y-this.spr.height);
}
