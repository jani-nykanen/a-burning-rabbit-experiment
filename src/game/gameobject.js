// A base game object
// (c) Insert name here


// Constructor
let GameObject = function(x, y) {

    const DEFAUL_ACC = 0.15;

    // Position
    this.pos = new Vec2(x, y);

    // Speed
    this.speed = new Vec2();
    this.target = new Vec2();

    // Acceleration
    this.acc = new Vec2(DEFAUL_ACC, DEFAUL_ACC);

    // Hitbox
    this.width = 16;
    this.height = 16;

    // Does exist
    this.exist = true;
    this.dying = false;
}


// Update speed
GameObject.prototype.updateSpeed = function(speed, target, acc, tm)  {
    
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
GameObject.prototype.move = function(evMan, tm) {

    // Update speed axes
    this.speed.x =
        this.updateSpeed(this.speed.x, this.target.x, 
        this.acc.x, tm);
    this.speed.y =
        this.updateSpeed(this.speed.y, this.target.y, 
        this.acc.y, tm);

    // Update position
    this.pos.x += this.speed.x * tm;
    this.pos.y += this.speed.y * tm;
}


// Update
GameObject.prototype.update = function(evMan, cam, tm) {

    if(!this.exist) return;

    // Die
    if(this.dying) {

        if(this.die)
            this.die(evMan, tm);
        else {

            this.exist = false;
            this.dying = false;
        }

        return;
    }

    // Custom event
    if(this.onUpdate) {

        this.onUpdate(evMan, cam, tm);
    }
    this.move(evMan, tm);
}


// Get a floor collision
GameObject.prototype.floorCollision = function(x, y, w, tm) {

    const COL_OFF_TOP = -0.5;
    const COL_OFF_BOTTOM = 1.0;

    if(!this.exist || this.dying || this.speed.y < 0.0)
        return false;

    // Check if inside the horizontal area
    if(!(this.pos.x+this.width/2 >= x && 
        this.pos.x-this.width/2 <= x+w))
        return false;

    // Vertical collision
    if(this.pos.y+this.height/2 >= y+COL_OFF_TOP*tm && 
       this.pos.y+this.height/2 <= y+(COL_OFF_BOTTOM+this.speed.y)*tm) {

        this.pos.y = y-this.height/2;
        this.speed.y = 0.0;

        if(this.onFloorCollision) {

            this.onFloorCollision(x, y);
        }
        return true;
    }

    return false;
}


// Get a ceiling collision
GameObject.prototype.ceilingCollision = function(x, y, w, tm) {

    const COL_OFF_TOP = -1.0;
    const COL_OFF_BOTTOM = 0.5;

    if(!this.exist || this.dying || this.speed.y > 0.0)
        return;

    // Check if inside the horizontal area
    if(!(this.pos.x+this.width/2 >= x && 
        this.pos.x-this.width/2 < x+w))
        return;

    // Vertical collision
    if(this.pos.y-this.height/2 <= y+COL_OFF_BOTTOM*tm && 
       this.pos.y-this.height/2 >= y+(COL_OFF_TOP+this.speed.y)*tm) {

         this.pos.y = y+this.height/2;
         this.speed.y = 0.0;

         // Custom event
         if(this.onCeilingCollision) {

            this.onCeilingCollision(x, y);
         }
    }
}


// Get a wall collision
GameObject.prototype.wallCollision = function(dir, x, y, h, tm) {

    const EPS = 0.01;

    const COL_OFF_NEAR = 0.5;
    const COL_OFF_FAR = 1.0;

    if(!this.exist || this.dying || this.speed.x*dir < EPS)
        return false;

    // Check if inside the collision area vertically
    if(this.pos.y <= y || this.pos.y-this.height >= y+h) {
        return false;
    }

    // Horizontal collision
    if((dir == 1 && 
        this.pos.x+this.width/2 >= x - COL_OFF_NEAR*tm && 
        this.pos.x+this.width/2 <= x + (COL_OFF_FAR+this.speed.x)*tm) ||
       (dir == -1 && 
        this.pos.x-this.width/2  <= x + COL_OFF_NEAR*tm && 
        this.pos.x-this.width/2  >= x-(COL_OFF_FAR-this.speed.x)*tm)) {
        
        this.speed.x = 0;
        this.pos.x = x - this.width/2 * dir;

        // Custom event    
        if(this.onWallCollision) {

            this.onWallCollision(dir, x, y);
        }

        return true;
    }
    return false;
}
