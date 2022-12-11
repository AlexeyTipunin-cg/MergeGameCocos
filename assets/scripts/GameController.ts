import { GameViewsStorage } from './views/GameViewsStorage';
import { GameConfig } from './GameConfig';
import { TurnsModel } from './TurnsModel';
import { ScoreModel } from './ScoreModel';
import { VictoryController } from './VictoryController';
import { FieldModel } from './field/FieldModel';
import { GameEvents } from './GameEvents';
import { MainScreenController as MainScreenController } from './views/main_screen/MainScreenController';
import { ResourcesModel } from './ResourcesModel';
export class GameController {

    private gameConfig: GameConfig = null;
    private gameViewsStorage: GameViewsStorage = null;
    private readonly scoreController = new ScoreModel();
    private readonly turnsController = new TurnsModel();
    private resourcesModel: ResourcesModel = null;
    private victoryController: VictoryController = null;
    private fieldModel: FieldModel = new FieldModel();
    private mainScreenController: MainScreenController = null;

    constructor(gameConfig: GameConfig, gameViewsStorage: GameViewsStorage) {
        this.gameConfig = gameConfig;
        this.gameViewsStorage = gameViewsStorage;
    }

    public startGame(): void {
        this.resourcesModel = new ResourcesModel();
        this.resourcesModel.setConfig(this.gameConfig);
        this.resourcesModel.init();

        this.victoryController = new VictoryController(this.scoreController, this.turnsController, this.resourcesModel, this.gameConfig);

        this.victoryController.onResetGame.on(GameEvents.onResetGame, this.onResetGame, this);
        this.victoryController.onGameOver.on(GameEvents.onGameOver, this.onGameEnd, this);

        this.gameViewsStorage.mainScreenView.init(this.scoreController, this.turnsController, this.resourcesModel);
        this.gameViewsStorage.endGamePopupView.init(this.victoryController);

        this.mainScreenController = new MainScreenController(this.fieldModel, this.resourcesModel, this.gameViewsStorage.mainScreenView);
        this.fieldModel.onCellsDestoy.on(GameEvents.onCellsDestoy, this.onFieldClick, this);
        this.fieldModel.onNoPairs.on(GameEvents.onNoPairs, this.onNoPairs, this)


        this.turnsController.setTurns(this.gameConfig.turnsCount);
        this.mainScreenController.createField(this.gameConfig);
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
        this.mainScreenController.resetField();
        this.mainScreenController.createField(this.gameConfig);
    }
}