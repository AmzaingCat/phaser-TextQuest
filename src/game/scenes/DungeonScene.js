import Phaser from 'phaser';
import { Player } from '../Player';

export class DungeonScene extends Phaser.Scene {
  constructor() {
    super('DungeonScene');
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('dungeontiles', 'tiles');
    map.createLayer('Ground', tileset, 0, 0);

    // Set tile size
    this.tileSize = map.tileWidth;

    // create player instance
    this.player = new Player(this, 5, 5, 'player', this.tileSize)

    var cam = this.cameras.main;

    cam.setBackgroundColor(0x000000);
    cam.startFollow(this.player);
    cam.setZoom(3);

  }

  update() {
    this.player.update();
  }
}
