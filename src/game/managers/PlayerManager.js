
export default class PlayerManager {
    constructor() {
        this.inventory = [];
        this.hp = 100;
        this.name = 'Hero';
    }

    addItem(item) {
        if(!this.inventory.includes(item)) {
            this.inventory.push(item);
        }
    }

    hasItem(itemName) {
        return this.inventory.includes(itemName);
    }

    removeItem(itemName) {
        const index = this.inventory.indexOf(itemName);
        if (index !== -1) {
            this.inventory.splice(index, 1);
        }
    }
}