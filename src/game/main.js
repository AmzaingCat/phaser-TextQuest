import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { DungeonScene } from './scenes/DungeonScene';
import { RoomA } from './scenes/roomA';
import { RoomB } from './scenes/roomB';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    pixelArt: true,
    parent: 'game-container',
    backgroundColor: '#028af8',
    physics: {
        default: 'arcade'
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        DungeonScene,
        RoomA,
        RoomB,
        Game,
        GameOver
    ]
};

const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });

}

export default StartGame;
