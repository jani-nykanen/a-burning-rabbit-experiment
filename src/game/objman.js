// Object manager
// (c) 2019 Jani Nykänen


// Constructor
let ObjectManager = function(gameRef) {

    const MUSHROOM_COUNT = 8;
    const BUNNY_COUNT = 8;
    const COIN_COUNT = 16;
    const LIFE_COUNT = 8;
    const LIFE_WAIT_INITIAL = 5;

    // Create components
    this.mushrooms = new Array(MUSHROOM_COUNT);
    for(let i = 0; i < this.mushrooms.length; ++ i) {

        this.mushrooms[i] = new Mushroom();
    }
    this.bunnies = new Array(BUNNY_COUNT);
    for(let i = 0; i < this.bunnies.length; ++ i) {

        this.bunnies[i] = new Bunny(-1, -1);
        this.bunnies[i].exist = false;
    }
    // Create a starting bunny
    this.bunnies[0].createSelf(80, 0, true);

    this.coins = new Array(COIN_COUNT);
    for(let i = 0; i < this.coins.length; ++ i) {

        this.coins[i] = new Coin();
    }
    this.lives = new Array(LIFE_COUNT);
    for(let i = 0; i < this.lives.length; ++ i) {

        this.lives[i] = new Life();
    }

    // Create starting mushrooms
    let m = this.findFirst(this.mushrooms);
    m.createSelf(32, 128-12, 2);
    m = this.findFirst(this.mushrooms);
    m.createSelf(112, 128-12, 0);
    m = this.findFirst(this.mushrooms);
    m.createSelf(112+32, 128-12, 0);

    // Mushroom timer
    this.mushroomTimer = 0;

    // Laziness
    this.gameRef = gameRef;
    // Bunny count
    this.bunnyCount = 1;

    // Life wait
    this.lifeWait = LIFE_WAIT_INITIAL;
}


// Find first object that does not exist
// in an object array
ObjectManager.prototype.findFirst = function(arr) {

    let m = null;
    for(let i = 0; i < arr.length; ++ i) {

        if(!arr[i].exist) {

            m = arr[i];
            break;
        }
    }
    return m;
}


// Create a mushroom
ObjectManager.prototype.createMushroom = function(globalSpeed) {

    const MUSHROOM_ID_MAX = 9;
    const BASE_TIME = 32;
    const MAX_MUL = 3;
    const LIFE_WAIT_MIN = 8;
    const LIFE_WAIT_MAX = 16;
    const LIFE_HEIGHT_VARY = 16;

    // Probabilities
    let prob = [

        0.2, 0.05, 0.10, 
        0.15, 0.05, 0.125, 
        0.05, 0.15, 0.10,
    ]

    // Find the first mushroom that does not exist
    let m = this.findFirst(this.mushrooms);
    if(m == null) return;

    // Generate a random ID
    let p = Math.random();
    let s = 0;
    let id = MUSHROOM_ID_MAX;
    for(let i = 0; i < MUSHROOM_ID_MAX; ++ i) {

        s += prob[i];
        if(p <= s) {

            id = i;
            break;
        }
    }

    // Create mushroom
    let x = 160+24;
    let y = 128-12;
    if(id == 5 || id == 6 || id == 8) {

        y -= 32;
    }
    else if(id == 2) {
        
        x += 8;
    }
    m.createSelf(x, y, id);

    let mul = ((1+Math.random()*MAX_MUL)|0);
    if(id == 2 && mul == 1) {
        mul = 2;
    }
    this.mushroomTimer += BASE_TIME * mul;

    // Create life possibly
    if((--this.lifeWait) <= 0) {

        if(id == 3 || id == 4 || id == 7)
            y -= 32;

        // Create life
        this.createLife(x, y-32 - 
            (Math.random()*LIFE_HEIGHT_VARY) );

        // Update wait count
        this.lifeWait = LIFE_WAIT_MIN + 
            ((Math.random()*(LIFE_WAIT_MAX-LIFE_WAIT_MIN))|0);

        this.lifeWait *= globalSpeed;
        this.lifeWait |= 0;
    }
}


