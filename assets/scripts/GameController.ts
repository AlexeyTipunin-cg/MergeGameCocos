import { GameViewsStorage } from './views/GameViewsStorage';
import { GameConfig } from './GameConfig';
import { FieldController } from './field/FieldController';
import { TurnsController } from './TurnsModel';
import { ScoreModel } from './ScoreModel';
import { ShuffleModel } from './SuffleModel';
import { VictoryController } from './VictoryController';
import { FieldModel } from './field/FieldModel';
import { ShuffleController } from './ShuffleController';
import { GameEvents } from './GameEvents';
import { ScoreView } from './views/main_screen/ScoreView';
export class GameController {

    private gameConfig: GameConfig = null;
    private gameViewsStorage: GameViewsStorage = null;
    private fieldController: FieldController = null;
    private readonly scoreController = new ScoreModel();
    private readonly turnsController = new TurnsController();
    private shuffleModel: ShuffleModel = null;
    private victoryController: VictoryController = null;
    private fieldModel: FieldModel = new FieldModel();
    private shuffleController: ShuffleController = null;

    constructor(gameConfig: GameConfig, gameViewsStorage: GameViewsStorage) {
        this.gameConfig = gameConfig;
        this.gameViewsStorage = gameViewsStorage;
    }

    public startGame(): void {
        this.shuffleModel = new ShuffleModel();
        this.shuffleController = new ShuffleController(this.shuffleModel, this.gameViewsStorage.mainScreenView.sh);
        this.shuffleModel.setConfig(this.gameConfig);
        this.shuffleModel.init();

        this.fieldController = new FieldController(this.fieldModel, this.shuffleModel, this.gameViewsStorage.fieldView);
        this.victoryController = new VictoryController(this.scoreController, this.turnsController, this.shuffleModel, this.gameConfig);

        this.victoryController.onResetGame.on(GameEvents.onResetGame, this.onResetGame, this);
        this.victoryController.onGameOver.on(GameEvents.onGameOver, this.onGameEnd, this);
        this.fieldController.onCellDestoyed.on(GameEvents.onCellsDestoy, this.onFieldClick, this);
        this.fieldController.onNoPairs.on(GameEvents.onNoPairs, this.onNoPairs, this)

        this.gameViewsStorage.mainScreenView.ScoreView.init(this.scoreController);
        this.gameViewsStorage.turnsView.init(this.turnsController);
        this.gameViewsStorage.endGamePopupView.init(this.victoryController);

        this.turnsController.setTurns(this.gameConfig.turnsCount);
        this.fieldController.createField(this.gameConfig);
    }

    private onNoPairs() {
        this.victoryController.onNoPairs();
    }

    private onFieldClick(destroyedCount: number): void {
        this.victoryController.onTurnMade(destroyedCount);
    }

    private onGameEnd(win: boolean) {
        this.gameViewsStorage.endGamePopupView.node.active = true;
    }

    private onResetGame() {
        this.resetGame();
    }

    private resetGame() {
        this.gameViewsStorage.endGamePopupView.node.active = false;

        this.turnsController.setTurns(this.gameConfig.turnsCount);
        this.scoreController.reset();
        this.fieldController.resetField();
        this.fieldController.createField(this.gameConfig);
    }
}