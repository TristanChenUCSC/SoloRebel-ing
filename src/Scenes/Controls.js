class Controls extends Phaser.Scene {
    constructor() {
        super("controlsScene");
        this.my = {sprite: {}, text: {}};
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.image("fighter", "spaceShips_001.png");
        this.load.image("bomber", "spaceShips_006.png");
        this.load.image("juggernaut", "spaceShips_007.png");
    }

    create() {
        let my = this.my;
        
        let background = this.add.image(0, 0, "background").setOrigin(0, 0);
        background.setDisplaySize(game.config.width, game.config.height);

        my.text.Controls = this.add.text(game.config.width/2, game.config.height/2 - 250, "Controls", {
            fontFamily: 'Times, serif',
            fontSize: 70,
            color: '#FFD700'
        }).setOrigin(0.5);

        my.text.desc = this.add.text(game.config.width/2, game.config.height/2 - 170, 
            "You are a rebel fighting against the corrupt government that rules the universe! Defeat all the enemy ships without getting hit! Do NOT let them get too close!", {
            fontFamily: 'Times, serif',
            fontSize: 26,
            wordWrap: {
                width: 900
            }
        }).setOrigin(0.5);

        my.text.Left = this.add.text(game.config.width/2, game.config.height/2 - 100, "Hold 'A' to move left", {
            fontFamily: 'Times, serif',
            fontSize: 26,
            color: '#87CEEB'
        }).setOrigin(0.5);

        my.text.Right = this.add.text(game.config.width/2, game.config.height/2 - 70, "Hold 'D' to move right", {
            fontFamily: 'Times, serif',
            fontSize: 26,
            color: '#87CEEB'
        }).setOrigin(0.5);

        my.text.Shoot = this.add.text(game.config.width/2, game.config.height/2 - 40, "Press 'SPACE' to shoot", {
            fontFamily: 'Times, serif',
            fontSize: 26,
            color: '#87CEEB'
        }).setOrigin(0.5);


        my.sprite.fighterIcon = this.add.sprite(game.config.width/2 - 60, game.config.height/2 + 20, "fighter");
        my.sprite.fighterIcon.setScale(0.5)
        my.text.fighterPoints = this.add.text(game.config.width/2 + 30, game.config.height/2 + 20, "+100 pts", {
            fontFamily: 'Times, serif',
            fontSize: 24,
        }).setOrigin(0.5);


        my.sprite.bomberIcon = this.add.sprite(game.config.width/2 - 60, game.config.height/2 + 80, "bomber");
        my.sprite.bomberIcon.setScale(0.35)
        my.text.bomberPoints = this.add.text(game.config.width/2 + 30, game.config.height/2 + 80, "+500 pts", {
            fontFamily: 'Times, serif',
            fontSize: 24,
        }).setOrigin(0.5);


        my.sprite.juggernautIcon = this.add.sprite(game.config.width/2 - 60, game.config.height/2 + 150, "juggernaut");
        my.sprite.juggernautIcon.setScale(0.5)
        my.text.juggernautPoints = this.add.text(game.config.width/2 + 40, game.config.height/2 + 150, "+1000 pts", {
            fontFamily: 'Times, serif',
            fontSize: 24,
        }).setOrigin(0.5);

        my.text.wavePoints = this.add.text(game.config.width/2, game.config.height/2 + 230, "+5000 pts on clearing a wave", {
            fontFamily: 'Times, serif',
            fontSize: 24,
        }).setOrigin(0.5);

        my.text.continue = this.add.text(game.config.width/2, game.config.height - 40, "Continue...", {
            fontFamily: 'Times, serif',
            fontSize: 40,
            color: '#FFFF00',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        my.text.continue.on('pointerdown', () => {
            this.scene.start("levelScene");
        });

        my.text.continue.on('pointerover', () => {
            my.text.continue.setStyle({ fill: '#90EE90' });
        });
        my.text.continue.on('pointerout', () => {
            my.text.continue.setStyle({ fill: '#FFFF00' });
        });
    }

    update() {

    }

}