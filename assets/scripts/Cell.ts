import { _decorator, Component, Node, input, Input, EventTouch, Prefab } from 'cc';
import { CellColors } from './CellTypes';
const { ccclass, property } = _decorator;

@ccclass('Cell')
export class Cell extends Component {
    public cellData: CellData = null;
}

export class CellData {
    public type: CellColors;
    public virtualCol: number;
    public virtualRow: number;
}


