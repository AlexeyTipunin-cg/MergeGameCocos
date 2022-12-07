import { _decorator, Component } from 'cc';
import { FieldController } from './FieldController';
import { GameEvents } from './GameEvents';
import { ScoreController } from './ScoreController';
import { ScoreView } from './views/ScoreView';
import { TurnsController } from './TurnsController';
import { TurnsCounterView } from './views/TurnsCounterView';
import { GameConfig } from './GameConfig';
import { EndGamePopupView } from './views/EndGamePopupView';
import { GameMediator } from './GameMediator';
const { ccclass, property } = _decorator;

@ccclass('StartGame')
export class StartGame extends Component {

    @property(GameConfig)
    private gameConfig: GameConfig = null;

    @property(FieldController)
    private fieldController: FieldController = null;
    @property(ScoreView)
    private scoreView: ScoreView = null;
    @property(TurnsCounterView)
    private turnsView: TurnsCounterView = null;
    @property(EndGamePopupView)
    private endGamePopupView: EndGamePopupView = null

    private readonly scoreController = new ScoreController();
    private readonly turnsController = new TurnsController()
    private gameMediator: GameMediator = null;

    start() {
        this.gameMediator = new GameMediator(this.scoreController, this.turnsController, this.gameConfig);
        this.gameMediator.onResetGame.on(GameEvents.onResetGame, this.onResetGame, this);
        this.gameMediator.onGameOver.on(GameEvents.onGameOver, this.onGameEnd, this);

        this.fieldController.onCellsDestoy.on(GameEvents.onCellsDestoy, this.onFieldClick, this);
        this.scoreView.init(this.scoreController);
        this.turnsView.init(this.turnsController);

        this.endGamePopupView.init(this.gameMediator);

        this.turnsController.setTurns(this.gameConfig.turnsCount);
        this.fieldController.startGame();

    }

    private onFieldClick(destroyedCount: number): void {
        this.gameMediator.onTurnMade(destroyedCount)
    }

    private onGameEnd(win: boolean) {

        this.endGamePopupView.node.active = true;

    }

    private onResetGame() {
        this.resetGame()
    }

    private resetGame() {
        this.endGamePopupView.node.active = false;

        this.turnsController.setTurns(this.gameConfig.turnsCount);
        this.scoreController.reset();
        this.fieldController.resetGame();
        this.fieldController.startGame();

    }
}


