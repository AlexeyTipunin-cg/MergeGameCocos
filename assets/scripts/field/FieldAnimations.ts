import { AnimationData } from "../AnimationData";
import { ColumnAnimation } from "./ColumnAnimation";

export class FieldAnimations {

    private animations: ColumnAnimation[] = [];

    public animateField(speed: number, animDatas: AnimationData[][]) {
        this.animations = []

        for (const column of animDatas) {
            if (column.length > 0) {
                let animation = new ColumnAnimation();
                animation.animateColumDrop(speed, column);
                this.animations.push(animation);
            }
        }
    }

    public isCompleted(): boolean {
        return this.animations.length == 0 ||
            this.animations.every(
                (anim) => anim.isDone());
    }
}