import { BaseRoomScene } from "./BaseRoomScene";

export class RoomA extends BaseRoomScene {
    constructor() {
        super('RoomA');
    }

    create(data) {
        this.createBase(data, 'RoomA');
    }
}