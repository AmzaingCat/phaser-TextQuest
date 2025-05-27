import Phaser from 'phaser';
import { Player } from '../Player';
import FogOfWar from '../FogOfWar';

export class DungeonScene extends Phaser.Scene {
  constructor() {
    super('DungeonScene');
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('dungeontiles', 'tiles');
    const groundLayer = map.createLayer('Ground', tileset, 0, 0);
    const wallLayer = map.createLayer('Wall', tileset);

    wallLayer.setCollisionByProperty({ collides: true});

    // Set tile size
    this.tileSize = map.tileWidth;

    // create player instance
    this.player = new Player(this, 6, 5, wallLayer, 'player', this.tileSize)

    this.fog = new FogOfWar(this, 100);
    this.fog.update(this.player.x, this.player.y);

    this.physics.add.collider(this.player, wallLayer);

    var cam = this.cameras.main;

    //cam.setBackgroundColor(0x000000);
    cam.startFollow(this.player);
    cam.setZoom(3);

  }

  update() {
    this.player.update();
  }
}
