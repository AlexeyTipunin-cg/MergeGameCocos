import { _decorator, Component, Node, Sprite, SpriteFrame, math, randomRangeInt, instantiate, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CellPrefabsFactory')
export class CellPrefabsFactory extends Component {

    @property([SpriteFrame])
    private cellSprites: SpriteFrame[] = [];

    @property({ type: Prefab })
    private cell: Prefab | null = null;


    public createCell(): Node {
        let spiteNum = randomRangeInt(0, this.cellSprites.length);
        let cellInstance = instantiate(this.cell);
        let sprite = cellInstance.getComponent(Sprite);
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


