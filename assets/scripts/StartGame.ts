import { _decorator, Component } from "cc";
import { FieldModel } from './field/FieldModel';
import { GameEvents } from "./GameEvents";
import { ScoreController } from "./ScoreController";
import { ScoreView } from "./views/ScoreView";
import { TurnsController } from "./TurnsController";
import { TurnsCounterView } from "./views/TurnsCounterView";
import { GameConfig } from "./GameConfig";
import { EndGamePopupView } from "./views/EndGamePopupView";
import { GameMediator as VictoryController } from "./GameMediator";
import { FieldView } from './views/FieldView';
import { FieldController } from "./field/FieldController";
const { ccclass, property } = _decorator;

@ccclass("StartGame")
export class StartGame extends Component {
  @property(GameConfig)
  private gameConfig: GameConfig = null;

  @property(ScoreView)
  private scoreView: ScoreView = null;
  @property(TurnsCounterView)
  private turnsView: TurnsCounterView = null;
  @property(EndGamePopupView)
  private endGamePopupView: EndGamePopupView = null;
  @property(FieldView)
  private fieldView: FieldView;

  private fieldController: FieldController = null;
  private readonly scoreController = new ScoreController();
  private readonly turnsController = new TurnsController();
  private victoryController: VictoryController = null;
  private fieldModel: FieldModel = null;

  start() {
    this.fieldModel = new FieldModel();
    this.fieldController = new FieldController(this.fieldModel, this.fieldView);
    this.victoryController = new VictoryController(this.scoreController, this.turnsController, this.gameConfig);

    this.victoryController.onResetGame.on(GameEvents.onResetGame, this.onResetGame, this);
    this.victoryController.onGameOver.on(GameEvents.onGameOver, this.onGameEnd, this);
    this.fieldController.onCellDestoyed.on(GameEvents.onCellsDestoy, this.onFieldClick, this);

    this.scoreView.init(this.scoreController);
    this.turnsView.init(this.turnsController);
    this.endGamePopupView.init(this.victoryController);

    this.turnsController.setTurns(this.gameConfig.turnsCount);
    this.fieldController.createField(this.gameConfig);
  }

  private onFieldClick(destroyedCount: number): void {
    this.victoryController.onTurnMade(destroyedCount);
  }

  private onGameEnd(win: boolean) {
    this.endGamePopupView.node.active = true;
  }

  private onResetGame() {
    this.resetGame();
  }

  private resetGame() {
    this.endGamePopupView.node.active = false;

    this.turnsController.setTurns(this.gameConfig.turnsCount);
    this.scoreController.reset();
    this.fieldController.resetField();
    this.fieldController.createField(this.gameConfig);
  }
}
