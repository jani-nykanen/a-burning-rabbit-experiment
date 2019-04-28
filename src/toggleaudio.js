// Toggle audio screen
// (c) 2019 Jani Nykänen


// Constructor
let ToggleAudio = function() {

    this.name = "toggle_audio";

    // Cursor position
    this.cpos = 0;
}


// Draw a box
ToggleAudio.prototype.drawBox = function(g, x, y, w, h) {

    g.fillRect(x-2, y-2, w+4, h+4, {r:255, g:255, b:255});
    g.fillRect(x-1, y-1, w+2, h+2, {r:0, g:0, b:0});
    g.fillRect(x, y, w, h, {r:85, g:85, b:85});
}


// Initialize
ToggleAudio.prototype.init = function(evMan) {
    

}


// On load
ToggleAudio.prototype.onLoad = function(assets) {

    // ...
}


// Update
ToggleAudio.prototype.update = function(evMan, tm) {


    // Check key presses
    if(evMan.vpad.buttons.start.state == State.Pressed ||
       evMan.vpad.buttons.fire1.state == State.Pressed ) {

        // Change scene to title
        evMan.changeScene("title");
        evMan.transition.activate(Fade.Out, 1.0, 
            null, {r:0,g:0,b:0}, 16, Effect.Bars);
            
        // Toggle audio
        evMan.audio.toggle(this.cpos == 0);
    }

    // Update cursor
    let s = evMan.vpad.stick;
    let d = evMan.vpad.stickDelta;
    if( (s.y < 0 && d.y < 0 ) || (s.y > 0 && d.y > 0) ) {

        this.cpos = this.cpos == 0 ? 1 : 0;
    }
}


// Draw
ToggleAudio.prototype.draw = function(g) {

    const BOX_Y = 32;
    const BOX_H = 32;

    g.clear(0, 0, 0);

    // Box
    this.drawBox(g, g.canvas.width/2-64-2,BOX_Y-2, 128, BOX_H);

    // Draw text
    g.drawText(g.bitmaps.font, "ENABLE AUDIO?\nPRESS ENTER TO\nCONFIRM.", 
        g.canvas.width/2-64, BOX_Y, 
        0, 2);

    // Small box
    this.drawBox(g, 32-2,BOX_Y+BOX_H+8-2, 40, 24);

    let str = (this.cpos == 0 ? "\6" : "\0") + "YES";
    g.drawText(g.bitmaps.font, str,
        32, BOX_Y+BOX_H+8, 0, 0);
    str = (this.cpos == 1 ? "\6" : "\0") + "NO";
    g.drawText(g.bitmaps.font, str,
        32, 
        BOX_Y+BOX_H+18,
        0, 0);    
}
