import Phaser from 'phaser';
import { Player } from '../Player';
import FogOfWar from '../FogOfWar';
import DoorManager from '../DoorManager';
import LootManager from './LootManager';

export class BaseRoomScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    createBase(data, mapKey) {
        const map = this.make.tilemap({ key: mapKey });
        const tileset = map.addTilesetImage('dungeontiles', 'tiles');
        const groundLayer = map.createLayer('Ground', tileset);
        const wallLayer = map.createLayer('Wall', tileset);
        this.doorLayer = map.createLayer('DoorLayer', tileset);

        wallLayer.setCollisionByProperty({ collides: true });

        this.tileSize = map.tileWidth;

        const startX = data.startX ?? 6;
        const startY = data.startY ?? 5;

        this.player = new Player(this, startX, startY, wallLayer, 'player', this.tileSize);
        this.doorManager = new DoorManager(this, this.player, map, 'dungeontiles');
        this.lootManager = new LootManager(this, this.player, map, 'dungeonitems');
        this.fog = new FogOfWar(this, 100);
        this.fog.update(this.player.x, this.player.y);

        this.physics.add.collider(this.player, wallLayer);

        const cam = this.cameras.main;
        cam.setBackgroundColor(0x000000);
        cam.startFollow(this.player);
        cam.setZoom(3);
    }

    update() {
        this.player?.update();
    }
}