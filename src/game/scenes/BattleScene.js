import Phaser from 'phaser';

export class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });
    }

    create(data) {
        // Load the player and enemy data
        this.player = data.player;
        this.enemy = data.enemy;

        this.turn = 'player';

        this.createBattleUI();
        this.showMessage('A wild '+ this.enemy.name +' appears!');
    }

    createBattleUI() {
        // Placeholder health display
        this.playerHPText = this.add.text(20, 20, `${this.player.name}: ${this.player.hp} HP`, { fontSize: '16px' });
        this.enemyHPText = this.add.text(300, 20, `${this.enemy.name}: ${this.enemy.hp} HP`, { fontSize: '16px' });

        // Actions
        this.attackButton = this.add.text(20, 100, 'Attack', { backgroundColor: '#000000', padding: 10 })
        .setInteractive()
        .on('pointerdown', () => this.handlePlayerAttack());
    }

    handlePlayerAttack() {
        if (this.turn !== 'player') return;

        this.enemy.hp -= 10;
        this.showMessage(`${this.player.name} attacks!`);
        this.updateUI();

        this.turn = 'enemy';
        this.time.delayedCall(1000, ()=> this.handleEnemyTurn(), [], this);
    }

    handleEnemyTurn() {
        this.player.hp -= 5;
        this.showMessage(`${this.enemy.name} hits back!`);
        this.updateUI();

        this.turn = 'player';
    }

    updateUI() {
        this.playerHPText.setText(`${this.player.name}: ${this.player.hp} HP`);
        this.enemyHPText.setText(`${this.enemy.name}: ${this.enemy.hp} HP`);
    }

    showMessage(text) {
        console.log(text);
    }
}