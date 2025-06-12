
export default class LootManager {
    constructor(scene, player, map, tilesetName) {
        this.scene = scene;
        this.player = player;
        this.map;

        this.loot = [];

        const tileset = map.tilesets.find(ts => ts.name === tilesetName);
        const firstgid = tileset.firstgid;

        const lootObjects = map.getObjectLayer("Loot")?.Objects || [];

        lootObjects.forEach(obj => {
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
        player.inventory = player.inventory || [];
        player.invetory.push(item.itemId);

        item.destroy();
    }
}