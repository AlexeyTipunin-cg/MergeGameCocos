import { EventTarget } from 'cc';
import { GameEvents } from '../data/GameEvents';
import { ScoreModel } from './ScoreModel';
import { TurnsModel } from './TurnsModel';
import { GameConfig } from '../GameConfig';
import { GameStates } from '../data/GameStates';
import { ShuffleModel } from './SuffleModel';
import { ResourcesModel } from './ResourcesModel';
import { ResourceTypes } from '../data/ResourceItem';
import { FieldChangeData } from '../field/FieldChangeData';

export class VictoryModel {
    public onGameOver: EventTarget = new EventTarget();
    public onResetGame: EventTarget = new EventTarget();

    private scoreController: ScoreModel = null;
    private turnsController: TurnsModel = null;
    private resModel: ResourcesModel = null;
    private config: GameConfig = null;
    public gameState: GameStates = GameStates.PLAYING;

    constructor(scoreController: ScoreModel, turnsController: TurnsModel, resModel: ResourcesModel, config: GameConfig) {
        this.scoreController = scoreController;
        this.turnsController = turnsController;
        this.resModel = resModel;
        this.config = config;
    }

    public onTurnMade(fieldChangeData: FieldChangeData): void {
        if (this.gameState !== GameStates.PLAYING) {
            return;
        }

        this.scoreController.setScore(fieldChangeData.killedCells.length);
        this.turnsController.decreaseTurns();


        if (this.scoreController.score >= this.config.winScore) {
            this.setWinState();
            return;
        }

        if (this.turnsController.turns === 0) {
            this.setLooseState();
            return;
        }
    }

    public onNoPairs() {
        if (this.resModel.getResCount(ResourceTypes.Shuffle) === 0) {
            this.setLooseState();
        }
    }

    public reset() {
        this.gameState = GameStates.PLAYING;
        this.onResetGame.emit(GameEvents.onResetGame);
    }

    private setLooseState() {
        this.gameState = GameStates.LOOSE;
        this.onGameOver.emit(GameEvents.onGameOver, false);
    }

    private setWinState() {
        this.gameState = GameStates.WIN;
        this.onGameOver.emit(GameEvents.onGameOver, true);
    }
}


