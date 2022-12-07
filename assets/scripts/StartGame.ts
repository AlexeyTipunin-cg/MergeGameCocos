import { _decorator, Component, Node } from 'cc';
import { FieldController } from './FieldController';
import { GameEvents } from './GameEvents';
import { ScoreController } from './ScoreController';
import { ScoreView } from './ScoreView';
import { TurnsController } from './TurnsController';
import { TurnsCounterView } from './TurnsCounterView';
const { ccclass, property } = _decorator;

@ccclass('StartGame')
export class StartGame extends Component {

    @property(FieldController)
    private fieldController: FieldController = null;
    @property(ScoreView)
    private scoreView: ScoreView = null;
    @property(TurnsCounterView)
    private turnsView: TurnsCounterView = null;

    private readonly scoreController = new ScoreController();
    private readonly turnsController = new TurnsController()

    start() {
        this.fieldController.onCellsDestoy.on(GameEvents.onCellsDestoy, this.onFieldClick, this);
        this.scoreView.init(this.scoreController);
        this.turnsView.init(this.turnsController);

        this.turnsController.setTurns(10);
        this.fieldController.startGame();

    }

    private onFieldClick(destroyedCount: number): void {
        this.scoreController.setScore(destroyedCount);
        this.turnsController.decreaseTurns();
    }

    private resetGame() {

    }


}


