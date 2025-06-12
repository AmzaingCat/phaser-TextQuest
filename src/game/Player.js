import Phaser from "phaser";

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, collisionLayer, texture = 'player', tileSize = 32) {
        super(scene, x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, texture);

        this.scene = scene;
        this.tileSize = tileSize;
        this.tileX = x;
        this.tileY = y;
        this.collisionLayer = collisionLayer;

        this.inventory = [];

        this.isMoving = false;

        // add player sprite to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);

        //enable keyboard input
        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    update() {
        if(this.isMoving) return;

        if(Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
            this.move(-1,0);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            this.move(1,0);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.move(0,-1);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            this.move(0,1);
        }
    }

    move(dx, dy) {
        const newTileX = this.tileX + dx;
        const newTileY = this.tileY + dy;

        // check for collision tile at new position
        const tile = this.collisionLayer.getTileAt(newTileX, newTileY);

        if (tile && tile.properties.collides) {
            // tile is collidable; do not move
            return;
        }

        // check for locked door at new tile postion
        const door = this.scene.doorManager?.doors.find(d => {
            const doorTileX = Math.floor(d.x / this.tileSize);
            const doorTileY = Math.floor((d.y - this.tileSize) / this. tileSize);
            return doorTileX === newTileX && doorTileY === newTileY;
        });

        if (door?.isLocked && !this.inventory?.includes(door.requiredKey)) {
            console.log(`Cannot move: Door is locked. Requires key ${door.requiredKey}`);
            return;
        }

        // if everything is ok, proceed
        this.tileX = newTileX;
        this.tileY = newTileY;
        this.isMoving = true;

        this.scene.tweens.add({
            targets: this,
            x: this.tileX * this.tileSize + this.tileSize / 2,
            y: this.tileY * this.tileSize + this.tileSize / 2,
            duration: 100,
            onComplete: () => {
                this.isMoving = false;

                // Notify scene to update fog
                if(this.scene.fog) {
                    this.scene.fog.update(this.x, this.y);
                }
            }
        });
    }
}