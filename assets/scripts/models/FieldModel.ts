import { _decorator, Component, EventTarget, Vec3, randomRangeInt, Enum, random } from 'cc';
import { CellData } from "../data/CellData";
import { Field } from "../field/Field";
import { GameEvents } from '../data/GameEvents';
import { SimpleCellStrategy } from '../strategies/SimpleStrategy';
import { GameConfig } from "../config/GameConfig";
import { CellTypes, CellColors } from '../data/CellTypes';
import { FieldChangeData } from '../field/FieldChangeData';
import { IFieldStrategy } from './fieldStrategies/IFieldStrategy';
import { FieldSimpleStrategy } from './fieldStrategies/FieldSimpleStrategy';
import { FieldPairStrategy } from './fieldStrategies/FieldPairStrategy';

export class FieldModel extends Component {
  private fieldData: Field = null;
  public onCellsDestoy = new EventTarget();
  public onCellsCreated = new EventTarget();
  public onNoPairs = new EventTarget();
  public gameConfig: GameConfig = null;

  private cellModificator: CellTypes = CellTypes.SIMPLE;
  private cellColors: CellColors[] = [CellColors.BLUE, CellColors.GREEN, CellColors.PURPLE, CellColors.RED, CellColors.YELLOW];
  private fieldStrategy: IFieldStrategy;

  public startGame(config: GameConfig): void {
    this.gameConfig = config;
    this.createField();
    this.fieldStrategy = new FieldSimpleStrategy(this.fieldData, this.gameConfig);
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

  public addModifier(cellType: CellTypes) {
    this.cellModificator = cellType;
  }

  public changeFieldBehaviour() {
    this.fieldStrategy = new FieldPairStrategy(this.fieldData, this.gameConfig);
  }

  private createCell(x: number, y: number): CellData {
    let cellTypeNum = randomRangeInt(0, this.cellColors.length);
    let cellData = new CellData();
    cellData.type = this.cellColors[cellTypeNum];
    cellData.virtualCol = x;
    cellData.virtualRow = y;
    return cellData;
  }

  public onTouch(pos: Vec3): void {

    let clickedCell = this.fieldData.screenPosToIndex(pos);

    let fieldChangeData = this.fieldStrategy.onTouch(clickedCell, this.cellModificator);

    if (fieldChangeData !== null) {
      this.cellModificator = CellTypes.SIMPLE;
      if (!(this.fieldStrategy instanceof FieldSimpleStrategy)) {
        this.fieldStrategy = new FieldSimpleStrategy(this.fieldData, this.gameConfig);
      }
      this.onCellsDestoy.emit(GameEvents.onFieldUpdate, fieldChangeData);

      if (!this.hasPairs(this.fieldData)) {
        this.onNoPairs.emit(GameEvents.onNoPairs);
      }
    }
  }

  public shuffle(): void {
    let oldFieldCells = Object.assign([], this.fieldData.cells);
    let newField = Object.assign([], this.fieldData.cells);
    let field = this.fieldData;
    for (let index = 0; index < field.cellsCount; index++) {
      let randomIndex = randomRangeInt(0, field.cellsCount);
      let temp = field.cells[index];
      field.cells[index] = field.cells[randomIndex];
      field.cells[randomIndex] = temp;
    }


    let oldField = new Field(
      this.gameConfig.cellSize.x,
      this.gameConfig.cellSize.y,
      this.gameConfig.sizeX,
      this.gameConfig.sizeY
    );
    oldField.cells = oldFieldCells;

    let fieldChangeData: FieldChangeData = new FieldChangeData([], [], oldField, this.fieldData);
    this.onCellsDestoy.emit(GameEvents.onFieldUpdate, fieldChangeData);

    if (!this.hasPairs(this.fieldData)) {
      this.onNoPairs.emit(GameEvents.onNoPairs);
    }
  }

  private hasPairs(field: Field): boolean {

    let traverseStrategy = new SimpleCellStrategy();
    for (let index = 0; index < field.cells.length; index++) {
      let cellsSameColors = traverseStrategy.getCellsToDestroy(field, index);
      if (cellsSameColors.length > 1) {
        return true;
      }
    }
    return false;
  }
}
