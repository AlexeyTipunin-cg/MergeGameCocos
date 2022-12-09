import { _decorator, Component, Node, Sprite, SpriteFrame, math, randomRangeInt, instantiate, Prefab, CCClass, Enum } from 'cc';
import { CellColors } from './CellTypes';
const { ccclass, property } = _decorator;

@ccclass
export class TypeToImage {
    @property({ type: CellColors })
    public cellType: CellColors = null;
    @property({ type: SpriteFrame })
    public sprite: SpriteFrame = null;
}