import { tween, UIOpacity, Vec2, EventTarget } from 'cc';
import { AnimationEvents } from './AnimationEvents';

export class DisappearAnimation {

    public onComplete: EventTarget = new EventTarget();
    private _isDone: boolean = true;

    public playAnimation(opacityComponents: UIOpacity[]) {
        let alpha = new Vec2(255);
        this._isDone = false;
        let t = tween(alpha).tag(200).to(0.2, { x: 0 }, {
            onUpdate: (target) => {
                for (const opComponent of opacityComponents) {
                    opComponent.opacity = (target as Vec2).x;
                }
            },
        }).call(() => {
            this._isDone = true;
            this.onComplete.emit(AnimationEvents.onComplete)
        }).start();
    }

    public isDone() {
        return this._isDone
    }
}