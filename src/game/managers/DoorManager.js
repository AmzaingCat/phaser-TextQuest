
export default class DoorManager {
    constructor(scene, player, map, tilesetName) {
        this.scene = scene;
        this.player = player;
        this.map = map;

        this.doors = [];

        const tileset = map.tilesets.find(ts => ts.name === tilesetName);
        const firstgid = tileset.firstgid;

        const doorObjects = map.getObjectLayer("DoorObject")?.objects || [];

        doorObjects.forEach(obj => {
            const frame = obj.gid ? obj.gid - firstgid : undefined;

            const door = obj.gid
                ? scene.add.sprite(obj.x, obj.y, tilesetName, frame).setOrigin(0, 1)
                : scene.add.rectangle(obj.x, obj.y, obj.width, obj.height, 0x8844ff, 0.3).setOrigin(0, 1);

            // attach custom properties
            if (obj.properties) {
                obj.properties.forEach(prop => {
                    door[prop.name] = prop.value;
                });
            }

            // enable physics
            scene.physics.add.existing(door, true);
            
            this.doors.push(door);
        })

        // set up overlap check
        scene.physics.add.overlap(player, this.doors, this.onOverlap, null, this);
    }

    onOverlap(player, door) {
        console.log(`Going to scene ${door.targetScene} at (${door.entryX}, ${door.entryY})`);

        // teleport logic (same scene or different)
        if (door.targetScene && door.targetScene !== this.scene.scene.key) {
            this.scene.scene.start(door.targetScene, {
                startX: door.entryX,
                startY: door.entryY
            });
        } else {
            // same scene teleport
            const tileSize = this.map.tileWidth;
            player.setPosition(door.entryX * tileSize, door.entryY * tileSize);
        }
    }
}