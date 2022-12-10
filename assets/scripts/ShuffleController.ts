import { ShuffleModel } from './SuffleModel';
import { ShuffleView } from './views/main_screen/ShuffleView';
import { GameEvents } from './GameEvents';
import { EventTarget } from 'cc';
export class ShuffleController {
    private shuffleModel: ShuffleModel;
    private shuffleView: ShuffleView;

    public onShuffleEvent: EventTarget = new EventTarget();

    constructor(shuffleModel: ShuffleModel, shuffleView: ShuffleView) {
        this.shuffleModel = shuffleModel;
        this.shuffleView = shuffleView;
        this.shuffleView.onBtnClick.on(GameEvents.onShuffle, this.onShuffle, this);
        this.shuffleModel.onShuffleUpdate.on(GameEvents.onShuffle, this.onShuffleUpdate, this);
    }

    private onShuffle() {
        if (this.shuffleModel.shuffles > 0) {
            this.shuffleModel.makeShaffle();
        }
    }

    private onShuffleUpdate(count: number) {
        this.shuffleView.updateCount(count);
    }


}