import { _decorator, Component, Node, Input, EventTouch, EventTarget, UITransform, Vec3 } from 'cc';
import { GameEvents } from './GameEvents';
const { ccclass, property } = _decorator;

@ccclass('FieldInput')
export class FieldInput extends Component {

    public onFieldTouch = new EventTarget();

    start() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }


    onDestroy() {
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(event: EventTouch) {
        let pos = event.getUILocation();
        console.log("Pos-----> " + pos);
        let posLocal = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(pos.x, pos.y, 0));
        console.log("Local pos ->" + posLocal);

        this.onFieldTouch.emit(GameEvents.onTouchField, posLocal);
    }

}


