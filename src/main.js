// Tristan Chen
// Created: 5/1/2025
// Phaser: 3.70.0
//
// Solo Rebel-ing
//
// CMPM 120 Game 2
// 
// Art assets from Kenny Assets:
// https://kenney.nl/assets/space-shooter-redux
// https://kenney.nl/assets/space-shooter-extension

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    fps: { forceSetTimeOut: true, target: 30 },
    width: 1100,
    height: 700,
    scene: [Title, Credits, Controls, Level, GameOver]
}

const game = new Phaser.Game(config);