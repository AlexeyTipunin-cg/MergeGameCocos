import { _decorator, Component, Sprite, SpriteFrame, instantiate, Prefab } from 'cc';
import { Cell } from './Cell';
import { CellData } from "./CellData";
const { ccclass, property } = _decorator;


@ccclass('CellPrefabsFactory')
export class CellPrefabsFactory extends Component {

    @property(SpriteFrame)
    private cellSprites: SpriteFrame[] = [];

    @property({ type: Prefab })
    private cell: Prefab | null = null;


    public createCell(cellData: CellData): Cell {
        let cellInstance = instantiate(this.cell);
        let sprite = cellInstance.getComponent(Sprite);
        let cellComponent = cellInstance.getComponent(Cell);
        cellComponent.cellData = cellData;
        sprite.spriteFrame = this.cellSprites[cellData.type];
        return cellComponent;
    }

    public getCellWidth(): number {
        return this.cellSprites[0].rect.width;
    }

    public getCellHeight(): number {
        return this.cellSprites[0].rect.height;
    }
}