// Create a new bunny
ObjectManager.prototype.createBunny = function() {

    if(this.gameRef.lives <= 0) return;

    // Find the first bunny that does not exist
    let b = this.findFirst(this.bunnies);
    if(b == null) return;

    // Create bunny
    b.createSelf(24, 24);

    this.gameRef.timer -= 1.0;
    if(this.gameRef.timer < 0)
        this.gameRef.timer = 0;

    ++ this.bunnyCount;
}


// Create coins
ObjectManager.prototype.createCoins = function(x, y, count, uniformSpeed) {

    let angle = count == 1 ? Math.PI/2 : Math.PI/4.0;
    let angleJump = (Math.PI/2.0) / (count-1);
    let c, height;
    for(let i = 0; i < count; ++ i) {

        c = this.findFirst(this.coins);
        if(c == null) break;

        height = uniformSpeed ? 0.67 : 1.0 + 0.25*Math.random();
        c.createSelf(x, y, 
            Math.cos(angle), 
            -Math.abs(Math.sin(angle)*2*height));

        angle += angleJump;
    }
}


// Create a life
ObjectManager.prototype.createLife = function(x, y, sx, sy) {

    // Find the first bunny that does not exist
    let l = this.findFirst(this.lives);
    if(l == null) return;

    // Create bunny
    if(sx == null)
        l.createSelf(x, y, 0,0, true);
    else
        l.createSelf(x, y, sx, sy);
}



// Update
ObjectManager.prototype.update = function(globalSpeed, evMan, tm) {

    // Update mushroom timer
    if((this.mushroomTimer -= globalSpeed*tm) <= 0.0) {

        this.createMushroom(globalSpeed);
    }

    // Update mushrooms
    for(let i = 0; i < this.mushrooms.length; ++ i) {

        this.mushrooms[i].update(globalSpeed, evMan, tm);
        // Bunny collision
        for(let j = 0; j < this.bunnies.length; ++ j) {

            this.mushrooms[i].bunnyCollision(this.bunnies[j], this, tm);
        }
    }

    // Update coins
    for(let i = 0; i < this.coins.length; ++ i) {

        this.coins[i].update(globalSpeed, tm);
        // Bunny collision
        for(let j = 0; j < this.bunnies.length; ++ j) {

            this.coins[i].bunnyCollision(this.bunnies[j], evMan, this.gameRef);
        }
    }


    // Update lives
    for(let i = 0; i < this.lives.length; ++ i) {

        this.lives[i].update(globalSpeed, tm);
        // Bunny collision
        for(let j = 0; j < this.bunnies.length; ++ j) {

            this.lives[i].bunnyCollision(this.bunnies[j], evMan, this.gameRef);
        }
    }


    // Update bunnies
    for(let i = 0; i < this.bunnies.length; ++ i) {

        this.bunnies[i].update(globalSpeed, evMan, this, tm);
    }
    
}


// Draw
ObjectManager.prototype.draw = function(g) {

    // "Pre-"draw bunnies
    for(let i = 0; i < this.bunnies.length; ++ i) {

        this.bunnies[i].preDraw(g);
    }

    // Draw mushrooms & their shadowns
    for(let i = 0; i < this.mushrooms.length; ++ i) {

        this.mushrooms[i].drawShadow(g);
    }
    for(let i = 0; i < this.mushrooms.length; ++ i) {

        this.mushrooms[i].draw(g);
    }

    // Draw coins
    for(let i = 0; i < this.coins.length; ++ i) {

        this.coins[i].draw(g);
    }

    // Draw lives
    for(let i = 0; i < this.lives.length; ++ i) {

        this.lives[i].draw(g);
    }
    
    // Draw bunnies
    for(let i = 0; i < this.bunnies.length; ++ i) {

        this.bunnies[i].draw(g);
    }
}
