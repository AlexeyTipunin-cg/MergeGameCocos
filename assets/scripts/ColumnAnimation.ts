import { tween, Vec2, Node, TweenAction, Tween, TweenSystem, tweenUtil } from "cc";
import { AnimationData } from "./AnimationData";
import { Field } from "./Field";

export class ColumnAnimation {

    private tweens = []
    public animateRow(speed: number, moveArr: Vec2[], oldField: Node[], fieldData: Field) {

        this.tweens = []
        for (const vec of moveArr) {
            let cell = oldField[vec.x];
            let newPos = fieldData.indexToFieldPos(vec.y);
            let time = (vec.x - vec.y) * fieldData.cellHeight / speed;
            let t = tween(cell).tag(100).to(time, { position: newPos }).start();
            this.tweens.push(TweenSystem.instance.ActionManager.getActionByTag(100, cell))
        }
    }

    public animateNewCells(speed: number, animDatas: AnimationData[], fieldData: Field) {

        this.tweens = []
        for (let index = 0; index < animDatas.length; index++) {
            const vec = animDatas[index];
            let newPos = fieldData.indexToFieldPos(vec.to);
            let time = (vec.from - vec.to) * fieldData.cellHeight / speed;
            let t = tween(vec.target).tag(100).to(time, { position: newPos }).start();
        }
    }

    public isDone(): boolean {
        let completed: boolean = true
        for (const tween of this.tweens) {
            if (!tween.isDone) {
                completed = false;
                break;
            }
        }

        return completed;
    }

}