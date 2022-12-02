import { _decorator, Component, Node, random, Prefab, instantiate, UITransform, Vec3 } from 'cc';
import { CellPrefabsFactory } from './CellPrefabsFactory';
import { Field } from './Field';
import { FieldInput } from './FieldInput';
import { GameEvents } from './GameEvents';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {

    @property({ type: Number })
    private sizeX: number = 9;

    @property({ type: Number })
    private sizeY: number = 9;

    @property({ type: CellPrefabsFactory })
    private cellsFactory: CellPrefabsFactory | null = null;

    @property({ type: Node })
    private fieldParent: Node = null;

    @property({ type: FieldInput })
    private input: FieldInput = null;

    private fieldData: Field = null;

    start() {
        this.createField();
        this.input.onFieldTouch.on(GameEvents.onTouchField, this.onTouchScreen, this);
    }

    private createField(): void {
        let cellWdith = this.cellsFactory.getCellWidth();
        let cellHeight = this.cellsFactory.getCellHeight();

        this.fieldData = new Field(cellWdith, cellHeight, this.sizeX, this.sizeY);
        for (let y = 0; y < this.sizeY; y++) {
            for (let x = 0; x < this.sizeX; x++) {
                let node = this.cellsFactory.createCell();
                node.parent = this.fieldParent;
                let s: UITransform = node.getComponent(UITransform);
                node.setPosition(s.width * x, s.height * y);
                this.fieldData.cells.push(node);
            }
        }

        console.log("F----->" + this.fieldData);
    }


    onDestroy() {
        this.input.onFieldTouch.off(GameEvents.onTouchField, this.onTouchScreen, this);
    }

    private onTouchScreen(pos: Vec3) {
        console.log("F----->" + this.fieldData);
        let cellToDestroy = this.fieldData.getCell(pos);

        if (cellToDestroy != null) {
            this.fieldData.removeCell(pos)
            cellToDestroy.destroy();
        }
    }

}


