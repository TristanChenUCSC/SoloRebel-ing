class Level extends Phaser.Scene {
    constructor() {
        super("levelScene");
        this.my = {sprite: {}};

        //Player starting location
        this.playerX = game.config.width/2;
        this.playerY = game.config.height - 45;

        //Player bullet settings
        this.my.sprite.bullet = [];   
        this.maxBullets = 2;           
        this.bulletCooldown = 30;        
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

        //Wave movement
        this.waveBounds = {
            x: 260,
            y: 85,
            width: 580,
            height: 270
        };
        this.waveDirection = 1;
        this.waveSpeed = 2;
        this.forwardMovement = 25;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("background", "blue.png");

        this.load.image("player", "playerShip1_blue.png");
        this.load.image("laser", "laserGreen12.png");
        this.load.image("enemyLaser", "laserRed06.png");
        this.load.image("bigEnemyLaser", "laserRed11.png");
        this.load.image("fighter", "spaceShips_001.png");
        this.load.image("juggernaut", "spaceShips_007.png");

        this.load.audio("pewFriendly", "laserSmall_004.ogg");
        this.load.audio("explosion", "explosionCrunch_000.ogg");
        this.load.audio("damage", "impactMetal_003.ogg");
    }

    create() {
        let my = this.my;
        
        let fighterX = 300;
        let fighterY = 200;

        let juggernautX = 350;
        let juggernautY = 130;

        let background = this.add.image(0, 0, "background").setOrigin(0, 0);
        background.setDisplaySize(game.config.width, game.config.height);

        //delete later
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(2, 0xff0000);
        this.graphics.strokeRect(this.waveBounds.x, this.waveBounds.y, this.waveBounds.width, this.waveBounds.height);

        //Player
        my.sprite.player = this.add.sprite(this.playerX, this.playerY, "player");
        my.sprite.player.setScale(0.75);

        //create fighters
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
        for (let i = 0; i < this.numJuggernauts; i++) {
            let juggernaut = this.add.sprite(juggernautX, juggernautY, "juggernaut");
            my.sprite.juggernauts.push(juggernaut);
            juggernaut.setScale(0.5);
            juggernaut.hp = 3;
            juggernautX += 200;
        }

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

        //Key objects
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        let my = this.my;
        this.bulletCooldownCounter -= 1;

        if (this.aKey.isDown) {
            if (my.sprite.player.x > 70) {
                my.sprite.player.x -= 10;
            }
        }

        if (this.dKey.isDown) {
            if (my.sprite.player.x < game.config.width - 70) {
                my.sprite.player.x += 10;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
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
                        this.sound.play("explosion", {
                            volume: 1
                        });
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
                            this.sound.play("explosion", {
                                volume: 1
                            });
                            juggernaut.x = -100;
                            juggernaut.y = 0;
                        }
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
                        break;
                    }
                }
            }
        }

        //Juggernaut shooting mechanics
        for (let juggernaut of my.sprite.juggernauts) {
            if (juggernaut.visible && Phaser.Math.Between(1, 100) <= 2) { 
                for (let bullet of my.sprite.bigEnemyBullets) {
                    if (!bullet.visible) {
                        this.enemyShoot(juggernaut, bullet);
                        break;
                    }
                }
            }
        }

        //Enemy bullet movement and collisions
        for (let bullet of my.sprite.enemyBullets) {
            if (bullet.visible) {
                bullet.y += 10;
            }
            if (bullet.y > game.config.height + (bullet.displayHeight/2)) {
                bullet.visible = false;
            }
        }

        for (let bullet of my.sprite.bigEnemyBullets) {
            if (bullet.visible) {
                bullet.y += 15;
            }
            if (bullet.y > game.config.height + (bullet.displayHeight/2)) {
                bullet.visible = false;
            }
        }

        //Wave movement
        
        this.waveBounds.x += this.waveDirection * this.waveSpeed;
        this.graphics.clear(); //delete later
        this.graphics.lineStyle(2, 0xff0000);
        this.graphics.strokeRect(this.waveBounds.x, this.waveBounds.y, this.waveBounds.width, this.waveBounds.height);
        if (this.waveBounds.x <= 0 || this.waveBounds.x + this.waveBounds.width >= game.config.width) {
            this.waveBounds.y += this.forwardMovement;
            this.waveDirection *= -1;
        }

        for (let fighter of my.sprite.fighters) {
            fighter.x += this.waveDirection * this.waveSpeed;
            if (this.waveBounds.x <= 0 || this.waveBounds.x + this.waveBounds.width >= game.config.width) {
                fighter.y += this.forwardMovement;
            }
        }

        for (let juggernaut of my.sprite.juggernauts) {
            juggernaut.x += this.waveDirection * this.waveSpeed;
            if (this.waveBounds.x <= 0 || this.waveBounds.x + this.waveBounds.width >= game.config.width) {
                juggernaut.y += this.forwardMovement;
            }
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
}