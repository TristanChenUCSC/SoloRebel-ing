class Level extends Phaser.Scene {
    constructor() {
        super("levelScene");
        this.my = {sprite: {}, text: {}};

        //Player starting location
        this.playerX = game.config.width/2;
        this.playerY = game.config.height - 45;

        //Lives, Score, and other UI stuff
        this.lives = 3;
        this.score = 0;

        //Player bullet settings
        this.my.sprite.bullet = [];   
        this.maxBullets = 2;           
        this.bulletCooldown = 20;        
        this.bulletCooldownCounter = 0;

        //Enemy Bullets
        this.my.sprite.enemyBullets = [];
        this.maxEnemyBullets = 10;
        this.my.sprite.bigEnemyBullets = [];
        this.maxBigEnemyBullets = 2;

        //Enemy type: Fighters
        this.my.sprite.fighters = [];
        this.fightersRow = 3;
        this.fightersCol = 6;

        //Enemy type: Juggernauts
        this.my.sprite.juggernauts = [];
        this.numJuggernauts = 3;

        //Enemy type: Bombers
        this.my.sprite.bombers = [];
        this.numBombers = 6;

        //Wave movement and mechanics
        this.waveBounds = {
            x: 260,
            y: 85,
            width: 580,
            height: 270
        };
        this.waveDirection = 1;
        this.waveSpeed = 2;
        this.forwardMovement = 30;
        this.waitingForWave = false;

        //Bomber movement
        this.bomberSpeed = 12;
        this.activeBomber = false;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("background", "blue.png");

        this.load.image("player", "playerShip1_blue.png");
        this.load.image("laser", "laserGreen12.png");
        this.load.image("enemyLaser", "laserRed06.png");
        this.load.image("bigEnemyLaser", "laserRed11.png");
        this.load.image("fighter", "spaceShips_001.png");
        this.load.image("bomber", "spaceShips_006.png");
        this.load.image("juggernaut", "spaceShips_007.png");
        
        //explosion animations
        this.load.image("explosion00", "explosion00.png");
        this.load.image("explosion01", "explosion01.png");
        this.load.image("explosion02", "explosion02.png");
        this.load.image("explosion03", "explosion03.png");
        this.load.image("explosion04", "explosion04.png");
    
        //sounds
        this.load.audio("pewFriendly", "laserSmall_004.ogg");
        this.load.audio("pewEnemy1", "laserSmall_000.ogg");
        this.load.audio("pewEnemy2", "laserLarge_000.ogg");
        this.load.audio("explosion", "explosionCrunch_000.ogg");
        this.load.audio("damage", "impactMetal_003.ogg");
    }

    create() {
        let my = this.my;
        
        let background = this.add.image(0, 0, "background").setOrigin(0, 0);
        background.setDisplaySize(game.config.width, game.config.height);

        this.endLineY = 580;
        this.endLine = this.add.graphics();
        this.endLine.lineStyle(3, 0xffffff, 0.3);
        this.endLine.beginPath();
        this.endLine.moveTo(0, this.endLineY);           
        this.endLine.lineTo(game.config.width, this.endLineY);         
        this.endLine.strokePath();
        this.enemyTouchedLine = false;

        //Player
        my.sprite.player = this.add.sprite(this.playerX, this.playerY, "player");
        my.sprite.player.setScale(0.75);
        my.sprite.player.invulnerable = false;

        //Create Wave
        this.createWave();

        //Player Bullets
        for (let i = 0; i < this.maxBullets; i++) {
            my.sprite.bullet.push(this.add.sprite(-100, -100, "laser"));
            my.sprite.bullet[i].visible = false;
        }

        //Enemy Bullets
        for (let i = 0; i < this.maxEnemyBullets; i++) {
            my.sprite.enemyBullets.push(this.add.sprite(-100, -100, "enemyLaser"));
            my.sprite.enemyBullets[i].visible = false;
        }

        for (let i = 0; i < this.maxBigEnemyBullets; i++) {
            my.sprite.bigEnemyBullets.push(this.add.sprite(-100, -100, "bigEnemyLaser"));
            my.sprite.bigEnemyBullets[i].visible = false;
            my.sprite.bigEnemyBullets[i].setScale(2);
        }

        //Explosion animation
        this.anims.create({
            key: "explosion",
            frames: [
                { key: "explosion00" },
                { key: "explosion01" },
                { key: "explosion02" },
                { key: "explosion03" },
                { key: "explosion04" },
            ],
            frameRate: 30,
            repeat: 1,
            hideOnComplete: true
        });

        //Key objects
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //UI elements
        my.text.livesText = this.add.text(10, 650, "Lives: " + this.lives, {
            fontFamily: 'Times, serif',
            fontSize: 40,
        });

        my.text.scoreText = this.add.text(10, 0, "Score: " + this.score, {
            fontFamily: 'Times, serif',
            fontSize: 40,
        });

        my.text.newWaveText = this.add.text(game.config.width/2 - 140, game.config.height/2, "New Wave Incoming!!!", {
            fontFamily: 'Times, serif',
            fontSize: 40,
        });
        my.text.newWaveText.visible = false;
    }

    update() {
        let my = this.my;
        this.bulletCooldownCounter -= 1;

        if (this.aKey.isDown && my.sprite.player.visible) {
            if (my.sprite.player.x > 70) {
                my.sprite.player.x -= 12;
            }
        }

        if (this.dKey.isDown && my.sprite.player.visible) {
            if (my.sprite.player.x < game.config.width - 70) {
                my.sprite.player.x += 12;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && my.sprite.player.visible) {
            if (this.bulletCooldownCounter < 0) {
                for (let bullet of my.sprite.bullet) {
                    if (!bullet.visible) {
                        bullet.x = my.sprite.player.x;
                        bullet.y = my.sprite.player.y - (bullet.displayHeight/2);
                        bullet.visible = true;
                        this.sound.play("pewFriendly", {
                            volume: 1
                        });
                        this.bulletCooldownCounter = this.bulletCooldown;
                        break;
                    }
                }
            }
        }
    
        //Player bullet movement and collisions
        for (let bullet of my.sprite.bullet) {
            if (bullet.visible) {
                bullet.y -= 10;
                for (let fighter of my.sprite.fighters) {
                    if(fighter.visible && this.collides(bullet, fighter))
                    {
                        fighter.visible = false;
                        this.score += 100;
                        my.text.scoreText.setText("Score: " + this.score);
                        this.sound.play("explosion", {
                            volume: 1
                        });
                        this.add.sprite(fighter.x, fighter.y, "explosion00").setScale(0.15).play("explosion");
                        fighter.x = -100;
                        fighter.y = 0;
                        bullet.visible = false;
                    }
                }
                for (let juggernaut of my.sprite.juggernauts) {
                    if(juggernaut.visible && this.collides(bullet, juggernaut))
                    {
                        juggernaut.hp--;
                        this.sound.play("damage", {
                            volume: 1
                        });
                        bullet.visible = false;
                        juggernaut.alpha = 0.5;
                        this.time.delayedCall(150, () => {
                            juggernaut.alpha = 1;
                        });

                        if(juggernaut.hp == 0) {
                            juggernaut.visible = false;
                            this.score += 1000;
                            my.text.scoreText.setText("Score: " + this.score);
                            this.sound.play("explosion", {
                                volume: 1
                            });
                            this.add.sprite(juggernaut.x, juggernaut.y, "explosion00").setScale(0.4).play("explosion");
                            juggernaut.x = -100;
                            juggernaut.y = 0;
                        }
                    }
                }
                for (let bomber of my.sprite.bombers) {
                    if(bomber.visible && this.collides(bullet, bomber))
                    {
                        bomber.visible = false;
                        this.score += 500;
                        my.text.scoreText.setText("Score: " + this.score);
                        this.sound.play("explosion", {
                            volume: 1
                        });
                        this.add.sprite(bomber.x, bomber.y, "explosion00").setScale(0.15).play("explosion");
                        bomber.x = -100;
                        bomber.y = 0;
                        bullet.visible = false;
                    }
                }
            }
            if (bullet.y < -(bullet.displayHeight/2)) {
                bullet.visible = false;
            }
        }

        //Fighter shooting mechanics
        for (let fighter of my.sprite.fighters) {
            if (fighter.visible && Phaser.Math.Between(1, 1000) <= 2) { 
                for (let bullet of my.sprite.enemyBullets) {
                    if (!bullet.visible) {
                        this.enemyShoot(fighter, bullet);
                        this.sound.play("pewEnemy1", {
                            volume: 1
                        });
                        break;
                    }
                }
            }
        }

        //Juggernaut shooting mechanics
        for (let juggernaut of my.sprite.juggernauts) {
            if (juggernaut.visible && Phaser.Math.Between(1, 1000) <= 8) { 
                for (let bullet of my.sprite.bigEnemyBullets) {
                    if (!bullet.visible) {
                        this.enemyShoot(juggernaut, bullet);
                        this.sound.play("pewEnemy2", {
                            volume: 1
                        });
                        break;
                    }
                }
            }
        }

        //Enemy bullet movement and collisions
        for (let bullet of my.sprite.enemyBullets) {
            if (bullet.visible) {
                bullet.y += 10;
                if (my.sprite.player.visible && !my.sprite.player.invulnerable && this.collides(bullet, my.sprite.player)) {
                    bullet.visible = false;
                    this.playerDeath();
                }
            }
            if (bullet.y > game.config.height + (bullet.displayHeight/2)) {
                bullet.visible = false;
            }
        }

        for (let bullet of my.sprite.bigEnemyBullets) {
            if (bullet.visible) {
                bullet.y += 15;
                if (my.sprite.player.visible && !my.sprite.player.invulnerable && this.collides(bullet, my.sprite.player)) {
                    bullet.visible = false;
                    this.playerDeath();
                }
            }
            if (bullet.y > game.config.height + (bullet.displayHeight/2)) {
                bullet.visible = false;
            }
        }

        //Bomber Collisions
        for (let bomber of my.sprite.bombers) {
            if(bomber.visible && my.sprite.player.visible && !my.sprite.player.invulnerable && this.collides(bomber, my.sprite.player))
                {
                    bomber.visible = false;
                    this.sound.play("explosion", {
                        volume: 1
                    });
                    this.add.sprite(bomber.x, bomber.y, "explosion00").setScale(0.15).play("explosion");
                    bomber.x = -100;
                    bomber.y = 0;

                    this.playerDeath();
                }
        }


        //Wave movement
        this.waveBounds.x += this.waveDirection * this.waveSpeed;

        if (this.waveBounds.x <= 0 || this.waveBounds.x + this.waveBounds.width >= game.config.width) {
            this.waveBounds.y += this.forwardMovement;
            this.waveDirection *= -1;
        }

        for (let fighter of my.sprite.fighters) {
            if (fighter.visible) {
                fighter.x += this.waveDirection * this.waveSpeed;
                if (this.waveBounds.x <= 0 || this.waveBounds.x + this.waveBounds.width >= game.config.width) {
                    fighter.y += this.forwardMovement;
                }
                if (fighter.y >= this.endLineY) {
                    this.enemyTouchedLine = true;
                }
            }
        }

        for (let juggernaut of my.sprite.juggernauts) {
            if (juggernaut.visible) {
                juggernaut.x += this.waveDirection * this.waveSpeed;
                if (this.waveBounds.x <= 0 || this.waveBounds.x + this.waveBounds.width >= game.config.width) {
                    juggernaut.y += this.forwardMovement;
                }
                if (juggernaut.y >= this.endLineY) {
                    this.enemyTouchedLine = true;
                }
            }
        }

        //Bomber movement and paths
        for (let bomber of my.sprite.bombers) {
            if (!bomber.isActive && bomber.visible) {
                bomber.x += bomber.direction * this.bomberSpeed;
                if (bomber.x <= bomber.originalPosition - 90 || bomber.x >= bomber.originalPosition + 90) {
                    bomber.direction *= -1;
                }
            }
        }

        if (!this.activeBomber && Phaser.Math.Between(1, 100) <= 5) {
            let randomBomber = my.sprite.bombers[Phaser.Math.Between(0, this.numBombers - 1)];
            if (randomBomber.visible) {
                randomBomber.isActive = true;
                this.activeBomber = true;
                let configReturn = {
                    duration: 1000,
                    ease: 'Linear',
                    repeat: 0,
                    rotateToPath: true,
                    rotationOffset: -90,
                    onComplete: () => {
                        randomBomber.stopFollow();
                        randomBomber.isActive = false;
                        this.activeBomber = false;
                    }
                }
                let configMain = {
                    duration: 1800,
                    ease: 'Sine.easeInOut',
                    repeat: 0,
                    rotateToPath: true,
                    rotationOffset: -90,
                    onComplete: () => {
                        this.time.delayedCall(200, () => {
                            randomBomber.stopFollow();
                            randomBomber.x = randomBomber.originalPosition;
                            randomBomber.y = -100;
                            let returnPath = new Phaser.Curves.Path(randomBomber.x, randomBomber.y);
                            returnPath.lineTo(randomBomber.originalPosition, 50);
                            randomBomber.setPath(returnPath);
                            randomBomber.startFollow(configReturn);
                        });
                    }
                };

                let path = new Phaser.Curves.Path(randomBomber.x, randomBomber.y);
                path.splineTo([
                    { x: randomBomber.x + Phaser.Math.Between(-50, 50), y: randomBomber.y + 100},
                    { x: my.sprite.player.x, y: my.sprite.player.y},
                    { x: my.sprite.player.x, y: my.sprite.player.y + 80}
                ]);
                randomBomber.setPath(path);
                randomBomber.startFollow(configMain);
            }
        }

        //Create new wave when all enemies are defeated
        if (!this.waitingForWave) {
            this.waveCleared = true;
        }

        for (let fighter of my.sprite.fighters) {
            if (fighter.visible) {
                this.waveCleared = false;
                break;
            }
        }
        for (let juggernaut of my.sprite.juggernauts) {
            if (juggernaut.visible) {
                this.waveCleared = false;
                break;
            }
        }
        for (let bomber of my.sprite.bombers) {
            if (bomber.visible) {
                this.waveCleared = false;
                break;
            }
        }
        if (this.waveCleared) {
            this.waveCleared = false;
            this.waitingForWave = true;
            this.score += 5000;
            my.text.scoreText.setText("Score: " + this.score);
            my.text.newWaveText.visible = true;

            this.time.delayedCall(3000, () => {
                this.createWave();
                my.text.newWaveText.visible = false;
                this.waveBounds = {
                    x: 260,
                    y: 85,
                    width: 580,
                    height: 270
                };
                this.waveDirection = 1;
                this.waitingForWave = false;
                this.activeBomber = false;
            });
        }

        //End game if fighter or juggernaut touches line
        if (this.enemyTouchedLine) {
            this.resetGame();
            this.scene.start("gameOverScene");
        }
    }

    //collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    enemyShoot(enemy, bullet) {
        bullet.x = enemy.x;
        bullet.y = enemy.y + (bullet.displayHeight/2);
        bullet.visible = true;
    }

    playerDeath() {
        let my = this.my;

        my.sprite.player.visible = false;
        this.lives--;
        my.text.livesText.setText("Lives: " + this.lives);
        if (this.lives <= 0) {
            this.time.delayedCall(650, () => {
                this.resetGame();
                this.scene.start("gameOverScene");
            });
        }

        this.sound.play("explosion", {
            volume: 1
        });
        this.add.sprite(my.sprite.player.x, my.sprite.player.y, "explosion00").setScale(0.15).play("explosion");
        this.time.delayedCall(700, () => {
            my.sprite.player.invulnerable = true;
            my.sprite.player.visible = true;
            my.sprite.player.x = this.playerX;
            my.sprite.player.y = this.playerY;
            
            let invulnerableState = this.tweens.add({
                targets: my.sprite.player,
                alpha: { from: 1, to: 0.3 },
                duration: 100,
                yoyo: true,
                repeat: -1
            });

            this.time.delayedCall(1500, () => {
                invulnerableState.stop();
                my.sprite.player.alpha = 1;
                my.sprite.player.invulnerable = false;
            });
    
        });
    }

    createWave() {
        let my = this.my;
        
        let fighterX = 300;
        let fighterY = 200;

        let juggernautX = 350;
        let juggernautY = 130;

        let bomberX = 105;
        let bomberY = 50;

        //create fighters
        my.sprite.fighters.forEach(fighter => {
            fighter.destroy();
        });
        my.sprite.fighters = [];
        for (let i = 0; i < this.fightersRow; i++) {
            for (let j = 0; j < this.fightersCol; j++) {
                let fighter = this.add.sprite(fighterX, fighterY, "fighter");
                my.sprite.fighters.push(fighter);
                fighter.setScale(0.5);
                fighterX += 100;
            }
            fighterX = 300;
            fighterY += 60;
        }

        //create juggernauts
        my.sprite.juggernauts.forEach(juggernaut => {
            juggernaut.destroy();
        });
        my.sprite.juggernauts = [];
        for (let i = 0; i < this.numJuggernauts; i++) {
            let juggernaut = this.add.sprite(juggernautX, juggernautY, "juggernaut");
            my.sprite.juggernauts.push(juggernaut);
            juggernaut.setScale(0.5);
            juggernaut.hp = 3;
            juggernautX += 200;
        }

        //create bombers
        my.sprite.bombers.forEach(bomber => {
            bomber.destroy();
        });
        my.sprite.bombers = [];
        for (let i = 0; i < this.numBombers; i++) {
            let bomber = this.add.follower(null, bomberX, bomberY, "bomber");
            my.sprite.bombers.push(bomber);
            bomber.setScale(0.35);
            bomber.originalPosition = bomberX;
            bomber.direction = 1;
            bomber.isActive = false;
            bomberX += 175;
        }
    }

    resetGame() {
        let my = this.my;

        this.lives = 3;
        this.score = 0;

        my.sprite.bullet.forEach(bullet => {
            bullet.destroy();
        });
        my.sprite.bullet = []
        this.bulletCooldownCounter = 0;

        my.sprite.enemyBullets.forEach(bullet => {
            bullet.destroy();
        });
        my.sprite.enemyBullets = [];

        my.sprite.bigEnemyBullets.forEach(bullet => {
            bullet.destroy();
        });
        my.sprite.bigEnemyBullets = [];
        this.waveBounds = {
            x: 260,
            y: 85,
            width: 580,
            height: 270
        };
        this.waveDirection = 1;
        this.waitingForWave = false;
        this.activeBomber = false;
    }
}