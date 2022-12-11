import { _decorator, Component, Node, Label } from 'cc';
import { GameEvents } from '../data/GameEvents';
import { ScoreModel } from '../models/ScoreModel';
const { ccclass, property } = _decorator;

@ccclass('ScoreView')
export class ScoreView extends Component {

    @property(Label)
    private scoreText: Label = null;
    private scoreController: ScoreModel = null;

    onDestroy() {
        this.scoreController.onScoreUpdate.off(GameEvents.onScoreUpdate, this.updateScore, this);
    }

    public init(scoreController: ScoreModel) {
        this.scoreController = scoreController;
        this.scoreController.onScoreUpdate.on(GameEvents.onScoreUpdate, this.updateScore, this);
        this.updateScore(0);
    }

    private updateScore(score: number) {
        this.scoreText.string = score.toString();
    }
}


