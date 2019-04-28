// A collectable life
// (c) 2019 Jani Nykänen


// Constructor
let Life = function() {

    this.spr = new AnimatedSprite(16, 16);
    this.speed = new Vec2();
    this.pos = new Vec2();
    this.startPos = new Vec2();
    this.exist = false;
    this.waveTimer = 0;

    this.flying = false;
}


// Create
Life.prototype.createSelf = function(x, y, sx, sy, flying) {

    this.pos = new Vec2(x, y);
    this.startPos = this.pos.copy();
    this.speed = new Vec2(sx, sy);
    this.exist = true;

    this.flying = flying;
    this.waveTimer = Math.random() * Math.PI * 2;
}


// Update
Life.prototype.update = function(globalSpeed, tm) {

    const GRAVITY = 0.035;
    const EPS = 0.5;
    const ANIM_SPEED = 6;
    const WAVE_SPEED = 0.05;
    const AMPL = 4.0;

    if(!this.exist) return;

    // Animate
    this.spr.animate(0, 0, 3, ANIM_SPEED, tm);

    if(this.flying) {

        this.pos.x -= globalSpeed * tm;

        // Update wave
        this.waveTimer += WAVE_SPEED * tm;
        this.pos.y = this.startPos.y + Math.sin(this.waveTimer) * AMPL;

        return;
    }


    // Update gravity
    this.speed.y += GRAVITY * tm;
    
    this.pos.x += (-globalSpeed+this.speed.x) * tm;
    this.pos.y += this.speed.y * tm;

    // Bounce
    if(this.pos.y >= 128-12) {

        this.pos.y = 128-12;

        this.speed.y *= -0.90;
        if(this.speed.y > -EPS) {

            this.exist = false;
        }
    }

    // Loop
    if(this.pos.x < 0)
        this.pos.x += 160;
    else if(this.pos.x >= 160)
        this.pos.x -= 160;
}


// Draw
Life.prototype.draw = function(g) {

    if(!this.exist) return;

    this.spr.draw(g, g.bitmaps.life, this.pos.x-8, this.pos.y-16);

    // Draw looped
    if(!this.flying) {

        if(this.pos.x < 16)
            this.spr.draw(g, g.bitmaps.life, this.pos.x-8+160, this.pos.y-16);
        else if(this.pos.x > 160-16)
            this.spr.draw(g, g.bitmaps.life, this.pos.x-8-160, this.pos.y-16);
    }
}


// Bunny collision
Life.prototype.bunnyCollision = function(b, evMan, game) {

    if(!this.exist || !b.exist || b.dying || b.spawning) return;

    let w = 16;
    let h = 16;

    if(b.pos.x + b.width/2 > this.pos.x-w/2 && 
       b.pos.x - b.width/2 < this.pos.x+w/2 &&
       b.pos.y > this.pos.y-h &&
       b.pos.y-b.height < this.pos.y) {

        this.exist = false;

        if(!game.gameOver)
            ++ game.lives; 
        
        evMan.audio.playSample(evMan.sounds.life, 0.50);
    }
}
