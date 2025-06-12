import { BaseRoomScene } from "./BaseRoomScene";

export class RoomB extends BaseRoomScene {
    constructor() {
        super('RoomB');
    }

    create(data) {
        this.createBase(data, 'RoomB');
    }
}