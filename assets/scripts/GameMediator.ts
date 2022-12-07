import { EventTarget } from 'cc';
import { GameEvents } from './GameEvents';
import { ScoreController } from './ScoreController';
import { TurnsController } from './TurnsController';
import { GameConfig } from './GameConfig';
import { GameStates } from './GameStates';

export class GameMediator {
    public onGameOver: EventTarget = new EventTarget();
    public onResetGame: EventTarget = new EventTarget();

    private scoreController: ScoreController = null;
    private turnsController: TurnsController = null;
    private config: GameConfig = null;
    public gameState: GameStates = GameStates.PLAYING;

    constructor(scoreController: ScoreController, turnsController: TurnsController, config: GameConfig) {
        this.scoreController = scoreController;
        this.turnsController = turnsController;
        this.config = config;
    }

    public onTurnMade(destorydCellsCount: number): void {
        if (this.gameState !== GameStates.PLAYING) {
            return;
        }

        this.scoreController.setScore(destorydCellsCount);
        this.turnsController.decreaseTurns();


        if (this.scoreController.score >= this.config.winScore) {
            this.gameState = GameStates.WIN;
            this.onGameOver.emit(GameEvents.onGameOver, true);
            return;
        }

        if (this.turnsController.turns === 0) {
            this.gameState = GameStates.LOOSE;
            this.onGameOver.emit(GameEvents.onGameOver, false);
            return;
        }
    }

    public reset() {
        this.gameState = GameStates.PLAYING;
        this.onResetGame.emit(GameEvents.onResetGame);
    }
}


