import { _decorator, Component, EventTarget, Button } from 'cc';
import { FieldView } from './FieldView';
import { ScoreView } from './ScoreView';
import { TurnsCounterView } from './TurnsCounterView';
import { ShuffleView } from './ShuffleView';
import { ScoreModel } from '../../models/ScoreModel';
import { TurnsModel } from '../../models/TurnsModel';
import { BombView } from './BombView';
import { ResourcesModel } from '../../models/ResourcesModel';
import { ResourceTypes } from '../../data/ResourceItem';
const { ccclass, property } = _decorator;

@ccclass('MainScreenView')
export class MainScreenView extends Component {

    @property(FieldView)
    public fieldView: FieldView;
    @property(ScoreView)
    private scoreView: ScoreView;
    @property(TurnsCounterView)
    private turnsCounterView: TurnsCounterView;
    @property(ShuffleView)
    private shuffleView: ShuffleView;
    @property(BombView)
    private bombView: BombView;

    public onShuffleBtnClick: EventTarget = new EventTarget();
    public onBombBtnClick: EventTarget = new EventTarget();

    public init(scoreModel: ScoreModel, turnsModel: TurnsModel, resourcesModel: ResourcesModel) {
        this.turnsCounterView.init(turnsModel);
        this.scoreView.init(scoreModel);

        this.shuffleView.button.text.string = resourcesModel.getResName(ResourceTypes.Shuffle);
        this.bombView.button.text.string = resourcesModel.getResName(ResourceTypes.Bomb);
        this.updateShuffleCount(resourcesModel.getResCount(ResourceTypes.Shuffle));
        this.updateBombCount(resourcesModel.getResCount(ResourceTypes.Bomb))

        this.shuffleView.button.node.on(Button.EventType.CLICK, this.onShuffleClick, this);
        this.bombView.button.node.on(Button.EventType.CLICK, this.onBombClick, this);
    }

    public updateShuffleCount(count: number) {
        this.shuffleView.countText.string = `Count: ${count}`;
    }

    private onShuffleClick() {
        this.onShuffleBtnClick.emit(Button.EventType.CLICK);
    }

    public updateBombCount(count: number) {
        this.bombView.countText.string = `Count: ${count}`;
    }

    private onBombClick() {
        this.onBombBtnClick.emit(Button.EventType.CLICK);
    }
}


