import { CellTypes } from "../../data/CellTypes";
import { Field } from "../../field/Field";
import { FieldChangeData } from "../../field/FieldChangeData";
import { GameConfig } from '../../config/GameConfig';
import { IFieldStrategy } from './IFieldStrategy';

export class FieldPairStrategy implements IFieldStrategy {
    private field: Field;
    private gameConfig: GameConfig;


    private firstIndex: number = null;
    private secondIndex: number = null;


    constructor(field: Field, gameConfig: GameConfig) {
        this.field = field;
        this.gameConfig = gameConfig
    }

    public onTouch(cellIndex: number, cellType: CellTypes): FieldChangeData | null {
        if (this.firstIndex === null || this.firstIndex === cellIndex) {
            this.firstIndex = cellIndex;
            return null;
        }

        this.secondIndex = cellIndex;


        let oldCells = Object.assign([], this.field.cells);

        let oldField = new Field(
            this.gameConfig.cellSize.x,
            this.gameConfig.cellSize.y,
            this.gameConfig.sizeX,
            this.gameConfig.sizeY
        );
        oldField.cells = oldCells;

        let fieldCopy = Object.assign([], this.field.cells);

        [fieldCopy[this.firstIndex], fieldCopy[this.secondIndex]] =
            [fieldCopy[this.secondIndex], fieldCopy[this.firstIndex]];
        let newField = new Field(
            this.gameConfig.cellSize.x,
            this.gameConfig.cellSize.y,
            this.gameConfig.sizeX,
            this.gameConfig.sizeY
        );
        newField.cells = fieldCopy;



        this.field.cells = fieldCopy;

        let fieldChangeData: FieldChangeData = new FieldChangeData([], [], oldField, newField);
        return fieldChangeData;
    }
}