class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOverScene");
        this.my = {sprite: {}, text: {}};
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("skull", "tile_0122.png");
    }

    create() {
        let my = this.my;
        
        let background = this.add.image(0, 0, "background").setOrigin(0, 0);
        background.setDisplaySize(game.config.width, game.config.height);

        my.sprite.skull = this.add.sprite(game.config.width/2, game.config.height/2 - 265, "skull");
        my.sprite.skull.setScale(11);

        my.text.GameOverText = this.add.text(game.config.width/2, game.config.height/2 - 150, "Game Over!", {
            fontFamily: 'Times, serif',
            fontSize: 80,
            color: '#ff0000'
        }).setOrigin(0.5);

        let recentScore = this.registry.get('latestScore');
        my.text.recentScoreText = this.add.text(game.config.width/2, game.config.height/2 - 25, "Your Score: " + recentScore, {
            fontFamily: 'Times, serif',
            fontSize: 40,
        }).setOrigin(0.5);

        let highScore = this.registry.get('HighScore');
        my.text.highestScoreText = this.add.text(game.config.width/2, game.config.height/2 + 25, "High Score: " + highScore, {
            fontFamily: 'Times, serif',
            fontSize: 30,
        }).setOrigin(0.5);

        //play again button
        my.text.playAgain = this.add.text(game.config.width/2, 500, "Play Again?", {
            fontFamily: 'Times, serif',
            fontSize: 40,
            color: '#1E90FF'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        my.text.playAgain.on('pointerdown', () => {
            this.scene.start("levelScene");
        });

        my.text.playAgain.on('pointerover', () => {
            my.text.playAgain.setStyle({ fill: '#87CEFA' });
        });
        my.text.playAgain.on('pointerout', () => {
            my.text.playAgain.setStyle({ fill: '#1E90FF' });
        });

        //return to menu button
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