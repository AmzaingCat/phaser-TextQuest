import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super({ key: 'MainMenu' });
    }

    create ()
    {
        this.add.text(512, 384, 'TextQuest',  {
            fontSize: '32px',
            color: '#df7126'
        }).setOrigin(0.5);

        const playButton = this.add.text(512, 460, 'Play', {
            fontSize: '24px',
            color: '#df7126',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();

        playButton.on('pointerdown', () => {
            this.scene.start('DungeonScene');
        });

        const cam = this.cameras.main;
        cam.setBackgroundColor(0x000000);
    }
}
