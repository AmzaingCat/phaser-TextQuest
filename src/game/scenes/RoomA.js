import Phaser from "phaser";
import { Player } from "../Player";
import FogOfWar from "../FogOfWar";
import DoorManager from "../DoorManager";

export class RoomA extends Phaser.Scene {
    constructor() {
        super('RoomA');
    }

    create(data) {
        const map = this.make.tilemap({ key: 'RoomA' });
        const tileset = map.addTilesetImage('dungeontiles', 'tiles');
        const groundLayer = map.createLayer('Ground', tileset);
        const wallLayer = map.createLayer('Wall', tileset);
        this.doorLayer = map.createLayer('DoorLayer', tileset);

        wallLayer.setCollisionByProperty({ collides:true });

        this.tileSize = map.tileWidth;

        const startX = data.startX ?? 6;
        const startY = data.startY ?? 7;

        this.player = new Player(this, startX, startY, wallLayer, 'player', this.tileSize);
        this.doorManager = new DoorManager(this, this.player, map, "dungeontiles");
        this.fog = new FogOfWar(this, 100);
        this.fog.update(this.player.x, this.player.y);

        this.physics.add.collider(this.player, wallLayer);

        

        const cam = this.cameras.main;

        cam.startFollow(this.player);
        cam.setZoom(3);
    }

    update() {
        this.player.update();

        const playerTileX = this.doorLayer.worldToTileX(this.player.x);
        const playerTileY = this.doorLayer.worldToTileY(this.player.y);

        const doorTile = this.doorLayer.getTileAt(playerTileX, playerTileY);

        if (doorTile) {
            console.log("Player is on a door tile!");
            // trigger door open, change room, etc
        }
    }
}