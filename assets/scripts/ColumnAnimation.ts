import { tween, Vec2, Node } from "cc";
import { Field } from "./Field";

export class ColumnAnimation {

    public animateRow(speed: number, moveArr: Vec2[], oldField: Node[], fieldData: Field) {
        let tweens = [];

        for (const vec of moveArr) {
            let cell = oldField[vec.x];
            let newPos = fieldData.indexToFieldPos(vec.y);
            let time = (vec.x - vec.y) * fieldData.cellHeight / speed;
            let t = tween(cell).to(time, { position: newPos }).start();
        }
    }

}