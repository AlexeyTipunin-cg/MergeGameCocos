import { _decorator, Component } from 'cc';
import { EndGamePopupView } from './EndGamePopupView';
import { MainScreenView } from './main_screen/MainScreenView';
const { ccclass, property } = _decorator;

@ccclass('GameViewsStorage')
export class GameViewsStorage extends Component {
    @property(MainScreenView)
    private mainScreen: MainScreenView = null;
    @property(EndGamePopupView)
    private endGamePopup: EndGamePopupView = null;


    public get mainScreenView(): MainScreenView {
        return this.mainScreen;
    }

    public get endGamePopupView(): EndGamePopupView {
        return this.endGamePopup;
    }


}


