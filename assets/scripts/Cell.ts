import { _decorator, Component, Node, input, Input, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Cell')
export class Cell extends Component {
    start() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    update(deltaTime: number) {

    }

    onDestroy(){
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(event : EventTouch){
        this.node.destroy();
    }

}


