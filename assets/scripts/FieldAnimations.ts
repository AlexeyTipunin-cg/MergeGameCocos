import { tween, Vec2, Node, Component, animation } from "cc";
import { ColumnAnimation } from "./ColumnAnimation";
import { Field } from "./Field";

export class FieldAnimations {

    private animations: ColumnAnimation[] = [];
    public animateField(speed: number, moveArrs, oldField: Node[], fieldData: Field) {
        this.animations = []

        for (const column of moveArrs) {
            if (column.length > 0) {
                let animation = new ColumnAnimation();
                animation.animateRow(speed, column, oldField, fieldData);
                this.animations.push(animation);
            }
        }
    }

    public isCompleted(): boolean {
        return this.animations.length == 0 || this.animations.every((anim) => anim.isDone);
    }
}