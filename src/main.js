// A template main file
// (c) 2019 Jani Nykänen


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
            life: "life.png",
            logo: "logo.png",
            intro: "intro.png",
            controls: "controls.png",
        },

        // Documents
        docPath: "assets/maps",
        documents: { },

        // Samples
        soundPath: "assets/audio",
        sounds: { 
            coin: "coin.wav",
            jump: "jump.wav",
            die: "die.wav",
            bounce: "bounce.wav",
            life: "life.wav",
            start: "start.wav",
            pause: "pause.wav",
            flap: "flap.wav",
            spawn: "spawn.wav",
            ready: "ready.wav",
            go: "go.wav",
            gold: "gold.wav",
            //theme: "theme.ogg",
            //title: "title.ogg",
        },
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
    c.addScene(new ToggleAudio(), true);
    c.addScene(new Title(), false);
    c.addScene(new Game(), false);
    c.addScene(new Global(), false, true);

    // Run application
    c.run(framerate, assetContent, gamepadConfig);
}
