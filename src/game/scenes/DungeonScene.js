import Phaser from 'phaser';
import { Player } from '../Player';
import FogOfWar from '../FogOfWar';
import DoorManager from '../DoorManager';

export class DungeonScene extends Phaser.Scene {
  constructor() {
    super('DungeonScene');
  }

  create(data) {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('dungeontiles', 'tiles');
    const groundLayer = map.createLayer('Ground', tileset, 0, 0);
    const wallLayer = map.createLayer('Wall', tileset);
    this.doorLayer = map.createLayer('DoorLayer', tileset);

    wallLayer.setCollisionByProperty({ collides: true});

    // Set tile size
    this.tileSize = map.tileWidth;

    const startX = data.startX ?? 6;
    const startY = data.startY ?? 5;

    // create player instance
    this.player = new Player(this, startX, startY, wallLayer, 'player', this.tileSize);
    this.DoorManager = new DoorManager(this, this.player, map, "dungeontiles");
    this.fog = new FogOfWar(this, 100);
    this.fog.update(this.player.x, this.player.y);

    this.physics.add.collider(this.player, wallLayer);

    const cam = this.cameras.main;

    //cam.setBackgroundColor(0x000000);
    cam.startFollow(this.player);
    cam.setZoom(3);

  }

  update() {
    this.player.update();

    // get player tile position on doorLayer
    const playerTileX = this.doorLayer.worldToTileX(this.player.x);
    const playerTileY = this.doorLayer.worldToTileY(this.player.y);

    const doorTile = this.doorLayer.getTileAt(playerTileX, playerTileY);

    if (doorTile) {
      console.log("Player is on a door tile!");
      // trigger door open, change room, etc
    }

  }
}
