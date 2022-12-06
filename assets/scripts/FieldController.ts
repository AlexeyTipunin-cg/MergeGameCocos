import { _decorator, Component, Node, random, Prefab, instantiate, UITransform, Vec3, tween, Sprite, Vec2, UIOpacity, CCInteger, CCFloat, Tween, TweenAction, TweenSystem } from 'cc';
import { CellPrefabsFactory } from './CellPrefabsFactory';
import { ColumnAnimation } from './ColumnAnimation';
import { Field } from './Field';
import { FieldInput } from './FieldInput';
import { GameEvents } from './GameEvents';
import { SimpleStrategy } from './SimpleStrategy';
const { ccclass, property } = _decorator;

@ccclass('FieldController')
export class FieldController extends Component {

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
    private speed = 10000;

    public startGame(): void {
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

            let animation = new ColumnAnimation();
            animation.animateRow(this.speed, moveArr, oldField, this.fieldData);
        }

    }

    private animateRow(moveArr: Vec2[], field: Node[]) {
        let tweens = [];

        for (let elementIndex = 0; elementIndex < moveArr.length; elementIndex++) {
            let vec = moveArr[elementIndex];
            let cell = field[vec.x];
            let newPos = this.fieldData.indexToFieldPos(vec.y);
            let time = (vec.x - vec.y) * this.fieldData.cellHeight / this.speed;
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


