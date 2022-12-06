import { _decorator, Component, Node, Sprite, SpriteFrame, math, randomRangeInt, instantiate, Prefab, CCClass, Enum } from 'cc';
import { CellTypes } from './CellTypes';
const { ccclass, property } = _decorator;

@ccclass
export class TypeToImage {
    @property({ type: CellTypes })
    public cellType: CellTypes = null;
    @property({ type: SpriteFrame })
    public sprite: SpriteFrame = null;
}