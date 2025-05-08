class Title extends Phaser.Scene {
    constructor() {
        super("titleScene");
        this.my = {sprite: {}, text: {}};
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("background", "blue.png");
        
    }

    create() {
        let my = this.my;
        
        let background = this.add.image(0, 0, "background").setOrigin(0, 0);
        background.setDisplaySize(game.config.width, game.config.height);

        my.text.Title = this.add.text(game.config.width/2, game.config.height/2 - 150, "Solo Rebel-ing", {
            fontFamily: 'Times, serif',
            fontSize: 160,
            color: '#00BFFF'
        }).setOrigin(0.5);

        my.text.play = this.add.text(game.config.width/2, 500, "Play", {
            fontFamily: 'Times, serif',
            fontSize: 90,
            color: '#008000'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        my.text.play.on('pointerdown', () => {
            this.scene.start("controlsScene");
        });

        my.text.play.on('pointerover', () => {
            my.text.play.setStyle({ fill: '#90EE90' });
        });
        my.text.play.on('pointerout', () => {
            my.text.play.setStyle({ fill: '#008000' });
        });

        my.text.credits = this.add.text(game.config.width/2, 600, "Credits", {
            fontFamily: 'Times, serif',
            fontSize: 40,
            color: '#1E90FF'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        my.text.credits.on('pointerdown', () => {
            this.scene.start("creditsScene");
        });

        my.text.credits.on('pointerover', () => {
            my.text.credits.setStyle({ fill: '#87CEFA' });
        });
        my.text.credits.on('pointerout', () => {
            my.text.credits.setStyle({ fill: '#1E90FF' });
        });

    }

    update() {

    }

}