// Stage object template
// (c) Insert your name here


// Constructor
let Stage = function(assets) {

    // Layer positions
    this.layerPos = new Array(5);
    for(let i = 0; i < this.layerPos.length; ++ i)
        this.layerPos[i] = 0;
}


// Update
Stage.prototype.update = function(evMan, tm) {

    const LAYER_SPEEDS = [
        0.25, 0.5, 0.75, 1.0, 1.5
    ];
    const LAYER_MOD = [
        160, 160, 160, 32, 64,
    ]

    // Update background layer positions
    for(let i = 0; i < this.layerPos.length; ++ i) {

        this.layerPos[i] += LAYER_SPEEDS[i] * tm;
        this.layerPos[i] %= LAYER_MOD[i];
    }
}


// Draw background
Stage.prototype.drawBackground = function(g, cam) {

    // Draw sky & clouds
    g.drawBitmap(g.bitmaps.sky, 0, 0);
    for(let i = 0; i < 2; ++ i)
        g.drawBitmap(g.bitmaps.clouds, 
            i*160 - Math.floor(this.layerPos[0]), 0);

    // Draw houses
    for(let i = 0; i < 2; ++ i)
        g.drawBitmap(g.bitmaps.houses, 
            i*160 - Math.floor(this.layerPos[1]), 20);

    // Draw bush
    for(let i = 0; i < 2; ++ i)
        g.drawBitmap(g.bitmaps.bush, 
            i*160 - Math.floor(this.layerPos[2]), 44);

    // Draw fence
    let p = -Math.floor(this.layerPos[3]);
    let len = ((160/32)|0) + 2;
    let start = (-p/32) |0;
    for(let i = start; i < start+len; ++ i) {

        g.drawBitmap(g.bitmaps.fence, 
            i*32 - Math.floor(this.layerPos[3]), 76);
    }

    // Draw grass
    p = -Math.floor(this.layerPos[4]);
    len = ((160/64)|0) +2;
    start = (-p/64) |0;
    for(let i = start; i < start+len; ++ i) {

        g.drawBitmap(g.bitmaps.grass,
             i*64 - Math.floor(this.layerPos[4]), 144-16-32);
    }
}


// Draw
Stage.prototype.draw = function(g, cam) {

    // ...
}


// Player collision
Stage.prototype.playerCollision = function(pl, tm) {

    // ...
}
