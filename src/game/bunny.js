// A bunny
// (c) Insert name here


// Constructor
let Bunny = function(x, y) {

    const DEFAUL_ACC = 0.15;

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

    // Does exist & is dying
    this.exist = true;
    this.dying = false;

    // Sprite
    this.spr = new AnimatedSprite(24, 24);
}


// Control
Bunny.prototype.control = function(evMan, tm) {
    
    const GRAV_TARGET = 2.0;

    let stick = evMan.vpad.stick;
    this.target.x = stick.x;
    this.target.y = GRAV_TARGET;
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
}


// Animate
Bunny.prototype.animate = function(evMan, tm) {

    const JUMP_MOD = 0.25;

    if(Math.abs(this.speed.y) < JUMP_MOD) {

        this.spr.frame = 0;
    }
    else {

        this.spr.frame = this.speed.y > 0 ? 1 : 2;
    }
    this.spr.row = 0;
}


// Update
Bunny.prototype.update = function(evMan, tm) {

    if(!this.exist) return;

    this.control(evMan, tm);
    this.move(evMan, tm);
    this.animate(evMan, tm);

    // TEMP
    this.floorCollision(0, 128-12, 160, tm);
}



// Draw
Bunny.prototype.draw = function(g) {

    if(!this.exist) return;

    // Draw sprite
    this.spr.draw(g, g.bitmaps.bunny, this.pos.x-12, this.pos.y-20);
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

        return true;
    }

    return false;
}
