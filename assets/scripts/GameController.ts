import { GameViewsStorage } from './views/GameViewsStorage';
import { GameConfig } from './config/GameConfig';
import { TurnsModel } from './models/TurnsModel';
import { ScoreModel } from './models/ScoreModel';
import { VictoryModel } from './models/VictoryModel';
import { FieldModel } from './field/FieldModel';
import { GameEvents } from './data/GameEvents';
import { FieldController as FieldController } from './views/main_screen/FieldController';
import { ResourcesModel } from './models/ResourcesModel';
import { FieldChangeData } from './field/FieldChangeData';
export class GameController {

    private gameConfig: GameConfig = null;
    private gameViewsStorage: GameViewsStorage = null;
    private readonly scoreController = new ScoreModel();
    private readonly turnsController = new TurnsModel();
    private resourcesModel: ResourcesModel = null;
    private victoryController: VictoryModel = null;
    private fieldModel: FieldModel = new FieldModel();
    private mainScreenController: FieldController = null;

    constructor(gameConfig: GameConfig, gameViewsStorage: GameViewsStorage) {
        this.gameConfig = gameConfig;
        this.gameViewsStorage = gameViewsStorage;
    }

    public startGame(): void {
        this.resourcesModel = new ResourcesModel();
        this.resourcesModel.setConfig(this.gameConfig);
        this.resourcesModel.init();

        this.victoryController = new VictoryModel(this.scoreController, this.turnsController, this.resourcesModel, this.gameConfig);

        this.victoryController.onResetGame.on(GameEvents.onResetGame, this.onResetGame, this);
        this.victoryController.onGameOver.on(GameEvents.onGameOver, this.onGameEnd, this);
        this.fieldModel.onCellsDestoy.on(GameEvents.onCellsDestoy, this.onFieldClick, this);
        this.fieldModel.onNoPairs.on(GameEvents.onNoPairs, this.onNoPairs, this)

        this.gameViewsStorage.mainScreenView.init(this.scoreController, this.turnsController, this.resourcesModel);
        this.gameViewsStorage.endGamePopupView.init(this.victoryController);

        this.mainScreenController = new FieldController(this.fieldModel, this.resourcesModel, this.gameViewsStorage.mainScreenView);

        this.turnsController.setTurns(this.gameConfig.turnsCount);
        this.mainScreenController.createField(this.gameConfig);
    }

    private onNoPairs() {
        this.victoryController.onNoPairs();
    }

    private onFieldClick(fieldChangeData: FieldChangeData): void {
        this.victoryController.onTurnMade(fieldChangeData);
    }

    private onGameEnd(win: boolean): void {
        this.gameViewsStorage.endGamePopupView.node.active = true;
    }

    private onResetGame(): void {
        this.resetGame();
    }

    private resetGame(): void {
        this.gameViewsStorage.endGamePopupView.node.active = false;

        this.resourcesModel.reset();

        this.turnsController.setTurns(this.gameConfig.turnsCount);
        this.scoreController.reset();
        this.mainScreenController.resetField();
        this.mainScreenController.createField(this.gameConfig);
    }
}