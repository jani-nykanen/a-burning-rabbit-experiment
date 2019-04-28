// A mushroom
// (c) 2019 Jani Nykänen


const MUSHROOM_JUMP_WAIT = 30;
const MUSHROOM_BOUNCE_WAIT = 30;


// Constructor
let Mushroom = function() {

    this.pos = new Vec2();
    this.exist = false;

    this.spr = new AnimatedSprite(24, 24);

    this.spcTimer = 0;
    this.id = 0;

    this.gravity = 0.0;

    // Bounce timer
    this.bounceTimer = 0;

    // Dying
    this.dying = false;
    this.deathTimer = 0;
    this.deathWait = 0;
}


// Create self
Mushroom.prototype.createSelf = function(x, y, id) {

    this.exist = true;
    this.pos = new Vec2(x, y);
    this.startPos = this.pos.copy();
    this.id = id;
    this.dying = false;
    this.deathTimer = 0;
    this.bounceTimer = 0;

    this.spr = new AnimatedSprite(24, 24);
    if(id == 2)
        this.spr.width = 48;

    else if(id == 3 || id == 4) {

        this.spr.height = 48;
    }
    else if(id == 5 || id == 6) {

        this.spcTimer = Math.random() * Math.PI * 2;
    }
    else if(this.id == 7) {

        this.spcTimer = (Math.random()*MUSHROOM_JUMP_WAIT) | 0;
    }

    this.animate(0);
}


// Animate
Mushroom.prototype.animate = function(tm) {

    const FLY_ANIM_SPEED = 5;
    const FLOAT_SPEED = 0.1;
    const FLOAT_AMPL1 = 4.0;
    const FLOAT_AMPL2 = 2.0;
    const GOLD_SPEED = 8;
    const GOLD_WAIT = 30;

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
        this.spcTimer += FLOAT_SPEED * tm;
        this.spcTimer %= Math.PI*2;

        this.pos.y = this.startPos.y + 
             Math.sin(this.spcTimer)*(
                 this.id == 8 ? FLOAT_AMPL2 : FLOAT_AMPL1
            );
    }
    else if(this.id == 7) {

        // Jump animation
        if(this.spcTimer > 0.0)
            this.spr.frame = 0;
        else
            this.spr.frame = this.gravity < 0 ? 1 : 2;
        this.spr.row = 6;
    }
    else if(this.id == 9) {

        this.spr.animate(8, 0, 3, 
            this.spr.frame == 0 ? GOLD_WAIT : GOLD_SPEED, 
            tm);
    }
}


// Update
Mushroom.prototype.update = function(globalSpeed, evMan, tm) {

    const FLY_SPEED = 0.5;
    const GRAVITY = 0.1;
    const JUMP_HEIGHT = -2.5;

    if(!this.exist) return;

    // Die
    if(this.dying) {

        this.pos.x -= globalSpeed * tm;
        if((this.deathTimer -= 1.0 * tm) <= 0){

            this.exist = false;
            this.dying = false;
        }

        return;
    }

    // Animate
    this.animate(tm);

    // Update bounce timer
    if(this.bounceTimer > 0.0) {

        this.bounceTimer -= 1.0 * tm;
    }

    // Special behavior
    if(this.id == 8) {

        this.pos.x -= FLY_SPEED*tm
    }
    else if(this.id == 7) {

        // Check gravity
        if(this.spcTimer <= 0.0) {

            this.gravity += GRAVITY * tm;
            
            this.pos.y += this.gravity * tm;
            if(this.pos.y > this.startPos.y) {

                this.gravity = 0;
                this.pos.y = this.startPos.y;
                this.spcTimer = MUSHROOM_JUMP_WAIT;
            }
        }
        else {

            this.spcTimer -= 1.0 * tm;
            if(this.spcTimer <= 0.0) {

                this.gravity = JUMP_HEIGHT;
            }
        }
    }

    // Update pos
    this.pos.x -= globalSpeed * tm;
    if(this.pos.x < -this.spr.width/2) {

        this.exist = false;
    }
}


// Draw shadow (if any)
Mushroom.prototype.drawShadow = function(g) {

    if(!this.exist) return;

    if(!(this.id == 5 || this.id == 6 || this.id == 8))
        return;

    let scale = 1.0 + (this.pos.y- (this.startPos.y)) / (64);
    if(this.dying) {

        let t = this.deathTimer/this.deathWait;
        scale *= t;
    }

    g.drawScaledBitmapRegion(g.bitmaps.mushrooms, 0, 24, 24, 24,
        Math.floor(this.pos.x)-this.spr.width/2*scale, 
        128-10 -24*scale, 24*scale, 24*scale);
    
}


// Draw
Mushroom.prototype.draw = function(g) {

    if(!this.exist) return;

    let sx = 1;
    let sy = 1;
    if(this.dying) {

        let t = this.deathTimer/this.deathWait;
        let d = (this.deathWait / 4)|0;
        t = ((t*d)|0) / d;

        sx = t;
        sy = t;

    }
    else if(this.bounceTimer > 0) {

        let t = this.bounceTimer/MUSHROOM_BOUNCE_WAIT;
        sx = 1+t*0.25;
        sy = 1-t*0.25;
    }

    // Draw sprite
    this.spr.drawScaled(g, g.bitmaps.mushrooms, 
        Math.floor(this.pos.x)-this.spr.width/2*sx, 
        this.pos.y-this.spr.height*sy,
        this.spr.width*sx, this.spr.height*sy);
}


// Bunny collision
Mushroom.prototype.bunnyCollision = function(b, evMan, oman, tm) {

    const COIN_COUNT = 5;
    const LIFE_SPEED_X = 1.0;
    const LIFE_SPEED_Y = 2.0;

    if(!this.exist || !b.exist || b.dying || this.dying) return;

    let x = this.pos.x-12;
    let y = this.pos.y-20;
    let w = 24;

    switch(this.id) {

    case 2:
        w = 48;
        x -= 4;
        break;

    case 3:
    case 4:
        y -= 24;
        break;
    
    default:
        break;
    };

    if(b.floorCollision(x, y, w, evMan, tm)) {

        this.bounceTimer = MUSHROOM_BOUNCE_WAIT;
        if(this.id == 1 || this.id == 4 || this.id == 6 || this.id == 9) {

            this.dying = true;
            this.deathWait = this.id == 4 ? 30 : 20;
            this.deathTimer = this.deathWait;;
        }
        
        // Create coins & life
        if(this.id == 9) {

            // Create coins
            oman.createCoins(this.pos.x, this.pos.y,
                COIN_COUNT);

            // Create life
            oman.createLife(this.pos.x, this.pos.y, 
                LIFE_SPEED_X, LIFE_SPEED_Y);
            
            evMan.audio.playSample(evMan.sounds.gold, 0.50);
        }
    }

}
