import {
  _decorator,
  Component,
  Node,
  EventTarget,
  Vec3,
  CCFloat,
  randomRangeInt,
} from "cc";
import { AnimationData } from "../AnimationData";
import { Cell, CellData } from '../Cell';
import { CellPrefabsFactory } from "../CellPrefabsFactory";
import { Field } from "./Field";
import { FieldInput } from "./FieldInput";
import { GameEvents } from "../GameEvents";
import { SimpleCellStrategy } from "../SimpleStrategy";
import { GameConfig } from "../GameConfig";
import { CellTypes } from '../CellTypes';
const { ccclass, property } = _decorator;

@ccclass("FieldModel")
export class FieldModel extends Component {
  private fieldData: Field = null;

  @property(CCFloat)
  private speed = 1000;
  public onCellsDestoy = new EventTarget();
  public onCellsCreated = new EventTarget();
  public gameConfig: GameConfig = null;

  private simpleCellTypes: CellTypes[] = [CellTypes.BLUE, CellTypes.GREEN, CellTypes.PURPLE, CellTypes.RED, CellTypes.YELLOW];

  public startGame(config: GameConfig): void {
    this.gameConfig = config;
    this.createField();
  }


  public createField(): void {

    this.fieldData = new Field(
      cellWdith,
      cellHeight,
      this.gameConfig.sizeX,
      this.gameConfig.sizeY
    );

    for (let y = 0; y < this.fieldData.sizeY; y++) {
      for (let x = 0; x < this.fieldData.sizeX; x++) {
        let cell = this.createCell(x, y);
        this.fieldData.cells.push(cell);
      }
    }

    this.onCellsCreated.emit(GameEvents.onCellsCreated, this.fieldData.cells);
  }

  private createCell(x: number, y: number): CellData {
    let cellTypeNum = randomRangeInt(0, this.simpleCellTypes.length);
    let cellData = new CellData();
    cellData.type = this.simpleCellTypes[cellTypeNum];
    cellData.col = x;
    cellData.row = y;
    return cellData;
  }

  public onTouch(pos: Vec3) {
    let strategy = new SimpleCellStrategy();

    let clickedCellIndex = this.fieldData.screenPosToIndex(pos);

    let killedCells = strategy.calculateKilledCells(this.fieldData, clickedCellIndex);

    if (killedCells.length > 0) {
      let killedCellsData = killedCells.map(
        (cellIndex) => this.fieldData.cells[cellIndex]);

      this.onCellsDestoy.emit(GameEvents.onCellsDestoy, killedCellsData);
    }
  }

  // private onTouchScreen(pos: Vec3) {


  //   let strategy = new SimpleCellStrategy();

  //   let killedCells = strategy.calculateKilledCells(this.fieldData, pos);
  //   if (killedCells.length > 0) {
  //     this.blockInput = true;
  //     let killedCellsData = killedCells.map(
  //       (cellIndex) => this.fieldData.cells[cellIndex]
  //     );
  //     let opacityComponent = killedCellsData.map((value) =>
  //       this.cellDataToView.get(value).getComponent(UIOpacity)
  //     );

  //     let alpha = new Vec2(255);
  //     tween(alpha)
  //       .to(
  //         0.2,
  //         { x: 0 },
  //         {
  //           onUpdate: (target) => {
  //             for (const opComponent of opacityComponent) {
  //               opComponent.opacity = (target as Vec2).x;
  //             }
  //           },
  //         }
  //       )
  //       .call(() => {
  //         killedCells.forEach((value) => this.destroyCell(value));
  //         this.onCellsDestoy.emit(GameEvents.onCellsDestoy, killedCells.length);
  //         this.getNewField();
  //         this.blockInput = false;
  //       })
  //       .start();
  //   }
  // }

  private generateNewCells(field: CellData[]): void {
    for (let colIndex = 0; colIndex < this.fieldData.col; colIndex++) {
      let colIndecies = this.fieldData.getColumnIndices(colIndex);
      let newIndex = 0;

      for (const index of colIndecies) {
        let cell = field[index];
        if (!cell) {
          let createPos = this.fieldData.row + newIndex;
          let cellData = new CellData();
          cellData
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

    let moveArrs = this.createFieldDif(oldField, changedField);
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

  private createFieldDif(
    oldField: CellData[],
    newField: CellData[]
  ): AnimationData[][] {
    let animationData: AnimationData[][] = new Array(this.fieldData.col);
    for (let index = 0; index < this.fieldData.col; index++) {
      let indices = this.fieldData.getColumnIndices(index);

      let col = [];
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
    }
  }
}
