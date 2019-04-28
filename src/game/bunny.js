// A bunny
// (c) 2019 Jani Nykänen


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
let Bunny = function() {

    const DEFAUL_ACC = 0.15;
    const DUST_COUNT = 16;

    // Position
    this.pos = new Vec2();

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
    // Is (re)spawning
    this.spawning = true;

    // Is rushing
    this.rushing = false;

    // Sprite
    this.spr = new AnimatedSprite(24, 24);

    // Dust
    this.dust = new Array(DUST_COUNT);
    for(let i = 0; i < this.dust.length; ++ i) {

        this.dust[i] = new Dust();
    }
    this.dustTimer = BUNNY_DUST_INTERVAL;

    // Gold value
    this.goldValue = 0.0;

    // Jump timer
    this.jumpTimer = 0;
    // Jump speed
    this.jumpSpeed = 0;
}


// Create self
Bunny.prototype.createSelf = function(x, y, disableControls) {

    this.pos = new Vec2(x, y);
    this.speed = new Vec2();
    this.exist = true;
    this.dying = false;
    this.spr.frame = 3;
    this.spr.row = 7;
    this.spawning = true;
    this.goldValue = 0.0;
    this.disableControls = disableControls;
    if(disableControls) {

        this.spawning = false;
        this.goldValue = 0.5;
    }
    this.jumpTimer = 0;
    this.djump = false;

    for(let i = 0; i < this.dust.length; ++ i) {

        this.dust[i].exist = false;
    }
    this.dustTimer = BUNNY_DUST_INTERVAL;
}


