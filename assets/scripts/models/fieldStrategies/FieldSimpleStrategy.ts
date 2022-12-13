import { randomRangeInt, Vec3 } from "cc";
import { CellData } from "../../data/CellData";
import { CellColors, CellTypes } from "../../data/CellTypes";
import { Field } from "../../field/Field";
import { FieldChangeData } from "../../field/FieldChangeData";
import { BombStrategy } from "../../strategies/BombStrategy";
import { CellStrategy } from "../../strategies/CellStrategy";
import { SimpleCellStrategy } from "../../strategies/SimpleStrategy";
import { GameConfig } from '../../config/GameConfig';
import { IFieldStrategy } from './IFieldStrategy';

export class FieldSimpleStrategy implements IFieldStrategy {
    private field: Field;
    private gameConfig: GameConfig;
    private cellColors: CellColors[] = [CellColors.BLUE, CellColors.GREEN, CellColors.PURPLE, CellColors.RED, CellColors.YELLOW];


    constructor(field: Field, gameConfig: GameConfig) {
        this.field = field;
        this.gameConfig = gameConfig
    }

    public onTouch(cellIndex: number, cellType: CellTypes): FieldChangeData | null {

        let strategy = this.chooseStrategy(cellType);

        let killedCells = strategy.getCellsToDestroy(this.field, cellIndex);

        if (killedCells.length > 0) {
            let killedCellsData = killedCells.map((cellIndex) => this.field.cells[cellIndex]);
            killedCells.forEach(cellIndex => this.destroyCell(cellIndex))

            let oldCells = Object.assign([], this.field.cells);
            let fieldCopy = Object.assign([], this.field.cells);
            for (let index = 0; index < this.field.col; index++) {
                this.packColumn(index, fieldCopy);
            }

            let newCells = this.generateNewCells(fieldCopy);

            let newField = new Field(
                this.gameConfig.cellSize.x,
                this.gameConfig.cellSize.y,
                this.gameConfig.sizeX,
                this.gameConfig.sizeY
            );
            newField.cells = fieldCopy;

            let oldField = new Field(
                this.gameConfig.cellSize.x,
                this.gameConfig.cellSize.y,
                this.gameConfig.sizeX,
                this.gameConfig.sizeY
            );
            oldField.cells = oldCells;

            this.field.cells = fieldCopy;

            let fieldChangeData: FieldChangeData = new FieldChangeData(killedCellsData, newCells, oldField, newField);
            return fieldChangeData;
        }

        return null
    }

    private chooseStrategy(cellType: CellTypes): CellStrategy {
        switch (cellType) {
            case CellTypes.SIMPLE:
                return new SimpleCellStrategy();
            case CellTypes.BOMB:
                return new BombStrategy();
        }
    }

    private packColumn(colIndex: number, fieldCopy: CellData[]): void {
        let colIndecies = this.field.getColumnIndices(colIndex);
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
                empty = empty + this.field.col;
            }
        }
    }

    private generateNewCells(field: CellData[]): CellData[] {
        let newCells = [];
        for (let colIndex = 0; colIndex < this.field.col; colIndex++) {
            let colIndecies = this.field.getColumnIndices(colIndex);
            let newIndex = 0;

            for (const index of colIndecies) {
                let cell = field[index];
                if (!cell) {
                    let createPos = this.field.row + newIndex;
                    let cellData = this.createCell(colIndex, createPos);
                    newCells.push(cellData);
                    field[index] = cellData;
                    newIndex++;
                }
            }
        }

        return newCells;
    }

    private createCell(x: number, y: number): CellData {
        let cellTypeNum = randomRangeInt(0, this.cellColors.length);
        let cellData = new CellData();
        cellData.type = this.cellColors[cellTypeNum];
        cellData.virtualCol = x;
        cellData.virtualRow = y;
        return cellData;
    }

    private destroyCell(index: number) {
        if (this.field.cells[index]) {
            this.field.cells[index] = null;
        }
    }
}