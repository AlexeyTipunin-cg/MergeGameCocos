import { AnimationData } from "../AnimationData";
import { ColumnAnimation } from "./ColumnAnimation";
import { tween, TweenSystem, Vec3 } from 'cc';

export class FieldAnimations {

    private animations: ColumnAnimation[] = [];
    private shuffleTweens = []

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

    public animateShuffle(speed: number, animDatas: AnimationData[]) {
        this.shuffleTweens = []

        for (let index = 0; index < animDatas.length; index++) {
            const vec = animDatas[index];

            let time = Vec3.distance(vec.from, vec.to) / speed;
            let t = tween(vec.target).tag(300).to(time, { position: vec.to }).start();
            this.shuffleTweens.push(TweenSystem.instance.ActionManager.getActionByTag(300, vec.target))
        }

    }

    public isCompleted(): boolean {
        return this.animations.every(
            (anim) => anim.isDone()) && this.shuffleTweens.every((action) => action.isDone());
    }
}