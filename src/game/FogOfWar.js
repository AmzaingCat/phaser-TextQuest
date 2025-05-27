
export default class FogOfWar {
    constructor(scene, radius = 100) {
        this.scene = scene;
        this.radius = radius;

        // create full-screen black overlay
        this.fog = scene.add.graphics({ fillStyle: { color: 0x000000, alpha: 1} });
        this.fog.fillRect(0,0, scene.game.config.width, scene.game.config.height);
        
        // create the shape that will act as the mask
        this.maskShape = scene.make.graphics({ x:0, y:0, add: false});
        this.mask = this.maskShape.createGeometryMask();
        this.mask.invertAlpha = true;
        this.fog.setMask(this.mask);
    }

    update(playerX, playerY) {
        this.maskShape.clear();
        this.maskShape.fillStyle(0xffffff);
        this.maskShape.beginPath();

        // define rectangle dimensions
        const width = this.radius * 2;
        const height = this.radius * 2;

        // draw rectangle centered on player postion
        this.maskShape.fillRect(
            playerX - this.radius,
            playerY - this.radius,
            width,
            height
        );
    }

    destroy() {
        this.fog.destroy();
        this.maskShape.destroy();
    }

}