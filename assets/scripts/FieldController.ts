import { _decorator, Component, Node, EventTarget, UITransform, Vec3, tween,  Vec2, UIOpacity, CCInteger, CCFloat, dynamicAtlasManager } from 'cc';
import { AnimationData } from './AnimationData';
import { Cell, CellData } from './Cell';
import { CellPrefabsFactory } from './CellPrefabsFactory';
import { Field } from './Field';
import { FieldAnimations } from './FieldAnimations';
import { FieldInput } from './FieldInput';
import { GameEvents } from './GameEvents';
import { SimpleCellStrategy } from './SimpleStrategy';
const { ccclass, property } = _decorator;

@ccclass('FieldController')
export class FieldController extends Component {

    @property({ type: CCInteger })
    private sizeX: number = 9;

    @property({ type: CCInteger })
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
    private speed = 1000;

    private animation: FieldAnimations;

    private cellDataToView = new Map<CellData, Cell>();
    public onCellsDestoy = new EventTarget();

    start(){
        this.input.onFieldTouch.on(GameEvents.onTouchField, this.onTouchScreen, this);
    }

    public startGame(): void {
        dynamicAtlasManager.enabled = false;
        this.createField();
        this.animation = new FieldAnimations();
        this.blockInput = false;
    }

    public resetGame(): void{
        for (const cellComponent of this.cellDataToView.values()) {
            cellComponent.node.destroy();
        }

        this.cellDataToView.clear();
    }

    private createField(): void {
        let cellWdith = this.cellsFactory.getCellWidth();
        let cellHeight = this.cellsFactory.getCellHeight();

        this.fieldData = new Field(cellWdith, cellHeight, this.sizeX, this.sizeY);
        for (let y = 0; y < this.sizeY; y++) {
            for (let x = 0; x < this.sizeX; x++) {
                let cell = this.createCell(x, y);
                this.fieldData.cells.push(cell.cellData);
            }
        }
    }

    private createCell(x: number, y: number): Cell {
        let cellComponent = this.cellsFactory.createCell();
        cellComponent.node.parent = this.fieldParent;
        let s: UITransform = cellComponent.getComponent(UITransform);
        cellComponent.node.setPosition(s.width * x, s.height * y);
        this.cellDataToView.set(cellComponent.cellData, cellComponent);
        return cellComponent;
    }

    private onTouchScreen(pos: Vec3) {

        if (!this.animation.isCompleted() || this.blockInput) {
            return;
        }

        let strategy = new SimpleCellStrategy();

        let killedCells = strategy.calculateKilledCells(this.fieldData, pos);
        if (killedCells.length > 0) {
            this.blockInput = true;
            let killedCellsData = killedCells.map((cellIndex) => this.fieldData.cells[cellIndex]);
            let opacityComponent = killedCellsData.map((value) => this.cellDataToView.get(value).getComponent(UIOpacity));

            let alpha = new Vec2(255);
            tween(alpha).to(0.2, { x: 0 }, {
                onUpdate: (target) => {
                    for (const opComponent of opacityComponent) {
                        opComponent.opacity = (target as Vec2).x;
                    }
                }
            }).call(() => {
                killedCells.forEach((value) => this.destroyCell(value));
                this.onCellsDestoy.emit(GameEvents.onCellsDestoy, killedCells.length)
                this.getNewField();
                this.blockInput = false;
            }).start();
        }
    }

    private generateNewCells(field: CellData[]): void {
        for (let colIndex = 0; colIndex < this.fieldData.col; colIndex++) {
            let colIndecies = this.fieldData.getColumnIndices(colIndex);
            let newIndex = 0;

            for (const index of colIndecies) {
                let cell = field[index];
                if (!cell) {
                    let createPos = this.fieldData.row + newIndex;
                    let n = this.createCell(colIndex, createPos);
                    field[index] = n.cellData;
                    newIndex++;
                }
            }
        }

    }

    private getNewField() {
        let oldField = Object.assign([], this.fieldData.cells);
        let changedField = Object.assign([], this.fieldData.cells);
        for (let index = 0; index < this.fieldData.col; index++) {
            this.packColumn(index, changedField);
        }

        this.generateNewCells(changedField);
        this.fieldData.cells = changedField;

        let moveArrs = this.createFieldDif(oldField, changedField)
        this.animation.animateField(this.speed, moveArrs);
    }

    private packColumn(colIndex: number, fieldCopy: CellData[]): void {
        let colIndecies = this.fieldData.getColumnIndices(colIndex);
        let empty = undefined;

        for (const itemIndex of colIndecies) {
            const element = fieldCopy[itemIndex];
            if (empty === undefined && !element) {
                empty = itemIndex;
            }

            if (empty !== undefined && element) {
                let cellData = fieldCopy[itemIndex];
                fieldCopy[empty] = cellData;
                fieldCopy[itemIndex] = null;
                empty = empty + this.fieldData.col;
            }
        }
    }

    private createFieldDif(oldField: CellData[], newField: CellData[]): AnimationData[][] {
        let animationData: AnimationData[][] = new Array(this.fieldData.col);
        for (let index = 0; index < this.fieldData.col; index++) {
            let indices = this.fieldData.getColumnIndices(index);

            let col = []
            animationData[index] = col;

            for (const cellIndex of indices) {
                const element = newField[cellIndex];
                const oElement = oldField[cellIndex];
                if (element === oElement) {
                    continue;
                }

                let targetNode = this.cellDataToView.get(element).node;

                let animData: AnimationData = new AnimationData();
                animData.target = targetNode;
                animData.from = targetNode.position;
                animData.to = this.fieldData.indexToFieldPos(cellIndex);
                col.push(animData);
            }
        }

        return animationData;
    }

    private destroyCell(index: number) {
        if (this.fieldData.cells[index] != null) {
            let cellToDestroy = this.fieldData.cells[index];
            this.fieldData.cells[index] = null;
            let cellView = this.cellDataToView.get(cellToDestroy);
            cellView.node.destroy();
            this.cellDataToView.delete(cellToDestroy)
        }
    }

}


