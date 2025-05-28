import { BaseRoomScene } from "./BaseRoomScene";

export class DungeonScene extends BaseRoomScene {
  constructor() {
    super('DungeonScene');
  }

  create(data) {
    this.createBase(data, 'DungeonScene');
  }
}
