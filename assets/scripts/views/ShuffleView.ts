import { Button, Component, EventTarget, Label, _decorator } from 'cc';
import { GameEvents } from '../GameEvents';
import { ShuffleModel } from '../SuffleModel';
import { ShuffleController } from '../ShuffleController';
const { ccclass, property } = _decorator;

@ccclass('ShuffleView')
export class ShuffleView extends Component {

    public onBtnClick: EventTarget = new EventTarget();
    @property(Button)
    private btn: Button;
    @property(Label)
    private countText: Label;
    private shuffleController: ShuffleController = null;

    start() {
        this.btn.node.on(Button.EventType.CLICK, this.onBtnClicked, this)
    }

    public init(shufflesCount: ShuffleController) {
        this.shuffleController = shufflesCount;
    }

    public updateCount(count: number) {
        this.countText.string = `Count: ${count}`;
    }

    private onBtnClicked() {
        this.onBtnClick.emit(GameEvents.onShuffle);
    }

}