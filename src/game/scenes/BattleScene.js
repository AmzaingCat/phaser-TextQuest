import Phaser from 'phaser';
import BattleFSM from '../managers/BattleFSM';

export class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });
    }

    create(data) {
        // Load the player and enemy data
        this.player = data.player;
        this.enemy = data.enemy;

        // Battle UI state
        this.actionTaken = false;
        this.enemyActionDone = false;

        // Create FSM
        this.fsm = new BattleFSM('start');
        this.fsm.addTransition('start', 'player-turn', () => true);
        this.fsm.addTransition('player-turn', 'enemy-turn', () => this.actionTaken);
        this.fsm.addTransition('enemy-turn', 'player-turn', () => this.enemyActionDone);
        this.fsm.addTransition('player-turn', 'win', () => this.enemy.hp <= 0);
        this.fsm.addTransition('enemy-turn', 'lose', () => this.player.hp <= 0);

        // FSM onEnter callbacks
        this.fsm.setOnEnter('player-turn', () => {
            this.actionTaken = false;
            this.showMessage(`${this.player.name}'s turn!`);
        });

        this.fsm.setOnEnter('enemy-turn', () => {
            this.enemyActionDone = false;
            this.showMessage(`${this.enemy.name}'s turn!`);
            this.time.delayedCall(1000, () => this.handleEnemyTurn(), [], this);
        });

        this.fsm.setOnEnter('win', () => {
            this.showMessage(`${this.player.name} defeated ${this.enemy.name}`);
            this.time.delayedCall(2000, () => this.scene.start('SceneStart'), [], this);
        });

        this.fsm.setOnEnter('lose', () => {
            this.showMessage(`${this.player.name} was defeated...`);
            this.time.delayedCall(2000, () => this.scene.start('GameOver'), [], this);
        });

        // Setup UI
        this.createBattleUI();
        this.showMessage('A wild '+ this.enemy.name +' appears!');
    }

    createBattleUI() {
        // Placeholder health display
        this.playerHPText = this.add.text(20, 20, `${this.player.name}: ${this.player.hp} HP`, { fontSize: '16px', fill: '#fff' });
        this.enemyHPText = this.add.text(300, 20, `${this.enemy.name}: ${this.enemy.hp} HP`, { fontSize: '16px', fill: '#fff' });

        // Actions
        this.attackButton = this.add.text(20, 100, 'Attack', {
            backgroundColor: '#000000',
            color: '#ffffff',
            padding: { x: 10, y: 5 }
        }).setInteractive().on('pointerdown', () => this.handlePlayerAttack());
    }

    handlePlayerAttack() {
        if (this.fsm.state !== 'player-turn' || this.actionTaken) return;

        this.enemy.hp -= 10;
        this.showMessage(`${this.player.name} attacks!`);
        this.updateUI();
        this.actionTaken = true;
    }

    handleEnemyTurn() {
        if(this.enemy.hp <= 0) return;

        this.player.hp -= 5;
        this.showMessage(`${this.enemy.name} hits back!`);
        this.updateUI();

        this.enemyActionDone= true;
    }

    updateUI() {
        this.playerHPText.setText(`${this.player.name}: ${this.player.hp} HP`);
        this.enemyHPText.setText(`${this.enemy.name}: ${this.enemy.hp} HP`);
    }

    showMessage(text) {
        console.log(text);
    }

    update() {
        this.fsm.update();
    }
}