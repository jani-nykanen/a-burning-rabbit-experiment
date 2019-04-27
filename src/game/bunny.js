// A bunny
// (c) Insert name here


const DUST_TIME_MAX = 30;


// Dust
let Dust = function() {

    this.frame = 0;
    this.row = 0;
    this.pos = new Vec2();
    this.timer = 0;
    this.exist = false;
}


// Create
Dust.prototype.createSelf = function(x, y, frame, row) {

    this.pos = new Vec2(x, y);
    this.frame = frame,
    this.row = row;
    this.exist = true;
    this.timer = DUST_TIME_MAX;
}


// Update
Dust.prototype.update = function(tm) {

    if(!this.exist) return;

    // Update timer
    this.timer -= 1.0 * tm;
    if(this.timer <= 0.0) {

        this.exist = false;
    }
}


// Draw
Dust.prototype.draw = function(g) {

    if(!this.exist) return;

    let t = this.timer/DUST_TIME_MAX;
    g.drawScaledBitmapRegion(g.bitmaps.bunny,
        this.frame*24, (this.row+4)*24, 24, 24,
        this.pos.x-12*t, this.pos.y-12*t, 24*t, 24*t);

    // Draw looped
    if(this.pos.x < 24)
        g.drawScaledBitmapRegion(g.bitmaps.bunny,
            this.frame*24, (this.row+4)*24, 24, 24,
            this.pos.x-12*t +160, this.pos.y-12*t, 24*t, 24*t);
    else if(this.pos.x > 160-24)
        g.drawScaledBitmapRegion(g.bitmaps.bunny,
            this.frame*24, (this.row+4)*24, 24, 24,
            this.pos.x-12*t -160, this.pos.y-12*t, 24*t, 24*t);
}


const BUNNY_DUST_INTERVAL = 6;


// Constructor
let Bunny = function(x, y) {

    const DEFAUL_ACC = 0.15;
    const DUST_COUNT = 16;

    // Position
    this.pos = new Vec2(x, y);

    // Speed
    this.speed = new Vec2();
    this.target = new Vec2();

    // Acceleration
    this.acc = new Vec2(DEFAUL_ACC, DEFAUL_ACC);

    // Hitbox
    this.width = 8;
    this.height = 16;

    // Double jump used
    this.djump = false;
    // Is flapping
    this.flapping = false;

    // Does exist & is dying
    this.exist = true;
    this.dying = false;

    // Sprite
    this.spr = new AnimatedSprite(24, 24);

    // Dust
    this.dust = new Array(DUST_COUNT);
    for(let i = 0; i < this.dust.length; ++ i) {

        this.dust[i] = new Dust();
    }
    this.dustTimer = BUNNY_DUST_INTERVAL;
}


// Control
Bunny.prototype.control = function(evMan, tm) {
    
    const GRAV_TARGET = 2.0;
    const DJUMP_HEIGHT = -3.0;
    const FLAP_GRAV = 0.5;

    let stick = evMan.vpad.stick;
    this.target.x = stick.x;
    this.target.y = GRAV_TARGET;

    // Double jump
    let s = evMan.vpad.buttons.fire1.state;
    if(s == State.Pressed) {

        if(!this.djump) {

            this.djump = true;
            this.speed.y = DJUMP_HEIGHT;
        }
    }

    // Flapping
    this.flapping = s == State.Down &&
        this.speed.y > 0.0;
    if(this.flapping) {

        this.target.y = FLAP_GRAV;
    }
}


// Update speed
Bunny.prototype.updateSpeed = function(speed, target, acc, tm)  {
    
    if (speed < target) {

        speed += acc * tm;
        if (speed > target) {

            speed = target;
        }
    }
    else if (speed > target) {

        speed -= acc * tm;
        if (speed < target) {

            speed = target;
        }
    }

    return speed;
}


// Move
Bunny.prototype.move = function(evMan, tm) {

    const GRAVITY = 0.1;
    const ACC_H = 0.1;

    // Update speed axes
    this.speed.x =
        this.updateSpeed(this.speed.x, this.target.x, 
        ACC_H, tm);
    this.speed.y =
        this.updateSpeed(this.speed.y, this.target.y, 
        GRAVITY, tm);

    // Update position
    this.pos.x += this.speed.x * tm;
    this.pos.y += this.speed.y * tm;

    // Loop
    if(this.pos.x < 0)
        this.pos.x += 160;
    else if(this.pos.x >= 160)
        this.pos.x -= 160;
}


