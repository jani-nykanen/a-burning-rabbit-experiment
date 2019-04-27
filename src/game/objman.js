// Object manager
// (c) Insert your name here


// Constructor
let ObjectManager = function(assets, g) {

    const MUSHROOM_COUNT = 8;
    const BUNNY_COUNT = 8;

    // Create components
    this.mushrooms = new Array(MUSHROOM_COUNT);
    for(let i = 0; i < this.mushrooms.length; ++ i) {

        this.mushrooms[i] = new Mushroom();
    }
    this.bunnies = new Array(BUNNY_COUNT);
    this.bunnies[0] = new Bunny(64, 64);
    for(let i = 1; i < this.bunnies.length; ++ i) {

        this.bunnies[i] = new Bunny(-1, -1);
        this.bunnies[i].exist = false;
    }

    // Mushroom timer
    this.mushroomTimer = 0;
}


// Create a mushroom
ObjectManager.prototype.createMushroom = function() {

    const BASE_TIME = 32;
    const MAX_MUL = 3;

    // Find the first mushroom that does not exist
    let m = null;
    for(let i = 0; i < this.mushrooms.length; ++ i) {

        if(!this.mushrooms[i].exist) {

            m = this.mushrooms[i];
            break;
        }
    }
    if(m == null) return;

    // Create mushroom
    let id = (Math.random()*9)|0;
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
}


// Update
ObjectManager.prototype.update = function(globalSpeed, evMan, cam, tm) {

    // Update mushroom timer
    if((this.mushroomTimer -= globalSpeed*tm) <= 0.0) {

        this.createMushroom();
    }

    // Update mushrooms
    for(let i = 0; i < this.mushrooms.length; ++ i) {

        this.mushrooms[i].update(globalSpeed, evMan, tm);
    }

    // Update bunnies
    for(let i = 0; i < this.bunnies.length; ++ i) {

        this.bunnies[i].update(evMan, tm);
    }
    
}


// Stage collision
ObjectManager.prototype.stageCollision = function(stage, cam, tm) {


}


// Draw
ObjectManager.prototype.draw = function(g) {

    // Draw mushrooms & their shadowns
    for(let i = 0; i < this.mushrooms.length; ++ i) {

        this.mushrooms[i].drawShadow(g);
    }
    for(let i = 0; i < this.mushrooms.length; ++ i) {

        this.mushrooms[i].draw(g);
    }

    // Draw bunnies
    for(let i = 0; i < this.bunnies.length; ++ i) {

        this.bunnies[i].draw(g);
    }


    // Draw player
    // this.player.draw(g);
}
