import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import PlayerManager from './managers/PlayerManager';
import { BattleScene } from './scenes/BattleScene';
import { DungeonScene } from './scenes/DungeonScene';
import { RoomA } from './scenes/roomA';
import { RoomB } from './scenes/roomB';
import { WinScreen } from './scenes/WinScreen';
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
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade'
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        BattleScene,
        DungeonScene,
        RoomA,
        RoomB,
        Game,
        GameOver,
        WinScreen
    ]
};

const StartGame = (parent) => {
    const game = new Phaser.Game({ ...config, parent });
    game.playerManager = new PlayerManager();

    return game;

}

export default StartGame;