// Animate
Bunny.prototype.animate = function(evMan, tm) {

    const JUMP_MOD = 0.25;
    const ROLL_SPEED = 4;
    const FLAP_SPEED = 4;

    // Double jump
    if(this.djump && this.speed.y < 0.0) {

        this.spr.animate(1, 0, 3, ROLL_SPEED, tm);
    }
    // Flap
    else if(this.flapping) {

        this.spr.animate(2, 0, 3, FLAP_SPEED, tm);
    }
    // Other
    else {

        if(Math.abs(this.speed.y) < JUMP_MOD) {

            this.spr.frame = 0;
        }
        else {

            this.spr.frame = this.speed.y > 0 ? 1 : 2;
        }
        this.spr.row = 0;
    }
}


// Update dust
Bunny.prototype.updateDust = function(tm) {

    // Update dust
    for(let i = 0; i < this.dust.length; ++ i) {

        this.dust[i].update(tm);
    }
    if(this.dying) return;

    // Update dust timer
    this.dustTimer -= 1.0 * tm;
    if(this.dustTimer <= 0.0) {

        this.dustTimer += BUNNY_DUST_INTERVAL;

        // Create dust
        for(let i = 0; i < this.dust.length; ++ i) {

            if(this.dust[i].exist) continue;

            this.dust[i].createSelf(this.pos.x, this.pos.y-8,
                this.spr.frame, this.spr.row);
            break;
        }
    }
}


// Die
Bunny.prototype.die = function(globalSpeed, tm) {

    const DIE_SPEED = 6;

    if(this.spr.frame != 3)
        this.spr.animate(3, 0, 3, DIE_SPEED, tm);

    this.pos.x -=  globalSpeed*tm;
    if(this.pos.x < -24)
        this.exist = false;
}


// Update
Bunny.prototype.update = function(globalSpeed, evMan, tm) {

    const FLOOR_Y = 128-12;

    if(!this.exist) return;

    this.updateDust(tm);
    // Die
    if(this.dying) {

        this.die(globalSpeed, tm);
        return;
    }

    this.control(evMan, tm);
    this.move(evMan, tm);
    this.animate(evMan, tm);

    // Die when colliding floor
    if(this.pos.y >= FLOOR_Y) {

        this.pos.y = FLOOR_Y;
        this.spr.frame = 0,
        this.spr.row = 3;
        this.dying = true;
    }
}


// Pre-draw
Bunny.prototype.preDraw = function(g) {

    if(!this.exist) return;

    // Draw dust
    for(let i = 0; i < this.dust.length; ++ i) {

        this.dust[i].draw(g);
    }
}


// Draw
Bunny.prototype.draw = function(g) {

    if(!this.exist) return;

    // Draw sprite
    this.spr.draw(g, g.bitmaps.bunny, this.pos.x-12, this.pos.y-20);
    // Draw looped
    if(this.pos.x < 24)
        this.spr.draw(g, g.bitmaps.bunny, this.pos.x-12+160, this.pos.y-20);
    else if(this.pos.x > 160-24)
        this.spr.draw(g, g.bitmaps.bunny, this.pos.x-12-160, this.pos.y-20);
}


// Floor collision
Bunny.prototype.floorCollision = function(x, y, w, tm) {

    const BOUNCE_HEIGHT = -3.0;

    const COL_OFF_TOP = -0.5;
    const COL_OFF_BOTTOM = 1.0;

    if(!this.exist || this.dying || this.speed.y < 0.0)
        return false;

    // Check if inside the horizontal area
    if(!(this.pos.x+this.width/2 >= x && 
        this.pos.x-this.width/2 <= x+w))
        return false;

    // Vertical collision
    if(this.pos.y >= y+COL_OFF_TOP*tm && 
       this.pos.y <= y+(COL_OFF_BOTTOM+this.speed.y)*tm) {

        this.pos.y = y;
        this.speed.y = BOUNCE_HEIGHT;
        this.djump = false;

        return true;
    }

    return false;
}
