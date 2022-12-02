import { _decorator, Component, Node, random, Prefab, instantiate, UITransform } from 'cc';
import { CellPrefabsFactory } from './CellPrefabsFactory';
import { Field } from './Field';
import { FieldInput } from './FieldInput';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {

    @property({ type: Number })
    private sizeX: number = 9;

    @property({ type: Number })
    private sizeY: number = 9;

    @property({ type: CellPrefabsFactory })
    private cell: CellPrefabsFactory | null = null;

    @property({type: Node})
    private fieldParent : Node = null;

    @property({type: FieldInput})
    private input : FieldInput = null;

    start() {
        console.log("Helllo");
        let filed = new Field(this.fieldParent.getComponent(UITransform).width, this.fieldParent.getComponent(UITransform).height, 0, 0);
        for (let y = 0; y < this.sizeY; y++) {
            for (let x = 0; x < this.sizeX; x++) {
                let node = this.cell.createCell();
                node.parent = this.fieldParent;
                let s : UITransform = node.getComponent(UITransform);
                node.setPosition(s.width * x, s.height * y );
                filed.cells.push(node);
            }
        }
        this.input.field = filed;
    }

    update(deltaTime: number) {

    }
}


