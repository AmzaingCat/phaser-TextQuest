
export default class PlayerManager {
    constructor() {
        this.inventory = {};
        this.collectedItems = new Set();
        this.maxHp = 100;
        this.hp  = this.maxHp;
        this.name = 'Hero';
    }

    reset() {
        this.inventory = {};
        this.collectedItems = new Set();
        this.hp = this.maxHp;
    }

    addInventory(itemId) {
        if(!this.inventory[itemId]) {
            this.inventory[itemId] = 1;
        } else {
            this.inventory[itemId]++;
        }
    }

    removeInventory(itemId) {
        if (this.inventory[itemId]) {
            this.inventory[itemId]--;
            if (this.inventory[itemId] <= 0) {
                delete this.inventory[itemId];
            }
        }
    }

    hasItem(itemId) {
        return !!this.inventory[itemId];
    }

    getItemCount(itemId) {
        return this.inventory[itemId] || 0;
    }

    addCollectedItem(uniqueId) {
        this.collectedItems.add(uniqueId);
    }

    hasCollected(uniqueId) {
        return this.collectedItems.has(uniqueId);
    }
}