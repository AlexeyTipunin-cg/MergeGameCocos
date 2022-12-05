import { _decorator, Component, Node, random, Prefab, instantiate, UITransform, Vec3, tween, Sprite, Vec2, UIOpacity, CCInteger, CCFloat, Tween, TweenAction, TweenSystem } from 'cc';
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

    private blockInput: boolean = false;

    @property(CCFloat)
    private speed = 10;

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
                let cell = this.createCell(x, y);
                this.fieldData.cells.push(cell);
            }
        }
    }

    private createCell(x: number, y: number): Node {
        let node = this.cellsFactory.createCell();
        node.parent = this.fieldParent;
        let s: UITransform = node.getComponent(UITransform);
        node.setPosition(s.width * x, s.height * y);
        return node;
    }

    private onTouchScreen(pos: Vec3) {

        if (this.blockInput) {
            return;
        }

        let strategy = new SimpleStrategy();

        let killedCells = strategy.calculateKilledCells(this.fieldData, pos);
        if (killedCells.length > 0) {
            this.blockInput = true;
            let opacityComponent = killedCells.map((value) => this.fieldData.cells[value].getComponent(UIOpacity));


            let alpha = new Vec2(255);
            tween(alpha).to(0.2, { x: 0 }, {
                onUpdate: (target) => {
                    for (const opComponent of opacityComponent) {
                        opComponent.opacity = (target as Vec2).x;
                    }
                }, onComplete: () => {
                    killedCells.forEach((value) => this.destroyCell(value));
                    this.generateNewCells();
                }
            }).start();
        }
    }

    private generateNewCells() {

        let t: Tween<Node>[] = [];
        for (let index = 0; index < this.fieldData.col; index++) {
            this.packColumn(index);
        }




        // tween(this.node).parallel(...t).call(() => {
        //     this.blockInput = false;
        //     console.log("ANIMATIONS STOPED")
        // }).start();
        // for (let index = 0; index < this.fieldData.cells.length; index++) {
        //     const element = this.fieldData.cells[index];
        //     if (element == null) {
        //         let gridPos = this.fieldData.indexToXY(index);
        //         let cell = this.createCell(gridPos.x, gridPos.y);
        //         this.fieldData.cells[index] = cell;
        //     }

        // }
    }

    private generateNewCellsInCol(colIndex: number) {
        let colItems = this.fieldData.getColumn(colIndex);
        for (const itemIndex of colItems) {
            const element = this.fieldData.cells[itemIndex];
            if (element == null) {
                let gridPos = this.fieldData.indexToXY(itemIndex);
                let cell = this.createCell(gridPos.x, gridPos.y);
                this.fieldData.cells[itemIndex] = cell;
            }
        }
    }

    private packColumn(colIndex: number) {
        let colIndecies = this.fieldData.getColumn(colIndex);
        let empty = undefined;
        let moveArr: Vec2[] = [];
        let oldField = Object.assign([], this.fieldData.cells);
        let newField = Object.assign([], this.fieldData.cells);

        for (const itemIndex of colIndecies) {
            const element = newField[itemIndex];
            if (empty === undefined && !element) {
                empty = itemIndex;
            }

            if (empty !== undefined && element) {

                moveArr.push(new Vec2(itemIndex, empty));
                newField[empty] = newField[itemIndex];
                newField[itemIndex] = null;
                empty = empty + this.fieldData.col;
            }
        }

        if (moveArr.length > 0) {
            for (const pos of moveArr) {
                this.fieldData.cells = newField;
            }

            this.animateRow(moveArr, oldField);
        }

    }

    private animateRow(moveArr: Vec2[], field: Node[]) {
        let tweens = [];

        for (let elementIndex = 0; elementIndex < moveArr.length; elementIndex++) {
            let vec = moveArr[elementIndex];
            let cell = field[vec.x];
            let newPos = this.fieldData.indexToFieldPos(vec.y);
            let time = (vec.x - vec.y) * this.fieldData.cellHeight / this.speed;
            if (cell.position.y === newPos.y) {
                console.log("dfdf");
                let i = time + 5;
            }
            console.log(`${cell.position} -------> ${newPos}`);
            let t = tween(cell).to(time, { position: newPos }).start();
            this.blockInput = false;
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

class AnimatioData {
    public from: Vec2[];
    public to: Vec2[];
    public nodes: Node[];


    public Animate() {
        let delta = this.from[0].subtract(this.to[0]);
        tween(new Vec2()).to(1, { x: 1 }, {
            onUpdate: (value) => {
                for (let index = 0; index < this.nodes.length; index++) {
                    const element = this.nodes[index];
                    let to = this.to[index];
                    let from = this.from[index];
                    let newPos = to.subtract(delta.multiplyScalar((value as Vec2).x))

                    element.setPosition(new Vec3(newPos.x, newPos.y, 0));
                }
            }
        })
    }


}


