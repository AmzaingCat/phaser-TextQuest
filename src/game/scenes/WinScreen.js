import { Scene } from 'phaser';

export class WinScreen extends Scene {
    constructor() {
        super({ key: 'WinScreen' });
    }

    create() {
        this.add.text(512, 384, 'You Win', {
            fontSize: '32px',
            color: '#df7126'
        }).setOrigin(0.5);

        const restartButton = this.add.text(512, 460, 'Restart', {
            fontSize: '24px',
            color: '#df7126',
            padding: { x:10, y:5 }
        }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        const cam = this.cameras.main;
        cam.setBackgroundColor(0x000000);
    }
}