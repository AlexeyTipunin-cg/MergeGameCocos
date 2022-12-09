import { _decorator, Component, Node, Sprite, SpriteFrame, math, randomRangeInt, instantiate, Prefab, CCClass, Enum, Color } from 'cc';
import { Cell, CellData } from './Cell';
import { CellColors } from './CellTypes';
import { TypeToImage } from './TypeToImage';
const { ccclass, property } = _decorator;


@ccclass('CellPrefabsFactory')
export class CellPrefabsFactory extends Component {

    @property(SpriteFrame)
    private cellSprites: SpriteFrame[] = [];

    @property({ type: CellColors })
    private cellTypes: CellColors[] = [];

    @property({ type: Prefab })
    private cell: Prefab | null = null;


    public createCell(cellData: CellData): Cell {
        let spiteNum = randomRangeInt(0, this.cellSprites.length);
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


