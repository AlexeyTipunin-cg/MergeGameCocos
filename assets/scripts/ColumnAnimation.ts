import { tween, Vec2, Node, TweenAction, Tween, TweenSystem, tweenUtil } from "cc";
import { AnimationData } from "./AnimationData";
import { Field } from "./Field";

export class ColumnAnimation {

    private tweens = []
    private readonly TWEEN_TAG = 100;

    public animateColumDrop(speed: number, animDatas: AnimationData[]): void {

        this.tweens = []
        for (let index = 0; index < animDatas.length; index++) {
            const vec = animDatas[index];
            let time = (vec.from.y - vec.to.y) / speed;
            let t = tween(vec.target).tag(this.TWEEN_TAG).to(time, { position: vec.to }).start();
            this.tweens.push(TweenSystem.instance.ActionManager.getActionByTag(this.TWEEN_TAG, vec.target))
        }
    }

    public isDone(): boolean {
        let completed: boolean = true
        for (const tween of this.tweens) {
            if (!tween.isDone()) {
                completed = false;
                break;
            }
        }

        return completed;
    }

}