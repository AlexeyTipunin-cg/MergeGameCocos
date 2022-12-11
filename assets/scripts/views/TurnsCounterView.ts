import { _decorator, Component, Node, Label } from 'cc';
import { GameEvents } from '../GameEvents';
import { TurnsModel } from '../TurnsModel';
const { ccclass, property } = _decorator;

@ccclass('TurnsCounterView')
export class TurnsCounterView extends Component {

    @property(Label)
    private scoreText: Label = null;
    private turnsController: TurnsModel = null;

    onDestroy() {
        this.turnsController.onTurnUpdate.off(GameEvents.onTurnUpdate, this.updateScore, this);
    }

    public init(turnsController: TurnsModel) {
        this.turnsController = turnsController;
        this.turnsController.onTurnUpdate.on(GameEvents.onTurnUpdate, this.updateScore, this);
    }

    private updateScore(score: number) {
        this.scoreText.string = score.toString();
    }
}