// Control
Bunny.prototype.control = function(evMan, tm, ignoreControls) {
    
    const GRAV_TARGET = 2.0;
    const DJUMP_TIME= 5.0;
    const FLAP_GRAV = 0.5;
    const EPS = 0.5;
    const DJUMP_SPEED = 2.0;

    let stick = evMan.vpad.stick;
    if(!this.rushing) {

        this.target.y = GRAV_TARGET;
    }

    if(this.disableControls || ignoreControls)
        return;

    this.target.x = stick.x;

    // Double jump
    let s = evMan.vpad.buttons.fire1.state;
    if(this.jumpTimer <= 0 && s == State.Pressed) {

        if(!this.djump) {

            this.djump = true;
            this.jumpTimer = DJUMP_TIME;
            this.jumpSpeed = DJUMP_SPEED;

            evMan.audio.playSample(evMan.sounds.jump, 0.50);
        }
    }

    // Flapping
    this.flapping = s == State.Down &&
        this.speed.y > 0.0 &&
        !this.rushing;
    if(this.flapping) {

        this.target.y = FLAP_GRAV;
    }

    // "Rush" down
    let delta = evMan.vpad.stickDelta;
    if(!this.rushing && delta.y > EPS && stick.y > EPS) {

        this.rushing = true;
        this.target.y = GRAV_TARGET;
        this.target.y *= 1.5;
        this.speed.y = this.target.y;
        this.flapping = false;
    }
    else if(stick.y < EPS) {

        this.rushing = false;
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
    const SLOW_DOWN = 0.5;

    // Update speed axes
    this.speed.x =
        this.updateSpeed(this.speed.x, this.target.x, 
        ACC_H, tm);
    this.speed.y =
        this.updateSpeed(this.speed.y, this.target.y, 
        GRAVITY, tm);

    // Update jump timer
    if(this.jumpTimer > 0) {

        let s = evMan.vpad.buttons.fire1.state == State.Down;
        this.jumpTimer  -= (s ? SLOW_DOWN : 1.0) * tm;
        this.speed.y = -this.jumpSpeed;
    }

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
Bunny.prototype.animate = function(evMan, tm, playFlap) {

    const JUMP_MOD = 0.25;
    const ROLL_SPEED = 4;
    const FLAP_SPEED = 4;

    // Double jump
    if(this.djump && this.speed.y < 0.0) {

        this.spr.animate(1, 0, 3, ROLL_SPEED, tm);
    }
    // Flap
    else if(this.flapping) {

        let oldFrame = this.spr.frame;
        this.spr.animate(2, 0, 3, FLAP_SPEED, tm);
        if(playFlap && this.spr.frame == 1 && oldFrame == 0) {

            evMan.audio.playSample(evMan.sounds.flap, 0.30);
        }
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


// Spawn
Bunny.prototype.spawn = function(tm) {

    const SPAWN_SPEED = 7;

    this.spr.animate(7, 8, -1, SPAWN_SPEED, tm);
    if(this.spr.frame < 0) {

        this.spr.frame = 0;
        this.spawning = false;
    }
}


// Update
Bunny.prototype.update = function(globalSpeed, evMan, oman, tm, ignoreControls, noFlap) {

    const FLOOR_Y = 128-12;
    const GOLD_SPEED = 0.00125;
    const MAX_COIN = 6;
    const LIFE_SPEED_X = 1.0;
    const LIFE_SPEED_Y = 2.0;
    const LIFE_EPS = 0.1;

    if(!this.exist) return;

    // (Re)spawn
    if(this.spawning) {

        this.spawn(tm);
        return;
    }

    this.updateDust(tm);
    // Die
    if(this.dying) {

        this.die(globalSpeed, tm);
        return;
    }

    // Update gold
    if(this.goldValue < 1.0) {
        
        this.goldValue += GOLD_SPEED * tm;
        if(this.goldValue > 1.0)
            this.goldValue = 1.0;
    }

    this.control(evMan, tm, ignoreControls);
    this.move(evMan, tm);
    this.animate(evMan, tm, !noFlap);

    // Die when colliding floor
    if(this.pos.y >= FLOOR_Y) {

        evMan.audio.playSample(evMan.sounds.die, 0.40);

        // Create coins
        oman.createCoins(this.pos.x, this.pos.y,
            this.disableControls ? 3 : (((MAX_COIN*this.goldValue) | 0)  +1),
            this.disableControls
             );

        // Create life?
        if(this.goldValue >= 1.0-LIFE_EPS) {

            oman.createLife(this.pos.x, this.pos.y, 
                LIFE_SPEED_X, LIFE_SPEED_Y);
        }

        this.pos.y = FLOOR_Y;
        this.spr.frame = 0,
        this.spr.row = 3;
        this.dying = true;
        this.goldValue = 0.0;

        // If too close the border, warp
        if(this.pos.x < 24)
            this.pos.x += 160;

        // Reduce life & bunny count
        -- oman.bunnyCount;
        if(oman.gameRef.lives > 0)
            -- oman.gameRef.lives;

        if(oman.bunnyCount <= 0) {
            // Create a new bunny
            oman.createBunny();
        }
    }
}


// Pre-draw
Bunny.prototype.preDraw = function(g) {

    if(!this.exist) return;

    // Draw shadow
    let t = 1.0 - (128-12 - this.pos.y) / 144;
    g.drawScaledBitmapRegion(g.bitmaps.mushrooms, 0, 24, 24, 24,
        Math.floor(this.pos.x)-12*t, 
        128-10 -20*t - 4, 24*t, 24*t);
    if(this.pos.x < 24 && !this.dying)
        g.drawScaledBitmapRegion(g.bitmaps.mushrooms, 0, 24, 24, 24,
            Math.floor(this.pos.x)-12*t + 160, 
            128-10 -20*t - 4, 24*t, 24*t);
    else if(this.pos.x > 160-24)
        g.drawScaledBitmapRegion(g.bitmaps.mushrooms, 0, 24, 24, 24,
            Math.floor(this.pos.x)-12*t - 160, 
            128-10 -20*t - 4, 24*t, 24*t);

    // Draw dust
    for(let i = 0; i < this.dust.length; ++ i) {

        this.dust[i].draw(g);
    }
}


// Draw sprite
Bunny.prototype.drawSprite = function(g, dx, dy) {

    if(this.goldValue < 1.0) {
        // Draw sprite
        this.spr.draw(g, g.bitmaps.bunny, 
            this.pos.x-12 + dx, this.pos.y-20 + dy);
    }

    // Draw golden layer
    g.setGlobalAlpha(this.goldValue);
    this.spr.drawFrame(g, g.bitmaps.bunny, 
        this.spr.frame+4, this.spr.row,
        this.pos.x-12 + dx, this.pos.y-20 + dy);
    g.setGlobalAlpha(1.0);
}


// Draw
Bunny.prototype.draw = function(g) {

    if(!this.exist) return;

    // Draw sprite
    this.drawSprite(g, 0, 0);
    // Draw looped
    if(this.pos.x < 24 && !this.dying)
        this.drawSprite(g, 160, 0);
    else if(this.pos.x > 160-24)
        this.drawSprite(g, -160, 0);
}


// Floor collision
Bunny.prototype.floorCollision = function(x, y, w, evMan, tm) {

    const BOUNCE_TIME = 10;
    const RUSH_BONUS = 1.25;
    const JUMP_SPEED = 2.0;

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
        this.jumpTimer = BOUNCE_TIME;
        this.jumpSpeed = JUMP_SPEED;
        if(this.rushing)
            this.jumpSpeed *= RUSH_BONUS;

        this.djump = false;

        evMan.audio.playSample(evMan.sounds.bounce, 0.50);

        return true;
    }

    return false;
}
