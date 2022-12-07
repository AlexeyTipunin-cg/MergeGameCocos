import { _decorator, Component, Node, random, Prefab, instantiate, UITransform, Vec3, tween, Sprite, Vec2, UIOpacity, CCInteger, CCFloat, Tween, TweenAction, TweenSystem } from 'cc';
import { AnimationData } from './AnimationData';
import { Cell, CellData } from './Cell';
import { CellPrefabsFactory } from './CellPrefabsFactory';
import { ColumnAnimation } from './ColumnAnimation';
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
    private speed = 10000;

    private animation: FieldAnimations;

    private cellDataToView = new Map<CellData, Cell>();

    public startGame(): void {
        this.createField();
        this.input.onFieldTouch.on(GameEvents.onTouchField, this.onTouchScreen, this);
        this.animation = new FieldAnimations();
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
                this.getNewField();
                this.blockInput = false;
            }).start();
        }
    }

    private generateNewCells(): AnimationData[][] {
        let moveAnimaData: AnimationData[][] = new Array(this.fieldData.col);
        for (let colIndex = 0; colIndex < this.fieldData.col; colIndex++) {
            let colIndecies = this.fieldData.getColumn(colIndex);
            let newIndex = 0;

            moveAnimaData[colIndex] = [];


            for (const index of colIndecies) {
                let cell = this.fieldData.cells[index];
                if (!cell) {
                    let createPos = this.fieldData.row + newIndex;
                    let n = this.createCell(colIndex, createPos);
                    let animData = new AnimationData();
                    animData.target = n.node;
                    animData.from = this.fieldData.XYToindex(colIndex, createPos);
                    animData.to = index;
                    moveAnimaData[colIndex].push(animData);
                    this.fieldData.cells[index] = n.cellData;
                    newIndex++;
                }
            }
        }

        return moveAnimaData;
    }

    private getNewField() {
        let changedField = Object.assign([], this.fieldData.cells);
        let moveArrs: AnimationData[][] = new Array(this.fieldData.col);
        for (let index = 0; index < this.fieldData.col; index++) {
            moveArrs[index] = this.packColumn(index, changedField);
        }

        this.fieldData.cells = changedField;


        let newCellsAnimArr = this.generateNewCells();
        for (let index = 0; index < moveArrs.length; index++) {
            moveArrs[index].push(...newCellsAnimArr[index]);

        }

        this.animation.animateField(this.speed, moveArrs, this.fieldData);
    }

    private packColumn(colIndex: number, fieldCopy: CellData[]): AnimationData[] {
        let colIndecies = this.fieldData.getColumn(colIndex);
        let empty = undefined;
        let moveArr: AnimationData[] = [];

        for (const itemIndex of colIndecies) {
            const element = fieldCopy[itemIndex];
            if (empty === undefined && !element) {
                empty = itemIndex;
            }

            if (empty !== undefined && element) {
                let cellData = fieldCopy[itemIndex];
                let animData = new AnimationData();
                animData.target = this.cellDataToView.get(cellData).node;
                animData.from = itemIndex;
                animData.to = empty;
                moveArr.push(animData);
                fieldCopy[empty] = cellData;
                fieldCopy[itemIndex] = null;
                empty = empty + this.fieldData.col;
            }
        }

        return moveArr;
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


