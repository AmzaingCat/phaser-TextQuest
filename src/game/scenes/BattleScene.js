import Phaser from 'phaser';
import BattleFSM from '../managers/BattleFSM';

export class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });
    }

    create(data) {
        // Load the player and enemy data
        this.playerManager = this.game.playerManager;
        this.enemy = data.enemy;
        this.returnScene = data.returnScene;
        this.returnPosition = data.returnPosition;

        // Battle UI state
        this.actionTaken = false;
        this.enemyActionDone = false;

        // Create FSM
        this.fsm = new BattleFSM('start');
        this.fsm.addTransition('start', 'player-turn', () => true);
        this.fsm.addTransition('player-turn', 'win', () => this.enemy.hp <= 0);
        this.fsm.addTransition('enemy-turn', 'lose', () => this.playerManager.hp <= 0);
        this.fsm.addTransition('player-turn', 'enemy-turn', () => this.actionTaken);
        this.fsm.addTransition('enemy-turn', 'player-turn', () => this.enemyActionDone);

        // FSM onEnter callbacks
        this.fsm.setOnEnter('player-turn', () => {
            this.actionTaken = false;
            this.showConsole(`${this.playerManager.name}'s turn!`);
            this.showMessage(`${this.playerManager.name}'s turn!`);
        });

        this.fsm.setOnEnter('enemy-turn', () => {
            this.enemyActionDone = false;
            this.showConsole(`${this.enemy.name}'s turn!`);
            this.showMessage(`${this.enemy.name}'s turn!`);
            this.time.delayedCall(1000, () => this.handleEnemyTurn(), [], this);
        });

        this.fsm.setOnEnter('win', () => {
            this.showConsole(`${this.playerManager.name} defeated ${this.enemy.name}`);
            this.showMessage(`${this.playerManager.name} defeated ${this.enemy.name}`);
            this.time.delayedCall(2000, () => this.endBattle(), [], this);
        });

        this.fsm.setOnEnter('lose', () => {
            this.showConsole(`${this.playerManager.name} was defeated...`);
            this.showMessage(`${this.playerManager.name} was defeated...`);
            this.time.delayedCall(2000, () => this.scene.start('GameOver'), [], this);
        });

        // Setup UI
        this.createBattleUI();
        this.showConsole('A wild '+ this.enemy.name +' appears!');
        this.showMessage('A wild '+ this.enemy.name +' appears!');

        const cam = this.cameras.main;
        cam.setBackgroundColor(0x000000);
    }

    createBattleUI() {
        // Placeholder health display
        this.playerHPText = this.add.text(20, 20, `${this.playerManager.name}: ${this.playerManager.hp} HP`, { fontSize: '16px', fill: '#df7126' });
        this.enemyHPText = this.add.text(300, 20, `${this.enemy.name}: ${this.enemy.hp} HP`, { fontSize: '16px', fill: '#df7126' });
        this.messages = [];
        this.messageText = this.add.text(20, 200, '',  { fontSize: '16px', fill: '#df7126', wordWrap: { width: 500 } });      

        // Actions
        this.attackButton = this.add.text(20, 100, 'Attack', {
            backgroundColor: '#000',
            color: '#df7126',
            padding: { x: 10, y: 5 }
        }).setInteractive().on('pointerdown', () => this.handlePlayerAttack());
    }

    handlePlayerAttack() {
        if (this.fsm.state !== 'player-turn' || this.actionTaken) return;

        this.enemy.hp -= 10;
        this.showConsole(`${this.playerManager.name} attacks!`);
        this.showMessage(`${this.playerManager.name} attacks!`);
        this.updateUI();
        
        this.actionTaken = true;
    }

    handleEnemyTurn() {
        if(this.enemy.hp <= 0) return;

        this.playerManager.hp -= 5;
        this.showConsole(`${this.enemy.name} hits back!`);
        this.showMessage(`${this.enemy.name} hits back!`);
        this.updateUI();

        this.enemyActionDone= true;
    }

    endBattle() {
        this.scene.start(this.returnScene, {
            startX: this.returnPosition.x,
            startY: this.returnPosition.y
        });
    }

    updateUI() {
        this.playerHPText.setText(`${this.playerManager.name}: ${this.playerManager.hp} HP`);
        this.enemyHPText.setText(`${this.enemy.name}: ${this.enemy.hp} HP`);
    }

    showConsole(text) {
        console.log(text);
    }

    showMessage(newMsg) {
        this.messages.push(newMsg);

        // Limit total lines (scrolling log)
        if (this.messages.length > 10) {
            this.messages.shift(); // remove the oldest
        }

        this.messageText.setText(this.messages.join('\n'));
    }

    update() {
        this.fsm.update();
    }
}