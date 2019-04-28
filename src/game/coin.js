// A coin
// (c) 2019 Jani Nykänen


// Constructor
let Coin = function() {

    this.spr = new AnimatedSprite(12, 12);
    this.speed = new Vec2();
    this.pos = new Vec2();
    this.exist = false;
}


// Create
Coin.prototype.createSelf = function(x, y, sx, sy) {

    this.pos = new Vec2(x, y);
    this.speed = new Vec2(sx, sy);
    this.exist = true;
}


// Update
Coin.prototype.update = function(globalSpeed, tm) {

    const GRAVITY = 0.035;
    const EPS = 1.0;
    const ANIM_SPEED = 6;

    if(!this.exist) return;

    // Update gravity
    this.speed.y += GRAVITY * tm;
    
    this.pos.x += (-globalSpeed+this.speed.x) * tm;
    this.pos.y += this.speed.y * tm;

    // Bounce
    if(this.pos.y >= 128-12 && this.speed.y > 0) {

        this.pos.y = 128-12;

        this.speed.y *= -0.80;
        if(this.speed.y > -EPS) {

            this.exist = false;
        }
    }

    // Loop
    if(this.pos.x < 0)
        this.pos.x += 160;
    else if(this.pos.x >= 160)
        this.pos.x -= 160;

    // Animate
    this.spr.animate(0, 0, 3, ANIM_SPEED, tm);
}


// Draw
Coin.prototype.draw = function(g) {

    if(!this.exist) return;

    this.spr.draw(g, g.bitmaps.coin, this.pos.x-6, this.pos.y-12);

    // Draw looped
    if(this.pos.x < 12)
        this.spr.draw(g, g.bitmaps.coin, this.pos.x-6+160, this.pos.y-12);
    else if(this.pos.x > 160-12)
        this.spr.draw(g, g.bitmaps.coin, this.pos.x-6-160, this.pos.y-12);
}


// Bunny collision
Coin.prototype.bunnyCollision = function(b, evMan, game) {

    if(!this.exist || !b.exist || b.dying || b.spawning) return;

    let w = 12;
    let h = 12;

    if(b.pos.x + b.width/2 > this.pos.x-w/2 && 
       b.pos.x - b.width/2 < this.pos.x+w/2 &&
       b.pos.y > this.pos.y-h &&
       b.pos.y-b.height < this.pos.y) {

        this.exist = false;

        if(!game.gameOver)
            ++ game.coins; 
    }
}
