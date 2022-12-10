import { _decorator, Component } from 'cc';
import { CellData } from './CellData';
const { ccclass, property } = _decorator;

@ccclass('Cell')
export class Cell extends Component {
    public cellData: CellData = null;
}
