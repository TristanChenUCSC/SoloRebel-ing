class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
        this.my = {sprite: {}, text: {}};
    }

    preload() {
        this.load.setPath("./assets/");
    }

    create() {
        let my = this.my;
        
        let background = this.add.image(0, 0, "background").setOrigin(0, 0);
        background.setDisplaySize(game.config.width, game.config.height);

        let creditsStr = "Art & Audio Assets:     Kenny Assets\n\n\nGame developed by:     Tristan Chen";

        my.text.Title = this.add.text(game.config.width/2, game.config.height/2 - 250, "Credits", {
            fontFamily: 'Times, serif',
            fontSize: 100,
            color: '#00BFFF'
        }).setOrigin(0.5);

        my.text.creditsText = this.add.text(game.config.width/2, game.config.height/2 - 100, creditsStr, {
            fontFamily: 'Times, serif',
            fontSize: 26,
        }).setOrigin(0.5);

        my.text.creditsText = this.add.text(game.config.width/2, game.config.height/2 + 100, "Made with Phaser Framework", {
            fontFamily: 'Times, serif',
            fontSize: 26,
        }).setOrigin(0.5);

        my.text.returnToMenu = this.add.text(game.config.width/2, 600, "Return to Menu", {
            fontFamily: 'Times, serif',
            fontSize: 30,
            color: '#1E90FF'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        my.text.returnToMenu.on('pointerdown', () => {
            this.scene.start("titleScene");
        });

        my.text.returnToMenu.on('pointerover', () => {
            my.text.returnToMenu.setStyle({ fill: '#87CEFA' });
        });
        my.text.returnToMenu.on('pointerout', () => {
            my.text.returnToMenu.setStyle({ fill: '#1E90FF' });
        });
    }

    update() {

    }

}