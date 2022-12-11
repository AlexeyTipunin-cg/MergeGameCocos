import { _decorator, Component, CCInteger, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameConfig')
export class GameConfig extends Component {
    @property({ type: CCInteger })
    public sizeX: number = 9;
    @property({ type: CCInteger })
    public sizeY: number = 9;
    @property(Vec2)
    public cellSize: Vec2 = new Vec2();
    @property(CCInteger)
    public winScore: number;
    @property(CCInteger)
    public turnsCount: number;
    @property(CCInteger)
    public shufflesCount: number;
    @property(CCInteger)
    public bombsCount: number;

}


