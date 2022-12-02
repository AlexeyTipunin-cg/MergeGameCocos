import { _decorator, Component, Node, Input, EventTouch, TiledUserNodeData, UITransform, Vec3 } from 'cc';
import { Field } from './Field';
const { ccclass, property } = _decorator;

@ccclass('FieldInput')
export class FieldInput extends Component {

    public field : Field;

    start() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onDestroy(){
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(event : EventTouch){
        let pos = event.getUILocation();
        console.log("Pos-----> " + pos);
        let posLocal = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(pos.x, pos.y, 0));
        console.log("Local pos ->" + posLocal);
        this.field.getCell(posLocal);
    }
}


