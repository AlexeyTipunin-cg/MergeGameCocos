import { _decorator, Component, Node, random, Prefab, instantiate, UITransform, Vec3, tween, Sprite, Vec2, UIOpacity } from 'cc';
import { CellPrefabsFactory } from './CellPrefabsFactory';
import { Field } from './Field';
import { FieldInput } from './FieldInput';
import { GameEvents } from './GameEvents';
import { SimpleStrategy } from './SimpleStrategy';
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
                let cell = this.createCell(x,y);
                this.fieldData.cells.push(cell);
            }
        }
    }

    private createCell(x: number, y: number) : Node{
        let node = this.cellsFactory.createCell();
        node.parent = this.fieldParent;
        let s: UITransform = node.getComponent(UITransform);
        node.setPosition(s.width * x, s.height * y);
        return node;
    }

    private onTouchScreen(pos: Vec3) {
        let strategy = new SimpleStrategy();

        let killedCells = strategy.calculateKilledCells(this.fieldData, pos);

        for (const cellIndex of killedCells) {
            tween(this.fieldData.cells[cellIndex].getComponent(UIOpacity)).to(0.2, {opacity : 0}, {onComplete: () => this.destroyCell(cellIndex)}).start();
        }

        this.generateNewCells();
    }

    private generateNewCells(){
        for (let index = 0; index < this.fieldData.cells.length; index++) {
            const element = this.fieldData.cells[index];
            if (element == null){
                let gridPos = this.fieldData.indexToXY(index);
                let cell = this.createCell(gridPos.x,gridPos.y);
                this.fieldData[index] = cell;
            }
            
        }
    }

    private destroyCell(index: number) {
        if (this.fieldData.cells[index] != null) {
            let cellToDestroy = this.fieldData.cells[index];
            this.fieldData.cells[index] = null;
            cellToDestroy.destroy();
        }
    }

}


