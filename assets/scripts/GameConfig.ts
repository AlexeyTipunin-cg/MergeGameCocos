import { _decorator, Component, CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameConfig')
export class GameConfig extends Component {
    @property(CCInteger)
    public winScore: number;
    @property(CCInteger)
    public turnsCount: number;
}


