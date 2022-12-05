import { _decorator, Component, Node, input, Input, EventTouch, Prefab } from 'cc';
import { CellTypes } from './CellTypes';
const { ccclass, property } = _decorator;

@ccclass('Cell')
export class Cell extends Component {
    public cellData: CellData = null;
}

export class CellData {
    public type: CellTypes;
    public index: number;
    
}


