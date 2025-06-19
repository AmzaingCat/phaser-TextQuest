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
        this.fsm.setOnEnter('win', () => {
            this.enemySprite.setTint(0x999999); // gray out
            this.enemySprite.setAlpha(0.5);     // fade

            this.showConsole(`${this.playerManager.name} defeated ${this.enemy.name}`);
            this.showMessage(`${this.playerManager.name} defeated ${this.enemy.name}`);
            this.time.delayedCall(2000, () => this.endBattle(), [], this);
        });

        this.fsm.setOnEnter('lose', () => {
            this.playerSprite.setTint(0x999999); // gray out
            this.playerSprite.setAlpha(0.5);     // fade
            
            this.showConsole(`${this.playerManager.name} was defeated...`);
            this.showMessage(`${this.playerManager.name} was defeated...`);
            this.time.delayedCall(2000, () => this.scene.start('GameOver'), [], this);
        });

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

        // Setup UI
        this.createBattleUI();
        this.createSprite();
        this.showConsole('A wild '+ this.enemy.name +' appears!');
        this.showMessage('A wild '+ this.enemy.name +' appears!');

        const cam = this.cameras.main;
        cam.setBackgroundColor(0x000000);
        
        this.time.delayedCall(500, () => this.fsm.update(), [], this);
    }

    createBattleUI() {
        // Placeholder health display
        this.playerHPText = this.add.text(20, 20, '', { fontSize: '16px', fill: '#df7126' });
        this.enemyHPText = this.add.text(300, 20, '', { fontSize: '16px', fill: '#df7126' });
        this.potionCountText = this.add.text(300, 550, '', { fontSize: '16px', fill: '#df7126' })
        this.messages = [];
        this.messageText = this.add.text(700, 550, '',  { fontSize: '16px', fill: '#df7126', wordWrap: { width: 500 } });      

        //update UI immediately
        this.updateUI();
        this.updatePotionCountUI();

        // Actions
        this.attackButton = this.add.text(20, 550, 'Attack', {
            backgroundColor: '#000',
            color: '#df7126',
            padding: { x: 10, y: 5 }
        }).setInteractive().on('pointerdown', () => this.handlePlayerAttack());
    }

    createSprite() {
        this.playerSprite = this.add.sprite(200, 500, 'player').setScale(2).setOrigin(0.5, 1);
        this.enemySprite = this.add.sprite(500, 300, 'monster').setScale(2).setOrigin(0.5, 1);
    }

    handlePlayerAttack() {
        if (this.fsm.state !== 'player-turn' || this.actionTaken) return;

        this.jitterEffect(this.enemySprite);
        this.enemy.hp -= 10;
        this.showConsole(`${this.playerManager.name} attacks!`);
        this.showMessage(`${this.playerManager.name} attacks!`);
        this.updateUI();
        
        this.actionTaken = true;
    }

    handleEnemyTurn() {
        if(this.enemy.hp <= 0) return;

        this.jitterEffect(this.playerSprite);
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

    jitterEffect(sprite) {
        this.tweens.add({
            targets: sprite,
            x: sprite.x - 5,
            yoyo: true,
            duration: 50,
            repeat: 3,
            onComplete: ()=> {
                this.time.delayedCall(500, () => this.fsm.update(), [], this);
            }
        });
    }

    updateUI() {
        this.playerHPText.setText(`${this.playerManager.name}: ${this.playerManager.hp} HP`);
        this.enemyHPText.setText(`${this.enemy.name}: ${this.enemy.hp} HP`);
    }

    updatePotionCountUI() {
        const count = this.game.playerManager.getItemCount('health_potion');
        this.potionCountText.setText(`Potions: ${count}`);
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
}