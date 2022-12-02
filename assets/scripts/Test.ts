import { _decorator, Component, Node, Sprite, game, Prefab, instantiate, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {

    @property({ type: Number })
    private sizeX: number = 5;

    @property({ type: Number })
    private sizeY: number = 5;

    @property({ type: Prefab })
    private cell: Prefab | null = null;

    start() {
        for (let y = 0; y < this.sizeY; y++) {
            for (let x = 0; x < this.sizeX; x++) {
                const node = instantiate(this.cell);
                node.parent = this.node;
                let s : UITransform = node.getComponent(UITransform);
                node.setPosition(s.width * x, s.height * y );
            }
        }
    }

    update(deltaTime: number) {

    }
}


