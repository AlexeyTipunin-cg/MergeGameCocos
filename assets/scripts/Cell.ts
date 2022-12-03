import { _decorator, Component, Node, input, Input, EventTouch, Prefab } from 'cc';
import { CellTypes } from './CellTypes';
const { ccclass, property } = _decorator;

@ccclass('Cell')
export class Cell extends Component {

    @property({ type: CellTypes })
    public cellType: CellTypes;
}


