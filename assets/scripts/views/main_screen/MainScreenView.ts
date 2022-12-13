import { _decorator, Component, EventTarget, Button } from 'cc';
import { FieldView } from './FieldView';
import { ScoreView } from './ScoreView';
import { TurnsCounterView } from './TurnsCounterView';
import { ScoreModel } from '../../models/ScoreModel';
import { TurnsModel } from '../../models/TurnsModel';
import { ResourceBtnView } from './ResourceBtnView';
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
    @property(ResourceBtnView)
    private shuffleView: ResourceBtnView;
    @property(ResourceBtnView)
    private bombView: ResourceBtnView;
    @property(ResourceBtnView)
    private pairView: ResourceBtnView;

    public onShuffleBtnClick: EventTarget = new EventTarget();
    public onBombBtnClick: EventTarget = new EventTarget();
    public onPairBtnClick: EventTarget = new EventTarget();

    public init(scoreModel: ScoreModel, turnsModel: TurnsModel, resourcesModel: ResourcesModel) {
        this.turnsCounterView.init(turnsModel);
        this.scoreView.init(scoreModel);

        this.shuffleView.button.text.string = resourcesModel.getResName(ResourceTypes.Shuffle);
        this.bombView.button.text.string = resourcesModel.getResName(ResourceTypes.Bomb);
        this.pairView.button.text.string = resourcesModel.getResName(ResourceTypes.Pair);

        this.updateShuffleCount(resourcesModel.getResCount(ResourceTypes.Shuffle));
        this.updateBombCount(resourcesModel.getResCount(ResourceTypes.Bomb));
        this.updatePairCount(resourcesModel.getResCount(ResourceTypes.Pair));

        this.shuffleView.button.node.on(Button.EventType.CLICK, this.onShuffleClick, this);
        this.bombView.button.node.on(Button.EventType.CLICK, this.onBombClick, this);
        this.pairView.button.node.on(Button.EventType.CLICK, this.onPairClick, this);
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


    public updatePairCount(count: number) {
        this.pairView.countText.string = `Count: ${count}`;
    }

    private onPairClick() {
        this.onPairBtnClick.emit(Button.EventType.CLICK);
    }
}


