import { _decorator, Component, Node } from 'cc';
import { FieldController } from './FieldController';
import { FieldInput } from './FieldInput';
import { GameEvents } from './GameEvents';
import { ScoreController } from './ScoreController';
import { ScoreView } from './ScoreView';
const { ccclass, property } = _decorator;

@ccclass('StartGame')
export class StartGame extends Component {

    @property(FieldController)
    private fieldController: FieldController = null;
    @property(ScoreView)
    private scoreView: ScoreView = null;

    private readonly scoreController = new ScoreController();

    start() {
        this.fieldController.startGame();
        this.fieldController.onCellsDestoy.on(GameEvents.onCellsDestoy, this.onCellDestroy, this);
        this.scoreView.init(this.scoreController);
    }

    private onCellDestroy(destroyedCount: number): void {
        this.scoreController.setScore(destroyedCount);
    }


}


