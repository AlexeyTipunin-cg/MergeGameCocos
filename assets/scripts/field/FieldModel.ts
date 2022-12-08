import { _decorator, Component, EventTarget, Vec3, randomRangeInt } from "cc";
import { CellData } from '../Cell';
import { Field } from "./Field";
import { GameEvents } from "../GameEvents";
import { SimpleCellStrategy } from "../SimpleStrategy";
import { GameConfig } from "../GameConfig";
import { CellTypes } from '../CellTypes';

export class FieldModel extends Component {
  private fieldData: Field = null;
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
      this.gameConfig.cellSize.x,
      this.gameConfig.cellSize.y,
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
    cellData.virtualCol = x;
    cellData.virtualRow = y;
    return cellData;
  }

  public onTouch(pos: Vec3) {
    let strategy = new SimpleCellStrategy();

    let clickedCellIndex = this.fieldData.screenPosToIndex(pos);

    let killedCells = strategy.calculateKilledCells(this.fieldData, clickedCellIndex);

    if (killedCells.length > 0) {
      let killedCellsData = killedCells.map((cellIndex) => this.fieldData.cells[cellIndex]);
      killedCells.forEach(cellIndex => this.destroyCell(cellIndex))

      this.getNewField(killedCellsData);
    }
  }

  private generateNewCells(field: CellData[]): CellData[] {
    let newCells = [];
    for (let colIndex = 0; colIndex < this.fieldData.col; colIndex++) {
      let colIndecies = this.fieldData.getColumnIndices(colIndex);
      let newIndex = 0;

      for (const index of colIndecies) {
        let cell = field[index];
        if (!cell) {
          let createPos = this.fieldData.row + newIndex;
          let cellData = this.createCell(colIndex, createPos);
          newCells.push(cellData);
          field[index] = cellData;
          newIndex++;
        }
      }
    }

    return newCells;
  }

  private getNewField(killedCells) {
    let oldCells = Object.assign([], this.fieldData.cells);
    let changedField = Object.assign([], this.fieldData.cells);
    for (let index = 0; index < this.fieldData.col; index++) {
      this.packColumn(index, changedField);
    }

    let newCells = this.generateNewCells(changedField);
    this.fieldData.cells = changedField;

    let newField = new Field(
      this.gameConfig.cellSize.x,
      this.gameConfig.cellSize.y,
      this.gameConfig.sizeX,
      this.gameConfig.sizeY
    );
    newField.cells = changedField;

    let oldField = new Field(
      this.gameConfig.cellSize.x,
      this.gameConfig.cellSize.y,
      this.gameConfig.sizeX,
      this.gameConfig.sizeY
    );
    oldField.cells = oldCells
    this.onCellsDestoy.emit(GameEvents.onCellsDestoy, killedCells, newCells, oldField, newField);
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

  private destroyCell(index: number) {
    if (this.fieldData.cells[index]) {
      this.fieldData.cells[index] = null;
    }
  }
}
