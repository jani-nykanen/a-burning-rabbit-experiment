// A template main file
// (c) Insert your name here


// The main function
let main = function() {

    // Assets
    let assetContent = {

        // Bitmaps
        bitmapPath: "assets/bitmaps",
        bitmaps: {
            font: "font.png",
            sky: "sky.png",
            clouds: "clouds.png",
            houses: "houses.png",
            bush: "bush.png",
            fence: "fence.png",
            grass: "grass.png",
            mushrooms: "mushrooms.png",
            bunny: "bunny.png",
            coin: "coin.png",
        },

        // Documents
        docPath: "assets/maps",
        documents: { },

        // Samples
        soundPath: "assets/audio",
        sounds: { },
    }

    // Gamepad config
    let gamepadConfig = {

        buttons: {
            fire1: 90,
            fire2: 88,
            start: 13,
            cancel: 27, 
        }
    }
    // Derired framerate
    let framerate = 30;


    // Create application core
    let c = new Core();

    // Add scenes
    // Help: addScene(scene, makeActive=false, makeGlobal=false)
    c.addScene(new Game(), true);
    c.addScene(new Global(), false, true);
    // Add more scenes here

    // Run application
    c.run(framerate, assetContent, gamepadConfig);
}
