import { _decorator, Component, Node, Label } from 'cc';
import { GameEvents } from '../../data/GameEvents';
import { TurnsModel } from '../../models/TurnsModel';
const { ccclass, property } = _decorator;

@ccclass('TurnsCounterView')
export class TurnsCounterView extends Component {

    @property(Label)
    private scoreText: Label = null;
    private turnsModel: TurnsModel = null;

    onDestroy() {
        this.turnsModel.onTurnUpdate.off(GameEvents.onTurnUpdate, this.updateScore, this);
    }

    public init(turnsModel: TurnsModel) {
        this.turnsModel = turnsModel;
        this.turnsModel.onTurnUpdate.on(GameEvents.onTurnUpdate, this.updateScore, this);
    }

    private updateScore(score: number) {
        this.scoreText.string = score.toString();
    }
}


