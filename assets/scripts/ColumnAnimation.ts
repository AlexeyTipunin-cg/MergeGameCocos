import { tween, Vec2, Node, TweenAction, Tween, TweenSystem, tweenUtil } from "cc";
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