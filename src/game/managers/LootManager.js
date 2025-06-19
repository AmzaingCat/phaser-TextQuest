
export default class LootManager {
    constructor(scene, player, map, tilesetName) {
        this.scene = scene;
        this.player = player;
        this.map = map;

        this.loot = [];
        this.playerManager = this.scene.game.playerManager;

        const tileset = map.tilesets.find(ts => ts.name === tilesetName);
        const firstgid = tileset.firstgid;

        const lootObjects = map.getObjectLayer("Loot")?.objects || [];

        lootObjects.forEach(obj => {
            // Get itemId from custom properties
            let uniqueId = null;
            if(obj.properties) {
                obj.properties.forEach(prop => {
                    if (prop.name === 'uniqueId') uniqueId = prop.value;
                });
            }
            // Skip if already collected
            if(this.playerManager.hasCollected(uniqueId)) {
                return;
            }

            const frame = obj.gid ? obj.gid - firstgid : undefined;

            const item = obj.gid
            ? scene.add.sprite(obj.x, obj.y, tilesetName, frame).setOrigin(0, 1)
            : scene.add.rectangle(obj.x, obj.y, obj.width, obj.height, 0x00ff00, 0.3).setOrigin(0, 1);

            if (obj.properties) {
                obj.properties.forEach(prop => {
                    item[prop.name] = prop.value;
                });
            }

            scene.physics.add.existing(item, true);
            this.loot.push(item);
        })

        scene.physics.add.overlap(player, this.loot, this.collectItem, null, this);
    }

    collectItem(player, item) {
        console.log(`Picked up ${item.itemId}`);
        this.playerManager.addCollectedItem(item.uniqueId);
        this.playerManager.addItem(item.itemId);

        item.destroy();
    }
}