import { _decorator, Component, CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameConfig')
export class GameConfig extends Component {
    @property({ type: CCInteger })
    public sizeX: number = 9;
    @property({ type: CCInteger })
    public sizeY: number = 9;
    @property(CCInteger)
    public winScore: number;
    @property(CCInteger)
    public turnsCount: number;
}


