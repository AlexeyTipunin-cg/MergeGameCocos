import { _decorator, Component, Node, Sprite, SpriteFrame, math, randomRangeInt, instantiate, Prefab, CCClass, Enum } from 'cc';
import { Cell } from './Cell';
import { CellTypes } from './CellTypes';
import { TypeToImage } from './TypeToImage';
const { ccclass, property } = _decorator;


@ccclass('CellPrefabsFactory')
export class CellPrefabsFactory extends Component {

    @property(SpriteFrame)
    private cellSprites: SpriteFrame[] = [];

    @property({type: CellTypes})
    private cellTypes: CellTypes[] = [];

    @property({ type: Prefab })
    private cell: Prefab | null = null;


    public createCell(): Node {
        let spiteNum = randomRangeInt(0, this.cellSprites.length);
        let cellInstance = instantiate(this.cell);
        let sprite = cellInstance.getComponent(Sprite);
        cellInstance.getComponent(Cell).cellType = this.cellTypes[spiteNum];
        sprite.spriteFrame = this.cellSprites[spiteNum];
        return cellInstance;
    }

    public getCellWidth(): number {
        return this.cellSprites[0].width;
    }

    public getCellHeight(): number {
        return this.cellSprites[0].height;
    }
}


